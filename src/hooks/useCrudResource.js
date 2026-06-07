import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

/**
 * Generic CRUD hook used by admin pages.
 * Encapsulates: list/load + saving + deleting + the toast/loading machinery.
 *
 * Options:
 * - endpoint    : '/tours', '/blog', etc.
 * - empty       : empty record template (used for "Yeni" button)
 * - listKey     : if endpoint returns { [listKey]: [] } (e.g. tours → "featured")
 * - listParams  : extra query string for GET (e.g. '?women=true')
 * - stripFields : fields to omit from PUT payload (default: id, createdAt, updatedAt)
 */
export const useCrudResource = ({
  endpoint,
  empty = {},
  listKey,
  listParams = '',
  stripFields = ['id', 'createdAt', 'updatedAt'],
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endpoint}${listParams}`);
      const list = listKey ? res?.[listKey] ?? [] : Array.isArray(res) ? res : [];
      if (mounted.current) setItems(list);
    } catch (e) {
      // Don't blow up the page on a transient list-load failure; surface a
      // log entry and reset to empty so the admin shell still renders.
      console.error(`[useCrudResource] failed to load ${endpoint}`, e);
      if (mounted.current) setItems([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [endpoint, listParams, listKey]);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback((overrides = {}) => {
    setEditing({ ...empty, ...overrides });
    setOpen(true);
  }, [empty]);

  const openEdit = useCallback((row) => {
    // Deep-default nested arrays/objects so editors don't crash on null
    const cleaned = {};
    for (const [k, v] of Object.entries(empty)) {
      cleaned[k] = row[k] !== undefined && row[k] !== null ? row[k] : v;
    }
    setEditing({ ...row, ...cleaned, id: row.id });
    setOpen(true);
  }, [empty]);

  const close = useCallback(() => {
    setOpen(false);
    setEditing(null);
  }, []);

  const strip = (obj) => {
    const out = { ...obj };
    for (const k of stripFields) delete out[k];
    return out;
  };

  // Optional `transform` is called on the editing record before sending it to
  // the API. Page-specific normalization (e.g. coerce strings to numbers) goes
  // there — much safer than the previous "mutate r.save in parent component"
  // anti-pattern which fought with React state batching.
  const save = useCallback(async (transform) => {
    const base = editing;
    if (!base) return null;
    const record = transform ? transform(base) : base;
    setSaving(true);
    try {
      if (record.id) {
        const updated = await api.put(`${endpoint}/${record.id}`, strip(record));
        await load();
        close();
        return updated;
      }
      const created = await api.post(endpoint, strip(record));
      await load();
      close();
      return created;
    } finally {
      setSaving(false);
    }
  }, [editing, endpoint, load, close]);

  const remove = useCallback(async (row) => {
    setSaving(true);
    try {
      await api.delete(`${endpoint}/${row.id}`);
      setConfirm(null);
      await load();
    } finally {
      setSaving(false);
    }
  }, [endpoint, load]);

  return {
    items, loading, editing, setEditing, open, openCreate, openEdit, close,
    confirm, setConfirm, saving, save, remove, reload: load,
  };
};
