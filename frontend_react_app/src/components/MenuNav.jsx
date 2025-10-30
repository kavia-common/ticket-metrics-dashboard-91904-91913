import React from 'react';

/**
 * MenuNav
 * Simple button group/tabs for view mode selection.
 *
 * PUBLIC_INTERFACE
 */
export default function MenuNav({ items = [], viewMode, setViewMode }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {items.map(item => {
        const active = viewMode === item;
        return (
          <button
            key={item}
            className="btn"
            style={{
              background: active ? 'var(--color-primary)' : 'var(--color-surface)',
              color: active ? '#fff' : 'var(--color-text)',
              borderColor: active ? 'rgba(37,99,235,0.25)' : 'var(--border-color)'
            }}
            onClick={() => setViewMode(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
