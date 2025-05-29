import { useState, forwardRef } from 'react';

// Input bileşeni - Form alanları için kullanılacak giriş kutusu
const Input = forwardRef(({
  type = 'text',
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  className = '',
  disabled = false,
  required = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'outline',
  ...props
}, ref) => {
  // Input için state
  const [focused, setFocused] = useState(false);
  
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
  const inputWrapperClasses = `
    relative
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${className}
  `;
  
  const baseInputClasses = `
    block
    w-full
    rounded-md
    border
    transition-medium
    focus:outline-none
    focus:ring-2
    focus:ring-[color-primary]
    focus:ring-opacity-50
    ${disabled ? 'opacity-60 cursor-not-allowed bg-[color-background-alt]' : ''}
    ${error ? 'border-[color-error] focus:border-[color-error] focus:ring-[color-error]' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.outline}
  `;

  return (
    <div className={inputWrapperClasses}>
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
      
      {/* Input Alanı */}
      <div className="relative">
        {/* Sol İkon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color-text-light]">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={type}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${id || name}-helper-text`}
          {...props}
        />
        
        {/* Sağ İkon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[color-text-light]">
            {icon}
          </div>
        )}
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
Input.displayName = 'Input';

export default Input; 