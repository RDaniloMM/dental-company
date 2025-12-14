export const getCurrencySymbol = (code?: string | null): string => {
  if (!code) return 'S/'
  const map: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PEN: 'S/',
    CLP: 'CLP',
    UYU: '$U',
    MXN: '$',
    ARS: '$',
  }
  return map[code] || code + ' '
}

export const getCurrencyCode = (monedaId?: string | null): string => {
  const map: Record<string, string> = {
    'usd': 'USD',
    'eur': 'EUR',
    'gbp': 'GBP',
    'pen': 'PEN',
    'clp': 'CLP',
    'uyu': 'UYU',
    'mxn': 'MXN',
    'ars': 'ARS',
  }
  if (!monedaId) return 'PEN'
  
  if (monedaId.length > 10 && !map[monedaId.toLowerCase()]) {
    return 'PEN' 
  }
  
  return map[monedaId.toLowerCase()] || 'PEN'
}