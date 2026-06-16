import { useEffect, useState } from 'react';
import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { api } from '../../lib/api';
import { Button, Checkbox, Input, Select, Textarea } from '../../components/admin/ui';
import { ListEditor } from '../../components/admin/ListEditor';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptyTour = {
  slug: '', title: '', description: '',
  type: 'international', category: '', destination: '',
  pricePerPerson: '', originalPrice: '', campaignPrice: '', currency: '',
  priceStatus: '', priceNote: '',
  groupSize: '', duration: '', dates: '',
  startDate: '', endDate: '', instagramUrl: '',
  image: '', gallery: [],
  highlights: [], included: [], notIncluded: [], itinerary: [], faq: [],
  specialOffer: false, whatsappMessage: '',
  active: true, featured: false, order: 0,
  translations: {},
};

const dateInput = (v) => (v ? String(v).slice(0, 10) : '');

const ItineraryEditor = ({ value = [], onChange }) => {
  const update = (i, patch) => {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const add = () => onChange([...(value || []), { day: '', date: '', title: '', description: '', activities: [] }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((day, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Gün {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 hover:bg-white" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 hover:bg-white" disabled={i === value.length - 1}>↓</button>
              <button type="button" onClick={() => remove(i)} className="rounded px-1.5 text-red-600 hover:bg-white">Sil</button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="Gün etiketi" value={day.day || ''} onChange={(e) => update(i, { day: e.target.value })} placeholder="1. Gün" />
            <Input label="Tarih" value={day.date || ''} onChange={(e) => update(i, { date: e.target.value })} placeholder="29 Ağustos (Cuma)" />
          </div>
          <Input label="Başlık" value={day.title || ''} onChange={(e) => update(i, { title: e.target.value })} className="mt-2" />
          <Textarea label="Açıklama" value={day.description || ''} onChange={(e) => update(i, { description: e.target.value })} className="mt-2" rows={2} />
          <div className="mt-2">
            <ListEditor label="Aktiviteler" value={day.activities || []} onChange={(activities) => update(i, { activities })} placeholder="Aktivite ekle" />
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={add}>+ Gün ekle</Button>
    </div>
  );
};

const FaqEditor = ({ value = [], onChange }) => {
  const update = (i, patch) => {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const add = () => onChange([...(value || []), { question: '', answer: '' }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Soru {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 hover:bg-white" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 hover:bg-white" disabled={i === value.length - 1}>↓</button>
              <button type="button" onClick={() => remove(i)} className="rounded px-1.5 text-red-600 hover:bg-white">Sil</button>
            </div>
          </div>
          <Input label="Soru" value={item.question || ''} onChange={(e) => update(i, { question: e.target.value })} />
          <Textarea label="Cevap" value={item.answer || ''} onChange={(e) => update(i, { answer: e.target.value })} className="mt-2" rows={2} />
        </div>
      ))}
      <Button variant="secondary" onClick={add}>+ Soru ekle</Button>
    </div>
  );
};

const numOrNull = (v) => (v === '' || v == null ? null : Number(v));

const ToursAdminPage = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const r = useCrudResource({
    endpoint: '/tours',
    listKey: 'featured',
    empty: emptyTour,
  });

  // Coerce string inputs to numbers right before the API call.
  const transformPayload = (record) => ({
    ...record,
    pricePerPerson: numOrNull(record.pricePerPerson),
    originalPrice: numOrNull(record.originalPrice),
    campaignPrice: numOrNull(record.campaignPrice),
    order: Number(record.order) || 0,
  });

  return (
    <CrudPage
      resource={r}
      transformPayload={transformPayload}
      title="Turlar"
      description="Tur listesini, fiyatları, içerikleri ve günlük programı yönet."
      createLabel="+ Yeni Tur"
      rowKeyLabel="Tur"
      wide
      confirmMessage={(row) => `"${row.title}" turunu silmek istediğinize emin misiniz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'title', label: 'Başlık', render: (row) => (
          <div>
            <div className="font-medium text-slate-800">{row.title}</div>
            <div className="text-xs text-slate-500">/{row.slug}</div>
          </div>
        )},
        { key: 'type', label: 'Tip' },
        { key: 'category', label: 'Kategori' },
        { key: 'price', label: 'Fiyat', render: (row) =>
          row.pricePerPerson != null ? `${row.pricePerPerson} ${row.currency || ''}` : (row.priceStatus || '—')
        },
        { key: 'flags', label: 'Durum', render: (row) => (
          <div className="flex flex-wrap gap-1 text-xs">
            {!row.active && <span className="rounded bg-slate-200 px-1.5 py-0.5">pasif</span>}
            {row.specialOffer && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">kampanya</span>}
            {row.featured && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-800">öne</span>}
          </div>
        )},
        { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (row) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Düzenle</Button>
            <Button size="sm" variant="danger" onClick={() => setConfirm(row)}>Sil</Button>
          </div>
        )},
      ]}
      renderForm={(editing, setEditing) => {
        // Read/write helpers for the nested EN translation bag. Never drop
        // other locales already stored under editing.translations.
        const enVal = (k, arr = false) => editing?.translations?.en?.[k] ?? (arr ? [] : '');
        const setEn = (k, v) => setEditing({
          ...editing,
          translations: {
            ...(editing.translations || {}),
            en: { ...((editing.translations || {}).en || {}), [k]: v },
          },
        });
        return (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Başlık" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <Input label="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
          </div>
          <Textarea label="Kısa açıklama" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />

          <div className="grid gap-3 sm:grid-cols-3">
            <Select label="Tip" value={editing.type || 'international'} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
              <option value="international">Yurt Dışı</option>
              <option value="domestic">Yurt İçi</option>
            </Select>
            <Select label="Kategori" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              <option value="">— seç —</option>
              {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </Select>
            <Input label="Hedef / Şehir" value={editing.destination || ''} onChange={(e) => setEditing({ ...editing, destination: e.target.value })} />
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Input label="Kişi Başı Fiyat" type="number" value={editing.pricePerPerson ?? ''} onChange={(e) => setEditing({ ...editing, pricePerPerson: e.target.value })} />
            <Input label="Orijinal Fiyat" type="number" value={editing.originalPrice ?? ''} onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value })} />
            <Input label="Kampanya Fiyatı" type="number" value={editing.campaignPrice ?? ''} onChange={(e) => setEditing({ ...editing, campaignPrice: e.target.value })} />
            <Select label="Para birimi" value={editing.currency || ''} onChange={(e) => setEditing({ ...editing, currency: e.target.value })}>
              <option value="">—</option>
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Fiyat Durumu" value={editing.priceStatus || ''} onChange={(e) => setEditing({ ...editing, priceStatus: e.target.value })} placeholder="Beklemede Kalın" />
            <Input label="Fiyat Notu" value={editing.priceNote || ''} onChange={(e) => setEditing({ ...editing, priceNote: e.target.value })} />
            <Input label="Sıra" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: e.target.value })} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Grup Boyu" value={editing.groupSize || ''} onChange={(e) => setEditing({ ...editing, groupSize: e.target.value })} placeholder="15-20 kişi" />
            <Input label="Süre" value={editing.duration || ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} placeholder="7 gün / 6 gece" />
            <Input label="Tarihler (görünen metin)" value={editing.dates || ''} onChange={(e) => setEditing({ ...editing, dates: e.target.value })} placeholder="29 Ağustos - 5 Eylül" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Başlangıç Tarihi" type="date" value={dateInput(editing.startDate)} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
            <Input label="Bitiş Tarihi" type="date" value={dateInput(editing.endDate)} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
            <Input label="Instagram Reel Linki" value={editing.instagramUrl || ''} onChange={(e) => setEditing({ ...editing, instagramUrl: e.target.value })} placeholder="https://www.instagram.com/reel/..." />
          </div>
          <p className="-mt-1 text-xs text-slate-500">Bitiş tarihi bugünden önce olan turlar otomatik olarak "Geçmiş Turlar" bölümünde gösterilir; gelecek tarihli turlar rezervasyona/teklife açık kalır. Instagram reel linki eklenirse tur detay sayfasında özet video gösterilir.</p>

          <ImagePicker label="Kapak görseli" value={editing.image} onChange={(p) => setEditing({ ...editing, image: p })} />

          <ListEditor label="Galeri (görsel yolları)" value={editing.gallery || []} onChange={(gallery) => setEditing({ ...editing, gallery })} placeholder="/images/tours/foo.jpg" />
          <ListEditor label="Öne çıkanlar" value={editing.highlights || []} onChange={(highlights) => setEditing({ ...editing, highlights })} />
          <ListEditor label="Dahil olanlar" value={editing.included || []} onChange={(included) => setEditing({ ...editing, included })} />
          <ListEditor label="Dahil olmayanlar" value={editing.notIncluded || []} onChange={(notIncluded) => setEditing({ ...editing, notIncluded })} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Günlük Program</label>
            <ItineraryEditor value={editing.itinerary || []} onChange={(itinerary) => setEditing({ ...editing, itinerary })} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sıkça Sorulan Sorular</label>
            <FaqEditor value={editing.faq || []} onChange={(faq) => setEditing({ ...editing, faq })} />
          </div>

          <Textarea label="WhatsApp mesajı (hazır şablon)" value={editing.whatsappMessage || ''} onChange={(e) => setEditing({ ...editing, whatsappMessage: e.target.value })} rows={2} />

          <div className="flex flex-wrap gap-4 pt-2">
            <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
            <Checkbox label="Öne çıkar" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            <Checkbox label="Özel Teklif" checked={!!editing.specialOffer} onChange={(e) => setEditing({ ...editing, specialOffer: e.target.checked })} />
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">İngilizce İçerik (opsiyonel)</h3>
            <p className="mt-1 text-xs text-slate-500">Boş bırakılan alanlar için Türkçe içerik gösterilir.</p>

            <div className="mt-3 space-y-3">
              <Input label="Başlık (EN)" value={enVal('title')} onChange={(e) => setEn('title', e.target.value)} />
              <Textarea label="Kısa açıklama (EN)" value={enVal('description')} onChange={(e) => setEn('description', e.target.value)} />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Fiyat Notu (EN)" value={enVal('priceNote')} onChange={(e) => setEn('priceNote', e.target.value)} />
                <Input label="Süre (EN)" value={enVal('duration')} onChange={(e) => setEn('duration', e.target.value)} />
                <Input label="Tarihler (EN)" value={enVal('dates')} onChange={(e) => setEn('dates', e.target.value)} />
                <Input label="Grup Boyu (EN)" value={enVal('groupSize')} onChange={(e) => setEn('groupSize', e.target.value)} />
                <Input label="Hedef / Şehir (EN)" value={enVal('destination')} onChange={(e) => setEn('destination', e.target.value)} />
              </div>

              <ListEditor label="Öne çıkanlar (EN)" value={enVal('highlights', true)} onChange={(highlights) => setEn('highlights', highlights)} />
              <ListEditor label="Dahil olanlar (EN)" value={enVal('included', true)} onChange={(included) => setEn('included', included)} />
              <ListEditor label="Dahil olmayanlar (EN)" value={enVal('notIncluded', true)} onChange={(notIncluded) => setEn('notIncluded', notIncluded)} />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Günlük Program (EN)</label>
                <ItineraryEditor value={enVal('itinerary', true)} onChange={(itinerary) => setEn('itinerary', itinerary)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Sıkça Sorulan Sorular (EN)</label>
                <FaqEditor value={enVal('faq', true)} onChange={(faq) => setEn('faq', faq)} />
              </div>
            </div>
          </div>
        </>
        );
      }}
    />
  );
};

export default ToursAdminPage;
