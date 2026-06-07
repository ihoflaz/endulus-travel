// Small set of admin-only UI primitives. Tailwind only — no extra deps.
import { useCallback, useEffect, useId, useRef, useState } from 'react';

// ============================================================================
// Buttons / inputs
// ============================================================================

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm',
  };
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, hint, className = '', ...rest }) => {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <input
        id={id}
        {...rest}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && <span id={`${id}-msg`} className="mt-1 block text-xs text-red-600">{error}</span>}
      {hint && !error && <span id={`${id}-msg`} className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
};

export const Textarea = ({ label, error, hint, className = '', rows = 4, ...rest }) => {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <textarea
        id={id}
        rows={rows}
        {...rest}
        aria-invalid={error ? 'true' : undefined}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
};

export const Select = ({ label, error, children, className = '', ...rest }) => {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        id={id}
        {...rest}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 ${error ? 'border-red-400' : ''} ${className}`}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
};

export const Checkbox = ({ label, ...rest }) => (
  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
    <input type="checkbox" {...rest} className="h-4 w-4 rounded border-slate-300" />
    {label}
  </label>
);

// ============================================================================
// Focus trap helper used by Drawer and ConfirmDialog
// ============================================================================

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
  'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

const useFocusTrap = (open, containerRef) => {
  const lastFocusedBeforeOpen = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    lastFocusedBeforeOpen.current = document.activeElement;
    const container = containerRef.current;
    if (!container) return undefined;

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog
    const focusables = container.querySelectorAll(FOCUSABLE);
    (focusables[0] || container).focus();

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled')
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKey);
    return () => {
      container.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      // Return focus to the trigger if it still exists
      const prev = lastFocusedBeforeOpen.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [open, containerRef]);
};

// ============================================================================
// Drawer
// ============================================================================

export const Drawer = ({ open, onClose, title, children, footer, wide = false }) => {
  const ref = useRef(null);
  const titleId = useId();
  useFocusTrap(open, ref);

  // Esc scoped to the drawer container — stacked drawers close innermost first.
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose?.();
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`h-full ${wide ? 'w-full max-w-3xl' : 'w-full max-w-md'} overflow-y-auto bg-white shadow-xl focus:outline-none`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-slate-800">{title}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-slate-100" aria-label="Kapat">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3">{footer}</div>}
      </div>
    </div>
  );
};

// ============================================================================
// Confirm dialog
// ============================================================================

export const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Onay', message, confirmText = 'Sil', loading }) => {
  const ref = useRef(null);
  const titleId = useId();
  useFocusTrap(open, ref);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      e.stopPropagation();
      onClose?.();
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl focus:outline-none"
      >
        <h2 id={titleId} className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Vazgeç</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'İşleniyor…' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Table / page header
// ============================================================================

export const Table = ({ columns, rows, empty = 'Henüz kayıt yok' }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={`px-3 py-2 text-left font-medium text-slate-600 ${c.className || ''}`}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-400">{empty}</td>
          </tr>
        )}
        {rows.map((row, i) => (
          <tr key={row.id ?? i} className="hover:bg-slate-50">
            {columns.map((c) => (
              <td key={c.key} className={`px-3 py-2 align-top ${c.className || ''}`}>
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>
);

// ============================================================================
// Toaster — queue of toasts, no race on rapid show() calls
// ============================================================================

let toastSeq = 0;

export const useToast = () => {
  const [items, setItems] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setItems((list) => list.filter((t) => t.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback((message, kind = 'success', durationMs = 3500) => {
    const id = ++toastSeq;
    setItems((list) => [...list, { id, message, kind }]);
    const t = setTimeout(() => dismiss(id), durationMs);
    timersRef.current.set(id, t);
    return id;
  }, [dismiss]);

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  return { toast: items[0] ?? null, items, show, dismiss, clear: () => setItems([]) };
};

export const Toast = ({ message, kind = 'success', onClose }) => {
  if (!message) return null;
  const bg = kind === 'error' ? 'bg-red-600' : 'bg-emerald-600';
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-[60] rounded-md ${bg} px-4 py-2 text-sm text-white shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button type="button" onClick={onClose} className="opacity-80 hover:opacity-100" aria-label="Kapat">×</button>
      </div>
    </div>
  );
};

// Renders the toast stack from `useToast().items`. A single live region
// at the container level — screen readers announce additions as a single
// queue rather than one announcement per node insertion.
export const ToastStack = ({ items, onDismiss }) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="false"
    className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2"
  >
    {items?.map((t) => {
      const bg = t.kind === 'error' ? 'bg-red-600' : 'bg-emerald-600';
      return (
        <div key={t.id} className={`rounded-md ${bg} px-4 py-2 text-sm text-white shadow-lg`}>
          <div className="flex items-center gap-3">
            <span>{t.message}</span>
            <button type="button" onClick={() => onDismiss?.(t.id)} aria-label="Kapat" className="opacity-80 hover:opacity-100">×</button>
          </div>
        </div>
      );
    })}
  </div>
);

// ============================================================================
// SmartImage — falls back to placeholder via state, no DOM mutation
// ============================================================================

export const SmartImage = ({ src, alt = '', fallback = null, className = '', ...rest }) => {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [src]);
  if (!src || errored) {
    return fallback ?? (
      <div className={`flex items-center justify-center bg-slate-100 text-xs text-slate-400 ${className}`}>
        görsel yok
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={className}
      loading="lazy"
      {...rest}
    />
  );
};
