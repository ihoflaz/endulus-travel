import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import {
  Button, ConfirmDialog, PageHeader, ToastStack, useToast, SmartImage,
} from '../../components/admin/ui';

const CONCURRENCY = 4;

const MediaAdminPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [confirm, setConfirm] = useState(null);
  const { items: toastItems, show, dismiss } = useToast();
  const ref = useRef();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: data } = await api.get('/uploads?take=120');
      if (mounted.current) setItems(data);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    let done = 0;
    let failed = 0;
    // Bounded concurrency upload pool (CONCURRENCY at a time)
    const queue = [...files];
    const workers = Array.from({ length: Math.min(CONCURRENCY, files.length) }, async () => {
      while (queue.length) {
        const file = queue.shift();
        try {
          const fd = new FormData();
          fd.append('file', file);
          await api.upload('/uploads', fd);
        } catch {
          failed++;
        } finally {
          done++;
          if (mounted.current) setProgress({ done, total: files.length });
        }
      }
    });
    await Promise.all(workers);
    setUploading(false);
    if (ref.current) ref.current.value = '';
    if (failed > 0) show(`${done - failed}/${files.length} dosya yüklendi (${failed} hata)`, 'error');
    else show(`${files.length} dosya yüklendi`);
    await load();
  };

  const remove = async () => {
    try {
      await api.delete(`/uploads/${confirm.id}`);
      setConfirm(null);
      show('Dosya silindi');
      await load();
    } catch (e) {
      show(e?.body?.error || e.message, 'error');
    }
  };

  const copy = async (p) => {
    try {
      await navigator.clipboard?.writeText(p);
      show('Kopyalandı: ' + p);
    } catch {
      show('Kopyalama başarısız (HTTPS dışı bağlantıda olabilir)', 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title="Medya Kütüphanesi"
        description="Yüklenen tüm görseller. Yolu kopyalayıp herhangi bir alana yapıştırabilirsiniz."
        actions={
          <>
            <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            <Button variant="secondary" onClick={() => ref.current?.click()} disabled={uploading}>
              {uploading ? `Yükleniyor (${progress.done}/${progress.total})…` : '+ Dosya Yükle'}
            </Button>
          </>
        }
      />
      {loading ? <div className="text-slate-500">Yükleniyor…</div> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="aspect-square bg-slate-50">
                <SmartImage src={m.path} alt={m.originalName} className="h-full w-full object-cover" />
              </div>
              <div className="p-2 text-xs">
                <div className="truncate font-medium" title={m.originalName}>{m.originalName}</div>
                <div className="truncate text-slate-500" title={m.path}>{m.path}</div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => copy(m.path)}>Kopyala</Button>
                  <Button size="sm" variant="danger" onClick={() => setConfirm(m)}>Sil</Button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-400">
              Henüz dosya yüklenmemiş
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Dosyayı sil"
        message={`"${confirm?.originalName}" dosyasını silmek istiyor musunuz? Bu işlem geri alınamaz.`}
      />
      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default MediaAdminPage;
