import React, { useState, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useDatabaseContext } from '../context/DatabaseContext';
import { WorkOrderStatus, WorkOrder } from '../types/index';
import { getStatusLabel, formatCurrency } from '../utils/helpers';
import { SearchBar } from './SearchBar';
import { Modal } from './Modal';
import { PrintableWorkOrder } from './PrintableWorkOrder';
import '../styles/KanbanBoard.css';

const COLUMNS: WorkOrderStatus[] = [
  'orcamento',
  'aprovado',
  'em-servico',
  'concluido',
];

interface KanbanBoardProps {
  onSelectWorkOrder?: (workOrder: WorkOrder) => void;
}

export function KanbanBoard({ onSelectWorkOrder }: KanbanBoardProps) {
  const { workOrders, updateWorkOrder, clients, settings } = useDatabaseContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedColumns, setExpandedColumns] = useState<Set<WorkOrderStatus>>(
    new Set(COLUMNS)
  );
  const [printWorkOrder, setPrintWorkOrder] = useState<WorkOrder | null>(null);

  // Get client name by ID
  const getClientName = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return client?.name || 'Cliente desconhecido';
    },
    [clients]
  );

  // Filter work orders by search term
  const filterWorkOrders = useCallback(
    (orders: WorkOrder[]) => {
      if (!searchTerm.trim()) return orders;

      const term = searchTerm.toLowerCase();
      return orders.filter((order) => {
        const clientName = getClientName(order.clientId).toLowerCase();
        const orderId = order.id.toLowerCase();
        const vehicle = order.vehicleDescription.toLowerCase();
        const notes = (order.publicNotes || '').toLowerCase();

        return (
          clientName.includes(term) ||
          orderId.includes(term) ||
          vehicle.includes(term) ||
          notes.includes(term)
        );
      });
    },
    [searchTerm, getClientName]
  );

  // Group work orders by status
  const groupedByStatus = useCallback(() => {
    const grouped: Record<WorkOrderStatus, WorkOrder[]> = {
      'orcamento': [],
      'aprovado': [],
      'em-servico': [],
      'concluido': [],
    };

    const filteredOrders = filterWorkOrders(workOrders);

    filteredOrders.forEach((order) => {
      if (order.status in grouped) {
        grouped[order.status as WorkOrderStatus].push(order);
      }
    });

    return grouped;
  }, [workOrders, filterWorkOrders]);

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return; // No change
    }

    const newStatus = destination.droppableId as WorkOrderStatus;
    const workOrder = workOrders.find((o) => o.id === draggableId);

    if (!workOrder) return;

    // Update the work order status
    updateWorkOrder(workOrder.id, { status: newStatus });
  };

  // Toggle column expansion
  const toggleColumnExpanded = (status: WorkOrderStatus) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(status)) {
      newExpanded.delete(status);
    } else {
      newExpanded.add(status);
    }
    setExpandedColumns(newExpanded);
  };

  // Handle print click
  const handlePrintClick = (e: React.MouseEvent, order: WorkOrder) => {
    e.stopPropagation(); // Prevent card click
    setPrintWorkOrder(order);
  };

  const grouped = groupedByStatus();
  const totalFiltered = Object.values(grouped).reduce(
    (sum, orders) => sum + orders.length,
    0
  );

  return (
    <div className="kanban-container">
      {/* Search Bar */}
      <div className="kanban-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por cliente, veículo, ID ou notas..."
        />
        {searchTerm && (
          <div className="search-results">
            {totalFiltered} resultado{totalFiltered !== 1 ? 's' : ''} encontrado{totalFiltered !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {COLUMNS.map((status) => (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                <button
                  className="kanban-column-toggle"
                  onClick={() => toggleColumnExpanded(status)}
                  aria-label={expandedColumns.has(status) ? 'Recolher' : 'Expandir'}
                >
                  {expandedColumns.has(status) ? '▼' : '▶'}
                </button>
                <h3 className="kanban-column-title">
                  {getStatusLabel(status)}
                </h3>
                <span className="kanban-column-count">
                  {grouped[status].length}
                </span>
              </div>

              {expandedColumns.has(status) && (
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      className={`kanban-droppable ${
                        snapshot.isDraggingOver ? 'dragging-over' : ''
                      }`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {grouped[status].map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`kanban-card ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onSelectWorkOrder?.(order)}
                            >
                              <div className="kanban-card-header">
                                <strong>{getClientName(order.clientId)}</strong>
                                <span className="kanban-card-id">
                                  #{order.id.slice(0, 8)}
                                </span>
                              </div>
                              <div className="kanban-card-vehicle">
                                {order.vehicleDescription}
                              </div>
                              <div className="kanban-card-items">
                                {order.items.length} item
                                {order.items.length !== 1 ? 's' : ''}
                              </div>
                              <div className="kanban-card-value">
                                {formatCurrency(order.total)}
                              </div>
                              {order.internalNotes && (
                                <div className="kanban-card-notes" title={order.internalNotes}>
                                  📝
                                </div>
                              )}
                              <button
                                className="kanban-card-print"
                                onClick={(e) => handlePrintClick(e, order)}
                                title="Imprimir O.S."
                                aria-label="Imprimir ordem de serviço"
                              >
                                🖨️
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {grouped[status].length === 0 && (
                        <div className="kanban-empty">
                          {searchTerm
                            ? 'Nenhum resultado'
                            : 'Arraste cards aqui'}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Print Modal */}
      {printWorkOrder && (
        <Modal
          isOpen={true}
          onClose={() => setPrintWorkOrder(null)}
          title="Imprimir Ordem de Serviço"
          size="large"
        >
          <PrintableWorkOrder
            workOrder={printWorkOrder}
            client={clients.find((c) => c.id === printWorkOrder.clientId)!}
            settings={settings}
          />
        </Modal>
      )}
    </div>
  );
}
