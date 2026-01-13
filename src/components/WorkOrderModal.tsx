import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import {
  TextInput,
  TextArea,
  CurrencyInput,
  Select,
} from './FormInputs';
import { useDatabaseContext } from '../context/DatabaseContext';
import {
  WorkOrder,
  WorkOrderItem,
  UUID,
  Client,
  Service,
  Part,
} from '../types/index';
import {
  createEmptyWorkOrder,
  createEmptyWorkOrderItem,
  generateUUID,
  calculateWorkOrderTotal,
} from '../utils/helpers';
import { validateWorkOrder } from '../utils/validators';
import '../styles/WorkOrderModal.css';

interface WorkOrderModalProps {
  isOpen: boolean;
  workOrderId?: UUID;
  clientId?: UUID;
  onClose: () => void;
}

export function WorkOrderModal({
  isOpen,
  workOrderId,
  clientId,
  onClose,
}: WorkOrderModalProps) {
  const db = useDatabaseContext();
  const [form, setForm] = useState<WorkOrder>(
    createEmptyWorkOrder(clientId || ('' as UUID))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<WorkOrderItem[]>([]);

  const isEditing = !!workOrderId;

  useEffect(() => {
    if (isEditing && workOrderId) {
      const existing = db.getWorkOrder(workOrderId);
      if (existing) {
        setForm(existing);
        setItems(existing.items);
      }
    } else if (clientId) {
      setForm(createEmptyWorkOrder(clientId));
    }
  }, [isOpen, isEditing, workOrderId, clientId, db]);

  const handleAddItem = () => {
    const newItem = createEmptyWorkOrderItem();
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof WorkOrderItem,
    value: any
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate total
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }

    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workOrder: WorkOrder = {
      ...form,
      items,
      totalValue: calculateWorkOrderTotal(items),
    };

    const validationErrors = validateWorkOrder(workOrder);
    if (validationErrors.length > 0) {
      const errMap = validationErrors.reduce(
        (acc, err) => ({ ...acc, [err.field]: err.message }),
        {}
      );
      setErrors(errMap);
      return;
    }

    if (isEditing && workOrderId) {
      db.updateWorkOrder(workOrderId, workOrder);
    } else {
      db.addWorkOrder(workOrder);
    }

    onClose();
  };

  const clientOptions = db.clients.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="modal-footer-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            form="work-order-form"
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      }
    >
      <form id="work-order-form" onSubmit={handleSubmit} className="work-order-form">
        {/* Cliente */}
        <Select
          label="Cliente"
          options={clientOptions}
          value={form.clientId}
          onChange={(e) =>
            setForm({ ...form, clientId: e.target.value as UUID })
          }
          required
          disabled={isEditing}
          error={errors.clientId}
        />

        {/* Veículo */}
        <TextInput
          label="Descrição do Veículo"
          placeholder="Ex: Fiat Uno 2010 prata"
          value={form.vehicleDescription}
          onChange={(e) =>
            setForm({ ...form, vehicleDescription: e.target.value })
          }
          required
          error={errors.vehicleDescription}
        />

        {/* Notas */}
        <TextArea
          label="Notas Públicas"
          placeholder="Visível na impressão"
          value={form.publicNotes}
          onChange={(e) =>
            setForm({ ...form, publicNotes: e.target.value })
          }
        />

        <TextArea
          label="Notas Internas"
          placeholder="Apenas para uso interno"
          value={form.internalNotes}
          onChange={(e) =>
            setForm({ ...form, internalNotes: e.target.value })
          }
        />

        {/* Itens */}
        <div className="form-group-full">
          <div className="items-section">
            <div className="items-header">
              <h3>Itens da O.S.</h3>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleAddItem}
              >
                + Adicionar Item
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-muted">Nenhum item adicionado</p>
            ) : (
              <div className="items-list">
                {items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <select
                      className="form-select item-type"
                      value={item.type}
                      onChange={(e) =>
                        handleItemChange(idx, 'type', e.target.value)
                      }
                    >
                      <option value="SERVICO">Serviço</option>
                      <option value="PECA">Peça</option>
                    </select>

                    <input
                      type="text"
                      className="form-input item-description"
                      placeholder="Descrição"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, 'description', e.target.value)
                      }
                    />

                    <input
                      type="number"
                      className="form-input item-quantity"
                      placeholder="Qtd"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, 'quantity', parseFloat(e.target.value))
                      }
                    />

                    <input
                      type="number"
                      className="form-input item-price"
                      placeholder="Preço"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, 'unitPrice', parseFloat(e.target.value))
                      }
                    />

                    <span className="item-total">
                      R$ {item.total.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="items-total">
                <strong>Total: R$ {calculateWorkOrderTotal(items).toFixed(2)}</strong>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
