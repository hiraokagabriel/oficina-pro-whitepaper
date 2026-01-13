import React from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="Limpar busca"
        >
          ✕
        </button>
      )}
    </div>
  );
}
