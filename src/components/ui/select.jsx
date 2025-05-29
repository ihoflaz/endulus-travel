import { forwardRef } from 'react';

// Select bileşeni - Açılır menü seçimi için kullanılacak bileşen
const Select = forwardRef(({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Seçiniz',
  error,
  helperText,
  className = '',
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'md',
  variant = 'outline',
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
  };
  
  // Temel sınıflar
  const selectWrapperClasses = `
    relative
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${className}
  `;
  
  const baseSelectClasses = `
    block
    w-full
    appearance-none
    rounded-md
    border
    transition-medium
    focus:outline-none
    focus:ring-2
    focus:ring-[color-primary]
    focus:ring-opacity-50
    pr-10
    ${disabled ? 'opacity-60 cursor-not-allowed bg-[color-background-alt]' : ''}
    ${error ? 'border-[color-error] focus:border-[color-error] focus:ring-[color-error]' : ''}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.outline}
  `;
  
  return (
    <div className={selectWrapperClasses}>
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
      
      {/* Select Alanı */}
      <div className="relative">
        <select
          ref={ref}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={baseSelectClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${id || name}-helper-text`}
          {...props}
        >
          {/* Placeholder */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {/* Seçenekler */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Select Ok İşareti */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[color-text-light]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      
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
Select.displayName = 'Select';

export default Select; 