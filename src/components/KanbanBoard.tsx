import React, { useState, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useDatabaseContext } from '../context/DatabaseContext';
import { WorkOrderStatus, WorkOrder } from '../types/index';
import { getStatusLabel, getStatusColor } from '../utils/helpers';
import '../styles/KanbanBoard.css';

const COLUMNS: WorkOrderStatus[] = [
  'ORCAMENTO',
  'APROVADO',
  'EM_SERVICO',
  'FINALIZADO',
];

interface KanbanBoardProps {
  onSelectWorkOrder: (workOrder: WorkOrder) => void;
}

export function KanbanBoard({ onSelectWorkOrder }: KanbanBoardProps) {
  const { workOrders, updateWorkOrder, clients } = useDatabaseContext();
  const [expandedColumns, setExpandedColumns] = useState<Set<WorkOrderStatus>>(
    new Set(COLUMNS)
  );

  // Get client name by ID
  const getClientName = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return client?.name || 'Cliente desconhecido';
    },
    [clients]
  );

  // Group work orders by status
  const groupedByStatus = useCallback(() => {
    const grouped: Record<WorkOrderStatus, WorkOrder[]> = {
      ORCAMENTO: [],
      APROVADO: [],
      EM_SERVICO: [],
      FINALIZADO: [],
    };

    workOrders.forEach((order) => {
      if (order.status in grouped) {
        grouped[order.status as WorkOrderStatus].push(order);
      }
    });

    return grouped;
  }, [workOrders]);

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
    const workOrderId = draggableId as any;
    const workOrder = workOrders.find((o) => o.id === workOrderId);

    if (!workOrder) return;

    // Update the work order status
    const updates: any = { status: newStatus };

    if (newStatus === 'APROVADO' && !workOrder.approvedAt) {
      updates.approvedAt = new Date().toISOString();
    } else if (newStatus === 'EM_SERVICO' && !workOrder.startedAt) {
      updates.startedAt = new Date().toISOString();
    } else if (newStatus === 'FINALIZADO' && !workOrder.finishedAt) {
      updates.finishedAt = new Date().toISOString();
    }

    updateWorkOrder(workOrder.id, updates);
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

  const grouped = groupedByStatus();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((status) => (
          <div key={status} className="kanban-column">
            <div className="kanban-column-header">
              <button
                className="kanban-column-toggle"
                onClick={() => toggleColumnExpanded(status)}
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
                            onClick={() => onSelectWorkOrder(order)}
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
                              R$ {order.totalValue.toFixed(2).replace('.', ',')}
                            </div>
                            {order.internalNotes && (
                              <div className="kanban-card-notes" title={order.internalNotes}>
                                📝
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
