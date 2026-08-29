import Icon from './Icon'

export default function Badge({
  color = 'var(--muted)', bg = '#EDF0F3', icon, size = 'md', style, children,
}) {
  const dims = size === 'sm'
    ? { fontSize: 11.5, padding: '2px 8px' }
    : { fontSize: 12, padding: '3px 10px' }

  return (
    <span style={{
      ...dims,
      color,
      background: bg,
      borderRadius: 0,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      whiteSpace: 'nowrap',
      lineHeight: 1.5,
      ...style,
    }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 13} stroke={2} />}
      {children}
    </span>
  )
}
