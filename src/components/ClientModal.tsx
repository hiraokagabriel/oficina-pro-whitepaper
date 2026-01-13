import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { TextInput, PhoneInput } from './FormInputs';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Client, UUID } from '../types/index';
import { createEmptyClient } from '../utils/helpers';
import { validateClient } from '../utils/validators';

interface ClientModalProps {
  isOpen: boolean;
  clientId?: UUID;
  onClose: () => void;
}

export function ClientModal({ isOpen, clientId, onClose }: ClientModalProps) {
  const db = useDatabaseContext();
  const [form, setForm] = useState<Client>(createEmptyClient());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!clientId;

  useEffect(() => {
    if (isEditing && clientId) {
      const existing = db.getClient(clientId);
      if (existing) {
        setForm(existing);
      }
    } else {
      setForm(createEmptyClient());
    }
    setErrors({});
  }, [isOpen, isEditing, clientId, db]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateClient(form);
    if (validationErrors.length > 0) {
      const errMap = validationErrors.reduce(
        (acc, err) => ({ ...acc, [err.field]: err.message }),
        {}
      );
      setErrors(errMap);
      return;
    }

    if (isEditing && clientId) {
      db.updateClient(clientId, form);
    } else {
      db.addClient(form);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
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
            form="client-form"
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      }
    >
      <form id="client-form" onSubmit={handleSubmit} className="form-group-full">
        <TextInput
          label="Nome"
          placeholder="Nome completo do cliente"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          error={errors.name}
        />

        <PhoneInput
          label="Telefone"
          placeholder="(XX) XXXXX-XXXX"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          error={errors.phone}
        />

        <TextInput
          label="Email (opcional)"
          type="email"
          placeholder="email@example.com"
          value={form.email || ''}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />

        <TextInput
          label="CPF (opcional)"
          placeholder="XXX.XXX.XXX-XX"
          value={form.cpf || ''}
          onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          error={errors.cpf}
        />

        <TextInput
          label="Notas"
          placeholder="Observações sobre o cliente"
          value={form.notes || ''}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
}
