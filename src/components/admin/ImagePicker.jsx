import { useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Button, SmartImage } from './ui';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = /^image\/(jpeg|png|webp|gif|avif)$/;

const ImagePicker = ({ value, onChange, label = 'Görsel', accept = 'image/*' }) => {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    if (!ALLOWED.test(file.type)) {
      setError('Sadece JPG/PNG/WebP/GIF/AVIF kabul edilir');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)}MB > 10MB)`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const media = await api.upload('/uploads', fd);
      onChange(media.path);
    } catch (e) {
      setError(e?.body?.error || e.message || 'Yükleme başarısız');
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="/uploads/2026/05/foo.jpg veya /images/..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          {value && (
            <div className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              <SmartImage src={value} alt="Önizleme" className="max-h-48 w-full object-contain" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={ref}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            onClick={() => ref.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Yükleniyor…' : 'Dosya Seç'}
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              Kaldır
            </Button>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default ImagePicker;
export { ImagePicker };
