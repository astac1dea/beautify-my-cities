const VARIANTS = {
  primary:  { background: 'var(--blue)', color: 'white', border: '1px solid var(--blue)' },
  secondary:{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
  success:  { background: 'var(--green)', color: 'white', border: '1px solid var(--green)' },
  ghost:    { background: 'transparent', color: 'var(--muted)', border: '1px solid transparent' },
  danger:   { background: 'var(--surface)', color: '#DC2626', border: '1px solid #FECACA' },
}

const SIZES = {
  sm: { padding: '7px 12px', fontSize: 12, borderRadius: 7 },
  md: { padding: '10px 18px', fontSize: 13, borderRadius: 8 },
  lg: { padding: '13px 24px', fontSize: 15, borderRadius: 10 },
}

export default function Button({
  variant = 'primary', size = 'md', full, disabled, style, children, ...rest
}) {
  return (
    <button
      disabled={disabled}
      style={{
        ...VARIANTS[variant],
        ...SIZES[size],
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        lineHeight: 1.3,
        transition: 'filter .15s ease',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.94)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
      {...rest}
    >
      {children}
    </button>
  )
}
