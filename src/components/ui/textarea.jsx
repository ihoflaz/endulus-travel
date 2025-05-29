import { forwardRef } from 'react';

// Textarea bileşeni - Çok satırlı metin girişi için kullanılacak bileşen
const Textarea = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  error,
  helperText,
  className = '',
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'md',
  variant = 'outline',
  maxLength,
  ...props
}, ref) => {
  // Stil sınıflarını belirle
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3',
    lg: 'py-3 px-4 text-lg',
  };
  
  const variantClasses = {
    outline: 'border-[color-border] focus:border-[color-primary] bg-[color-background]',
    filled: 'border-transparent bg-[color-background-alt] focus:bg-[color-background] focus:border-[color-primary]',
    flushed: 'border-t-0 border-l-0 border-r-0 rounded-none border-b-2 focus:border-[color-primary] px-0',
  };
  
  // Temel sınıflar
  const textareaWrapperClasses = `
    relative
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${className}
  `;
  
  const baseTextareaClasses = `
    block
    w-full
    rounded-md
    border
    transition-medium
    focus:outline-none
    focus:ring-2
    focus:ring-[color-primary]
    focus:ring-opacity-50
    resize-y
    ${disabled ? 'opacity-60 cursor-not-allowed bg-[color-background-alt]' : ''}
    ${error ? 'border-[color-error] focus:border-[color-error] focus:ring-[color-error]' : ''}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.outline}
  `;
  
  return (
    <div className={textareaWrapperClasses}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-[color-error]' : 'text-[color-text-dark]'
          }`}
        >
          {label}
          {required && <span className="text-[color-error] ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea Alanı */}
      <div className="relative">
        <textarea
          ref={ref}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={baseTextareaClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${id || name}-helper-text`}
          {...props}
        />
      </div>
      
      {/* Karakter Sayacı */}
      {maxLength && value && (
        <div className="mt-1 text-xs text-[color-text-light] text-right">
          {value.length} / {maxLength}
        </div>
      )}
      
      {/* Hata ve Yardımcı Metinler */}
      {(error || helperText) && (
        <div
          id={`${id || name}-helper-text`}
          className={`mt-1 text-sm ${error ? 'text-[color-error]' : 'text-[color-text-light]'}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
});

// Displayname
Textarea.displayName = 'Textarea';

export default Textarea; 