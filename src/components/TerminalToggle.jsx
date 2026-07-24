export default function TerminalToggle({ value, onChange }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: 120,
        padding: 4,
        borderRadius: 9999,
        background: 'var(--border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: value === 'T1' ? 4 : '50%',
          width: 'calc(50% - 4px)',
          borderRadius: 9999,
          background: 'var(--accent)',
          transition: 'left 0.2s ease',
        }}
      />
      {['T1', 'T2'].map((terminal) => (
        <button
          key={terminal}
          type="button"
          onClick={() => onChange(terminal)}
          aria-pressed={value === terminal}
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: value === terminal ? 'var(--on-accent)' : 'var(--text)',
            fontWeight: value === terminal ? 700 : 400,
            padding: '6px 0',
          }}
        >
          {terminal}
        </button>
      ))}
    </div>
  )
}
