export default function Badge({ color = '#6B7A9F', bg = '#EEF1F8', size = 'md', style, children }) {
  const dims = size === 'sm'
    ? { fontSize: 10, padding: '2px 7px' }
    : { fontSize: 11, padding: '3px 9px' }
  return (
    <span style={{
      ...dims,
      color,
      background: bg,
      borderRadius: 50,
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  )
}
