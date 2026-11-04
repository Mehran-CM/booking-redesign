const P = {
  back: <path d="M15 18l-6-6 6-6" />,
  right: <path d="M9 18l6-6-6-6" />,
  left: <path d="M15 18l-6-6 6-6" />,
  down: <path d="M6 9l6 6 6-6" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  filter: <path d="M4 5h16l-6 7.5V19l-4 2v-8.5z" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  pin: (<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>),
  bed: (<><path d="M3 19V6M3 15h18v4M21 15v-2.5a3 3 0 0 0-3-3h-7V15" /><circle cx="7" cy="11.5" r="1.8" /></>),
  plane: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  car: (<><path d="M5 16l1.5-6A2 2 0 0 1 8.4 8.5h7.2a2 2 0 0 1 1.9 1.5L19 16" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="19" r="0.6" /><circle cx="16.5" cy="19" r="0.6" /></>),
  ticket: <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  bell: <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16zM10 21h4" />,
  arrow: <path d="M7 17L17 7M8 7h9v9" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  share: <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 13v8h14v-8" />,
  copy: (<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>),
  parking: (<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M10 17V7h3a3 3 0 0 1 0 6h-3" /></>),
  coffee: <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 11h2a2 2 0 0 1 0 4h-2M7 3v3M11 3v3M15 3v3" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  wifi: <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5v.01" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  directions: <path d="M12 2l10 10-10 10L2 12zM9 14v-2.5A1.5 1.5 0 0 1 10.5 10H15M13 7.5l2.5 2.5-2.5 2.5" />,
  wallet: <path d="M3 7a2 2 0 0 1 2-2h14v4M3 7v11a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2zM17 14.5h.01" />,
  card: (<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>),
  alert: (<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.01" /></>),
  offline: <path d="M2 9a15 15 0 0 1 8-3.6M22 9a15 15 0 0 0-4-2.7M5 12.5a10 10 0 0 1 4-2.2M19 12.5a10 10 0 0 0-2.5-1.9M8.5 16a5 5 0 0 1 7 0M12 19.5v.01M3 3l18 18" />,
  pool: <path d="M3 17c2 0 2-1.5 4.5-1.5S10 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17M8 14V6a2 2 0 0 1 4 0M14 14V6a2 2 0 0 1 4 0M8 9h6" />,
  key: (<><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
};

export default function Icon({ name, size = 'icon', label }) {
  const px = size === 'control' ? 'var(--size-control-icon)' : 'var(--size-icon)';
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill={name === 'heart-filled' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className="icon"
      style={{ '--icon-size': px }}
    >
      {P[name === 'heart-filled' ? 'heart' : name]}
    </svg>
  );
}
