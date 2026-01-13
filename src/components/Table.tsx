import React, { ReactNode } from 'react';
import '../styles/Table.css';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  actions,
  emptyMessage = 'Nenhum registro encontrado',
}: TableProps<T>) {
  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {actions && <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyField])}
              className={onRowClick ? 'clickable' : ''}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]?.toString() || '-'}
                </td>
              ))}
              {actions && (
                <td style={{ textAlign: 'center' }}>{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
