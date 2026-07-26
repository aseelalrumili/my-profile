import { useState } from 'react';

interface Props {
  name: string;
  onSave: (n: string) => void;
  isAr: boolean;
}

export default function EditingName({ name, onSave, isAr }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  if (!editing) {
    return (
      <span
        style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
        onClick={() => { setEditing(true); setValue(name); }}
      >
        {name}
      </span>
    );
  }

  return (
    <form onSubmit={e => { e.preventDefault(); if (value.trim()) { onSave(value.trim()); setEditing(false); } }} style={{ display: 'flex', gap: '0.25rem' }}>
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => { if (value.trim()) { onSave(value.trim()); setEditing(false); } else setEditing(false); }}
        style={{ padding: '2px 6px', fontSize: '0.95rem', fontWeight: 500, border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)' }}
      />
    </form>
  );
}
