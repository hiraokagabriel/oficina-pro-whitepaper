import React, { useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { ClientModal } from './ClientModal';
import { Table } from './Table';
import '../styles/Dashboard.css';

export function ClientsTab() {
  const db = useDatabaseContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId as any);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      db.deleteClient(clientId as any);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(undefined);
  };

  return (
    <div className="clients-tab">
      <div className="dashboard-header">
        <h2>Clientes</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setSelectedClientId(undefined);
            setIsModalOpen(true);
          }}
        >
          + Novo Cliente
        </button>
      </div>

      <Table
        data={db.clients}
        keyField="id"
        columns={[
          {
            key: 'name',
            label: 'Nome',
          },
          {
            key: 'phone',
            label: 'Telefone',
          },
          {
            key: 'email',
            label: 'Email',
            render: (value) => value || '-',
          },
          {
            key: 'cpf',
            label: 'CPF',
            render: (value) => value || '-',
          },
        ]}
        actions={(row) => (
          <div className="action-buttons">
            <button
              className="btn-secondary btn-sm"
              onClick={() => handleEditClient(row.id)}
            >
              Editar
            </button>
            <button
              className="btn-danger btn-sm"
              onClick={() => handleDeleteClient(row.id)}
            >
              Deletar
            </button>
          </div>
        )}
        emptyMessage="Nenhum cliente cadastrado"
      />

      <ClientModal
        isOpen={isModalOpen}
        clientId={selectedClientId}
        onClose={handleCloseModal}
      />
    </div>
  );
}
