import { useRef, useState } from 'react';
import { Button } from './ui';

// Tiny incrementing counter used to assign stable per-item React keys
// independent of array index — survives reorder without re-mounting children.
let seq = 0;
const nextKey = () => ++seq;

// Simple editor for a string array: add / remove / reorder.
const ListEditor = ({ label, value = [], onChange, placeholder = 'Yeni öğe ekle' }) => {
  const [draft, setDraft] = useState('');
  // Mirror array of keys, kept in sync with `value` so reordering doesn't
  // confuse React's reconciler.
  const keysRef = useRef(value.map(() => nextKey()));
  // Re-sync if the value length changes externally (e.g. form reset).
  if (keysRef.current.length !== value.length) {
    keysRef.current = value.map((_, i) => keysRef.current[i] ?? nextKey());
  }

  const add = () => {
    if (!draft.trim()) return;
    keysRef.current = [...keysRef.current, nextKey()];
    onChange([...(value || []), draft.trim()]);
    setDraft('');
  };
  const remove = (i) => {
    keysRef.current = keysRef.current.filter((_, idx) => idx !== i);
    onChange(value.filter((_, idx) => idx !== i));
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const nextVal = [...value];
    const nextKeys = [...keysRef.current];
    [nextVal[i], nextVal[j]] = [nextVal[j], nextVal[i]];
    [nextKeys[i], nextKeys[j]] = [nextKeys[j], nextKeys[i]];
    keysRef.current = nextKeys;
    onChange(nextVal);
  };

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <Button variant="secondary" onClick={add}>Ekle</Button>
      </div>
      {value.length > 0 && (
        <ul className="mt-2 space-y-1">
          {value.map((item, i) => (
            <li
              key={keysRef.current[i]}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
            >
              <span className="flex-1 break-words">{item}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100" disabled={i === 0}>↑</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100" disabled={i === value.length - 1}>↓</button>
                <button type="button" onClick={() => remove(i)} className="rounded px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListEditor;
export { ListEditor };
