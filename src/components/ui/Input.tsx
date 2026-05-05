import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#ced4da]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba4c4]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            bg-[#0a1628] border border-[#162a47] rounded-lg
            text-white placeholder-[#868e96]
            focus:border-[#6b8cae] focus:ring-2 focus:ring-[#6b8cae]/20
            transition-all duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2 w-full
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[#868e96]">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[#ced4da]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          bg-[#0a1628] border border-[#162a47] rounded-lg
          text-white
          focus:border-[#6b8cae] focus:ring-2 focus:ring-[#6b8cae]/20
          transition-all duration-200
          px-3 py-2 w-full
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[#ced4da]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          bg-[#0a1628] border border-[#162a47] rounded-lg
          text-white placeholder-[#868e96]
          focus:border-[#6b8cae] focus:ring-2 focus:ring-[#6b8cae]/20
          transition-all duration-200
          px-3 py-2 w-full min-h-[80px]
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[#868e96]">{hint}</p>}
    </div>
  );
}