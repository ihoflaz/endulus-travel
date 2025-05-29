import { Link } from 'react-router-dom';

// Button bileşeni - Uygulamada kullanılacak farklı buton çeşitleri için temel bileşen
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  to,
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  // CSS sınıflarını belirle
  let buttonClass = 'btn';
  
  // Variant'a göre sınıf ekle
  if (variant === 'primary') {
    buttonClass += ' btn-primary';
  } else if (variant === 'secondary') {
    buttonClass += ' btn-secondary';
  } else if (variant === 'outline') {
    buttonClass += ' btn-outline';
  } else if (variant === 'hero-light') {
    buttonClass += ' btn-hero-light';
  } else if (variant === 'danger') {
    buttonClass += ' bg-[--color-error] text-white border border-[--color-error]';
  } else if (variant === 'success') {
    buttonClass += ' bg-[--color-success] text-white border border-[--color-success]';
  } else if (variant === 'ghost') {
    buttonClass += ' bg-transparent text-[--color-primary] hover:bg-gray-100';
  }
  
  // Boyut sınıfları
  if (size === 'sm') {
    buttonClass += ' py-1 px-3 text-sm';
  } else if (size === 'md') {
    buttonClass += ' py-2 px-4 text-base';
  } else if (size === 'lg') {
    buttonClass += ' py-3 px-6 text-lg';
  }
  
  // Diğer sınıflar
  if (fullWidth) {
    buttonClass += ' w-full';
  }
  
  if (disabled) {
    buttonClass += ' opacity-60 cursor-not-allowed';
  }
  
  // Özel sınıfları ekle
  buttonClass += ` ${className}`;

  // İçerik
  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className={`mr-2 ${size === 'sm' ? 'text-sm' : ''}`}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={`ml-2 ${size === 'sm' ? 'text-sm' : ''}`}>{icon}</span>
      )}
    </>
  );

  // Link olarak mı, Button olarak mı render edilecek?
  if (to) {
    return (
      <Link to={to} className={buttonClass} {...props}>
        {content}
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  // Normal buton olarak render et
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button; 