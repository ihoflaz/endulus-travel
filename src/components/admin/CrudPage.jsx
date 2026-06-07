import { useMemo } from 'react';
import {
  Button, ConfirmDialog, Drawer, PageHeader, Table, ToastStack, useToast,
} from './ui';

/**
 * Re-usable admin CRUD shell that combines a list table, a drawer form, a
 * confirm dialog, and a toast stack. Specific entity pages just provide:
 *  - resource    : returned by useCrudResource
 *  - title       : page title
 *  - description : page subtitle
 *  - createLabel : button text for create
 *  - columns     : table columns (provided as a function (helpers) → columns)
 *  - renderForm  : (editing, setEditing) → form body inside the drawer
 *  - confirmMessage : (row) => string
 *  - wide        : wide drawer flag
 *  - extraActions: optional extra action area in header
 *  - rowKeyLabel : for confirm dialog message
 */
const CrudPage = ({
  resource,
  title,
  description,
  createLabel = '+ Yeni',
  renderForm,
  columns,
  confirmMessage,
  wide = false,
  extraActions,
  emptyText,
  rowKeyLabel = 'kaydı',
  // Optional payload transform — runs inside the hook so React state is
  // already settled. Use for numeric coercion, nullification, etc.
  transformPayload,
}) => {
  const { items: toastItems, show, dismiss } = useToast();
  const {
    items, loading, editing, setEditing, open, openCreate, openEdit, close,
    confirm, setConfirm, saving, save, remove,
  } = resource;

  const wrappedSave = async (e) => {
    e?.preventDefault?.();
    if (saving) return; // hard-block double submit (Enter key bypasses disabled)
    try {
      await save(transformPayload);
      show(editing?.id ? 'Güncellendi' : 'Eklendi');
    } catch (err) {
      show(err?.body?.error || err.message, 'error');
    }
  };

  const wrappedRemove = async () => {
    try {
      await remove(confirm);
      show('Silindi');
    } catch (err) {
      show(err?.body?.error || err.message, 'error');
    }
  };

  const tableColumns = useMemo(
    () => columns({ openEdit, setConfirm }),
    [columns, openEdit, setConfirm]
  );

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {extraActions}
            <Button onClick={() => openCreate()}>{createLabel}</Button>
          </>
        }
      />

      {loading ? (
        <div className="text-slate-500">Yükleniyor…</div>
      ) : (
        <Table columns={tableColumns} rows={items} empty={emptyText || 'Henüz kayıt yok'} />
      )}

      <Drawer
        wide={wide}
        open={open}
        onClose={close}
        title={editing?.id ? `Düzenle — ${editing.title || editing.label || editing.name || editing.email || editing.id}` : `Yeni ${rowKeyLabel}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={close}>Vazgeç</Button>
            <Button onClick={wrappedSave} disabled={saving}>
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </Button>
          </div>
        }
      >
        {editing && (
          <form onSubmit={wrappedSave} className="space-y-3">
            {renderForm(editing, setEditing)}
          </form>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={wrappedRemove}
        title="Sil"
        message={confirm ? confirmMessage(confirm) : ''}
        loading={saving}
      />

      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default CrudPage;
