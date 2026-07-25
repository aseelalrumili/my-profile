export function getErrorMessage(err: any, fallback: string): string {
  const detail = err?.response?.data?.error || err?.response?.data?.inner || err?.message;
  return detail ? `${fallback}: ${detail}` : fallback;
}

export function moveItem<T extends { id: number; sortOrder: number }>(
  items: T[], index: number, direction: 'up' | 'down'
): T[] {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
  return copy.map((item, i) => ({ ...item, sortOrder: i }));
}

export function SortArrows({ onUp, onDown, canUp, canDown }: {
  onUp: () => void; onDown: () => void; canUp: boolean; canDown: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginInlineEnd: '0.25rem' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={onUp}
        disabled={!canUp}
        style={{ padding: '2px 6px', fontSize: '0.65rem', lineHeight: 1, opacity: canUp ? 1 : 0.3 }}
        aria-label="Move up"
      >&#9650;</button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={onDown}
        disabled={!canDown}
        style={{ padding: '2px 6px', fontSize: '0.65rem', lineHeight: 1, opacity: canDown ? 1 : 0.3 }}
        aria-label="Move down"
      >&#9660;</button>
    </div>
  );
}
