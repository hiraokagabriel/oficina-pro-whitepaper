import React, { InputHTMLAttributes, TextareaHTMLAttributes, ChangeEvent } from 'react';
import '../styles/Form.css';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function TextInput({
  label,
  error,
  required,
  ...props
}: TextInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <input type="text" className="form-input" {...props} />
    </FormField>
  );
}

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (value: number) => void;
}

export function CurrencyInput({
  label,
  error,
  required,
  value = '',
  onChange,
  ...props
}: CurrencyInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (onChange) {
      onChange(parseInt(val) / 100);
    }
  };

  const formattedValue = (value: string | number) => {
    const numVal = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numVal);
  };

  return (
    <FormField label={label} error={error} required={required}>
      <input
        type="text"
        className="form-input"
        value={formattedValue(value)}
        onChange={handleChange}
        {...props}
      />
    </FormField>
  );
}

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function DateInput({
  label,
  error,
  required,
  ...props
}: DateInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <input type="date" className="form-input" {...props} />
    </FormField>
  );
}

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function PhoneInput({
  label,
  error,
  required,
  ...props
}: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length <= 11) {
      if (val.length <= 2) {
        e.target.value = val;
      } else if (val.length <= 7) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      }
    }
  };

  return (
    <FormField label={label} error={error} required={required}>
      <input
        type="tel"
        className="form-input"
        placeholder="(XX) XXXXX-XXXX"
        onChange={handleChange}
        {...props}
      />
    </FormField>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
}

export function Select({
  label,
  options,
  error,
  required,
  ...props
}: SelectProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <select className="form-select" {...props}>
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function TextArea({
  label,
  error,
  required,
  ...props
}: TextAreaProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <textarea className="form-textarea" {...props} />
    </FormField>
  );
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <div className="form-checkbox">
      <input type="checkbox" className="checkbox-input" {...props} />
      <label className="checkbox-label">{label}</label>
    </div>
  );
}
