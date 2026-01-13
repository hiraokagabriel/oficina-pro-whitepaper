import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import {
  TextInput,
  CurrencyInput,
  DateInput,
  Select,
  Checkbox,
} from './FormInputs';
import { useDatabaseContext } from '../context/DatabaseContext';
import { LedgerEntry, UUID } from '../types/index';
import { createEmptyLedgerEntry } from '../utils/helpers';
import { validateLedgerEntry } from '../utils/validators';

interface LedgerModalProps {
  isOpen: boolean;
  entryId?: UUID;
  onClose: () => void;
}

export function LedgerModal({ isOpen, entryId, onClose }: LedgerModalProps) {
  const db = useDatabaseContext();
  const [form, setForm] = useState<LedgerEntry>(createEmptyLedgerEntry());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!entryId;

  useEffect(() => {
    if (isEditing && entryId) {
      const existing = db.getLedgerEntry(entryId);
      if (existing) {
        setForm(existing);
      }
    } else {
      setForm(createEmptyLedgerEntry());
    }
    setErrors({});
  }, [isOpen, isEditing, entryId, db]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLedgerEntry(form);
    if (validationErrors.length > 0) {
      const errMap = validationErrors.reduce(
        (acc, err) => ({ ...acc, [err.field]: err.message }),
        {}
      );
      setErrors(errMap);
      return;
    }

    if (isEditing && entryId) {
      db.updateLedgerEntry(entryId, form);
    } else {
      db.addLedgerEntry(form);
    }

    onClose();
  };

  const workOrderOptions = db.workOrders
    .filter((wo) => wo.status === 'FINALIZADO')
    .map((wo) => ({
      value: wo.id,
      label: `${wo.id.slice(0, 8)} - R$ ${wo.totalValue.toFixed(2)}`,
    }));

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}
      onClose={onClose}
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '1rem' }}>
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
            form="ledger-form"
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      }
    >
      <form id="ledger-form" onSubmit={handleSubmit} className="form-group-full">
        <Select
          label="Tipo"
          options={[
            { value: 'RECEITA', label: 'Receita' },
            { value: 'DESPESA', label: 'Despesa' },
          ]}
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as 'RECEITA' | 'DESPESA',
            })
          }
          required
          error={errors.type}
        />

        <TextInput
          label="Descrição"
          placeholder="Ex: Serviço de revisão"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          error={errors.description}
        />

        <CurrencyInput
          label="Valor"
          value={form.value}
          onChange={(value) => setForm({ ...form, value })}
          required
          error={errors.value}
        />

        <DateInput
          label="Data"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          error={errors.date}
        />

        <TextInput
          label="Categoria"
          placeholder="Ex: Manutenção"
          value={form.category || ''}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        {workOrderOptions.length > 0 && (
          <Select
            label="Vincular a O.S. (opcional)"
            options={[
              { value: '', label: 'Nenhuma O.S.' },
              ...workOrderOptions,
            ]}
            value={form.workOrderId || ''}
            onChange={(e) =>
              setForm({
                ...form,
                workOrderId: e.target.value ? (e.target.value as UUID) : undefined,
              })
            }
          />
        )}

        {form.installmentInfo && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>Parcelamento</h4>
            <div className="form-row">
              <TextInput
                label="Total de Parcelas"
                type="number"
                min="1"
                value={form.installmentInfo.totalInstallments}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installmentInfo: form.installmentInfo
                      ? {
                          ...form.installmentInfo,
                          totalInstallments: parseInt(e.target.value),
                        }
                      : undefined,
                  })
                }
              />
              <TextInput
                label="Parcela Atual"
                type="number"
                min="1"
                value={form.installmentInfo.currentInstallment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installmentInfo: form.installmentInfo
                      ? {
                          ...form.installmentInfo,
                          currentInstallment: parseInt(e.target.value),
                        }
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
