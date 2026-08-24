// Outline icon set. Single stroke weight, round caps, 24x24 grid, drawn with
// currentColor so icons inherit the colour of whatever they sit in.
// Replaces the emoji the app used to lean on.

const PATHS = {
  // navigation
  map:        <><path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6z" /><path d="M9 3.5V18" /><path d="M15 6v14.5" /></>,
  pin:        <><path d="M20 10.5c0 5.2-6.5 10.5-8 10.5s-8-5.3-8-10.5a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10.3" r="2.8" /></>,
  pinPlus:    <><path d="M20 10.5c0 5.2-6.5 10.5-8 10.5s-8-5.3-8-10.5a8 8 0 1 1 16 0Z" /><path d="M12 7.6v5.4M9.3 10.3h5.4" /></>,
  calendar:   <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.6h17M8.2 3.5v3.2M15.8 3.5v3.2" /></>,
  award:      <><circle cx="12" cy="9" r="5.5" /><path d="m8.6 13.6-1.4 6.9 4.8-2.5 4.8 2.5-1.4-6.9" /></>,
  chart:      <><path d="M4 20.5h16" /><rect x="5" y="12" width="3.6" height="6" rx="1" /><rect x="10.2" y="7.5" width="3.6" height="10.5" rx="1" /><rect x="15.4" y="4" width="3.6" height="14" rx="1" /></>,
  user:       <><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.4a7.4 7.4 0 0 1 14.4 0" /></>,
  users:      <><circle cx="9.4" cy="8.2" r="3.4" /><path d="M3 20.2a6.6 6.6 0 0 1 12.8 0" /><path d="M16.2 5.2a3.4 3.4 0 0 1 0 6.5M17.4 14.6a6.6 6.6 0 0 1 3.6 5.6" /></>,

  // actions
  plus:       <path d="M12 5v14M5 12h14" />,
  menu:       <path d="M4 7h16M4 12h16M4 17h16" />,
  check:      <path d="m4.5 12.6 5 5L19.5 6.8" />,
  checkCircle:<><circle cx="12" cy="12" r="8.6" /><path d="m8.2 12.2 2.7 2.7 5-5.3" /></>,
  close:      <path d="m6 6 12 12M18 6 6 18" />,
  arrowRight: <><path d="M4.5 12h14.5" /><path d="m13 6 6 6-6 6" /></>,
  chevronRight:<path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  chevronLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  download:   <><path d="M12 3.8v11.4" /><path d="m7.2 10.6 4.8 4.8 4.8-4.8" /><path d="M4.5 19.5h15" /></>,
  search:     <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.4 15.4 4.3 4.3" /></>,
  logout:     <><path d="M9.5 20.5H5.4a1.9 1.9 0 0 1-1.9-1.9V5.4a1.9 1.9 0 0 1 1.9-1.9h4.1" /><path d="M15.5 16.5 20 12l-4.5-4.5" /><path d="M20 12H9" /></>,

  // information
  clock:      <><circle cx="12" cy="12" r="8.6" /><path d="M12 7.2V12l3.2 2" /></>,
  mail:       <><rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2" /><path d="m3.8 7 7.1 5.4a1.8 1.8 0 0 0 2.2 0L20.2 7" /></>,
  phone:      <path d="M8.4 4.2 10 8l-1.9 1.5a11 11 0 0 0 5.5 5.4L15 13l3.8 1.6v3.4a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 3.4 6.4a1.8 1.8 0 0 1 1.8-2h3.2Z" />,
  building:   <><path d="M4.5 20.5V6.2L12 3.5l7.5 2.7v14.3" /><path d="M3 20.5h18" /><path d="M9.4 20.5v-4.4h5.2v4.4" /><path d="M9.2 9.4h1.4M13.4 9.4h1.4M9.2 12.8h1.4M13.4 12.8h1.4" /></>,
  thumbsUp:   <><path d="M6.5 20.2V10.4h2.2l3-6a2.1 2.1 0 0 1 3 2.4l-.9 3.6h4.3a2 2 0 0 1 1.9 2.5l-1.5 6a2 2 0 0 1-1.9 1.5H6.5Z" /><rect x="2.8" y="10.4" width="3.7" height="9.8" rx="1.2" /></>,
  flag:       <><path d="M5.5 21V3.8" /><path d="M5.5 4.6h11.8l-2.2 4 2.2 4H5.5" /></>,
  info:       <><circle cx="12" cy="12" r="8.6" /><path d="M12 11v5.2M12 7.9h.01" /></>,

  // pin categories
  trash:      <><path d="M4.5 6.8h15" /><path d="M9.4 6.8V4.6h5.2v2.2" /><path d="M6.4 6.8 7.3 20a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.9-13.2" /><path d="M10.4 10.6v6.6M13.6 10.6v6.6" /></>,
  spray:      <><rect x="7.6" y="8.4" width="7.4" height="13" rx="1.8" /><path d="M9.8 8.4V5.2a1.4 1.4 0 0 1 1.4-1.4h.6a1.4 1.4 0 0 1 1.4 1.4v3.2" /><path d="M18 4.4h.01M20.6 6.6h.01M18 9.2h.01M20.6 11.6h.01" /><path d="M7.6 12.6H15" /></>,
  brush:      <><path d="M14.4 3.9 20 9.5l-8 8a3 3 0 0 1-1.6.9l-4.2.8.8-4.2a3 3 0 0 1 .9-1.6Z" /><path d="m12.6 5.7 5.6 5.6" /><path d="M4.5 21h6" /></>,
  bench:      <><path d="M3.5 10.2h17" /><path d="M3.5 13.6h17" /><path d="M5.5 10.2V20M18.5 10.2V20" /><path d="M4.6 6.8h14.8l1 3.4H3.6Z" /></>,
}

const SIZES = { xs: 14, sm: 16, md: 18, lg: 22, xl: 28 }

export default function Icon({ name, size = 'md', stroke = 1.7, style, label, ...rest }) {
  const path = PATHS[name]
  if (!path) return null
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{ flexShrink: 0, display: 'block', ...style }}
      {...rest}
    >
      {label && <title>{label}</title>}
      {path}
    </svg>
  )
}
