import React from 'react';
import { WorkOrder, Client, Settings } from '../types/index';
import { formatCurrency, formatDate } from '../utils/helpers';
import '../styles/Printable.css';

interface PrintableWorkOrderProps {
  workOrder: WorkOrder;
  client: Client;
  settings: Settings;
}

export function PrintableWorkOrder({
  workOrder,
  client,
  settings,
}: PrintableWorkOrderProps) {
  const handlePrint = () => {
    window.print();
  };

  const statusLabels = {
    orcamento: 'Orçamento',
    aprovado: 'Aprovado',
    'em-servico': 'Em Serviço',
    concluido: 'Concluído',
    arquivado: 'Arquivado',
  };

  return (
    <div className="printable-container">
      <div className="print-actions no-print">
        <button className="btn-primary" onClick={handlePrint}>
          🖨️ Imprimir O.S.
        </button>
      </div>

      <div className="printable-content">
        {/* Cabeçalho */}
        <header className="print-header">
          <div className="header-logo">
            <h1>🔧 {settings.officeName}</h1>
          </div>
          <div className="header-info">
            {settings.officeCNPJ && <p>CNPJ: {settings.officeCNPJ}</p>}
            {settings.officePhone && <p>Tel: {settings.officePhone}</p>}
            {settings.officeAddress && <p>{settings.officeAddress}</p>}
          </div>
        </header>

        <div className="print-title">
          <h2>ORDEM DE SERVIÇO</h2>
          <div className="os-number">Nº {workOrder.id.substring(0, 8).toUpperCase()}</div>
        </div>

        {/* Informações do Cliente */}
        <section className="print-section">
          <h3>Dados do Cliente</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{client.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Telefone:</span>
              <span className="info-value">{client.phone}</span>
            </div>
            {client.email && (
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{client.email}</span>
              </div>
            )}
            {client.cpf && (
              <div className="info-item">
                <span className="info-label">CPF:</span>
                <span className="info-value">{client.cpf}</span>
              </div>
            )}
          </div>
        </section>

        {/* Informações do Veículo */}
        <section className="print-section">
          <h3>Dados do Veículo</h3>
          <div className="info-item">
            <span className="info-label">Descrição:</span>
            <span className="info-value">{workOrder.vehicleDescription}</span>
          </div>
        </section>

        {/* Itens do Serviço */}
        <section className="print-section">
          <h3>Serviços e Peças</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {workOrder.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={`item-type ${item.type}`}>
                      {item.type === 'service' ? 'Serviço' : 'Peça'}
                    </span>
                  </td>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={4} className="text-right">
                  <strong>TOTAL:</strong>
                </td>
                <td className="text-right">
                  <strong>{formatCurrency(workOrder.total)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Notas */}
        {workOrder.publicNotes && (
          <section className="print-section">
            <h3>Observações</h3>
            <p className="notes">{workOrder.publicNotes}</p>
          </section>
        )}

        {/* Status e Datas */}
        <section className="print-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">
                <strong>{statusLabels[workOrder.status]}</strong>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Data de Criação:</span>
              <span className="info-value">{formatDate(workOrder.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Última Atualização:</span>
              <span className="info-value">{formatDate(workOrder.updatedAt)}</span>
            </div>
          </div>
        </section>

        {/* Assinatura */}
        <section className="print-section signatures">
          <div className="signature-box">
            <div className="signature-line"></div>
            <p>Assinatura do Cliente</p>
            <p className="signature-date">Data: ____/____/________</p>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <p>Assinatura do Responsável</p>
            <p className="signature-date">Data: ____/____/________</p>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="print-footer">
          <p>Ordem de Serviço gerada em {formatDate(new Date().toISOString())}</p>
          <p>Powered by Oficina PRO ERP v1.0</p>
        </footer>
      </div>
    </div>
  );
}
