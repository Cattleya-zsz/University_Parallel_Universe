const MAJOR_THEMES = {
  computer: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    soft: '#eef2ff',
    softer: '#f8f7ff',
    border: '#a5b4fc',
    text: '#3730a3',
    accent: '#06b6d4',
    paper: '#fffefe',
    ink: '#252342'
  },
  medicine: {
    primary: '#0f9f7a',
    secondary: '#14b8a6',
    soft: '#dcfce7',
    softer: '#f4fffb',
    border: '#86efac',
    text: '#047857',
    accent: '#2563eb',
    paper: '#fffefe',
    ink: '#17352f'
  },
  business: {
    primary: '#d97706',
    secondary: '#2563eb',
    soft: '#fef3c7',
    softer: '#fffaf0',
    border: '#fbbf24',
    text: '#92400e',
    accent: '#4338ca',
    paper: '#fffefd',
    ink: '#3f2b16'
  }
}

const DEFAULT_THEME = MAJOR_THEMES.computer

export function getMajorTheme(majorId) {
  return MAJOR_THEMES[majorId] || DEFAULT_THEME
}

export function getMajorThemeStyle(majorId) {
  const theme = getMajorTheme(majorId)

  return {
    '--primary-color': theme.primary,
    '--secondary-color': theme.secondary,
    '--theme-soft': theme.soft,
    '--theme-softer': theme.softer,
    '--theme-border': theme.border,
    '--theme-text': theme.text,
    '--theme-accent': theme.accent,
    '--theme-paper': theme.paper,
    '--theme-ink': theme.ink,
    '--background-gradient': `
      radial-gradient(circle at 12% 8%, ${theme.soft} 0 6%, transparent 24%),
      linear-gradient(135deg, #fbfcff 0%, ${theme.paper} 52%, ${theme.softer} 100%)
    `
  }
}
