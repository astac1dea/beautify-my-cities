import Icon from './Icon'

const VARIANTS = {
  primary:   { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)' },
  secondary: { background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border-firm)' },
  success:   { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' },
  ghost:     { background: 'transparent', color: 'var(--link)', borderColor: 'transparent' },
  danger:    { background: 'var(--surface)', color: 'var(--red)', borderColor: '#E4C7C8' },
  inverse:   { background: '#fff', color: 'var(--navy)', borderColor: '#fff' },
  outline:   { background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.5)' },
}

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '9px 18px', fontSize: 14 },
  lg: { padding: '13px 26px', fontSize: 15 },
}

export default function Button({
  variant = 'primary', size = 'md', full, disabled,
  icon, iconAfter, style, children, ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.primary

  return (
    <button
      disabled={disabled}
      style={{
        ...v,
        ...SIZES[size],
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: full ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        lineHeight: 1.35,
        whiteSpace: 'nowrap',
        transition: 'filter .13s ease, box-shadow .13s ease',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(.94)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === 'lg' ? 'md' : 'sm'} />}
    </button>
  )
}
