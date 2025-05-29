import { Link } from 'react-router-dom';

// Card bileşeni - Tur kartları, içerik kutuları ve bilgi gösterimi için kullanılacak
const Card = ({
  className = '',
  title,
  subtitle,
  image,
  imageAlt = '',
  children,
  to,
  href,
  footer,
  onClick,
  bordered = true,
  shadow = 'md',
  rounded = 'md',
  hoverEffect = false,
  ...props
}) => {
  // Stil sınıflarını belirle
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  // Temel sınıflar
  const cardClasses = `
    bg-[color-background] 
    ${bordered ? 'border border-[color-border]' : ''} 
    ${shadowClasses[shadow] || shadowClasses.md} 
    ${roundedClasses[rounded] || roundedClasses.md}
    overflow-hidden
    ${hoverEffect ? 'hover-float' : ''}
    ${className}
  `;

  // Kart içeriği
  const content = (
    <>
      {/* Kart Resmi */}
      {image && (
        <div className="relative">
          <img 
            src={image}
            alt={imageAlt}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      {/* Kart İçeriği */}
      <div className="p-4">
        {/* Başlık ve Alt Başlık */}
        {(title || subtitle) && (
          <div className="mb-3">
            {title && (
              <h3 className="text-lg font-semibold text-[color-text-dark]">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-[color-text-light] mt-1">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* Ana İçerik */}
        {children}
      </div>
      
      {/* Kart Alt Bölümü (Footer) */}
      {footer && (
        <div className="px-4 py-3 bg-[color-background-alt] border-t border-[color-border]">
          {footer}
        </div>
      )}
    </>
  );

  // Link olarak mı, normal kart olarak mı render edilecek?
  if (to) {
    return (
      <Link to={to} className={cardClasses} {...props}>
        {content}
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} className={cardClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  } else if (onClick) {
    return (
      <div className={`${cardClasses} cursor-pointer`} onClick={onClick} {...props}>
        {content}
      </div>
    );
  }

  // Normal kart olarak render et
  return (
    <div className={cardClasses} {...props}>
      {content}
    </div>
  );
};

// Alt bileşenler
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-[color-border] ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-3 bg-[color-background-alt] border-t border-[color-border] ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 