const DAYS = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']

export function todayKey() {
  return DAYS[new Date().getDay()]
}

export function isOpenNow(hours) {
  const slot = hours?.[todayKey()]
  if (!slot || slot === 'chiuso') return false
  if (slot === '00:00-23:59') return true
  const [start, end] = slot.split('-')
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes()
  return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em
}
