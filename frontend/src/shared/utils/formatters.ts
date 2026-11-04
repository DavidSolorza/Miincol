/**
 * Utilidades de formato para el Plan de Desarrollo Ministerial (Misincol)
 */

export const formatCurrencyCOP = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const calculateWeeks = (startDateStr: string, endDateStr: string): { totalWeeks: number; remainingWeeks: number } => {
  if (!startDateStr || !endDateStr) return { totalWeeks: 0, remainingWeeks: 0 };
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const now = new Date().getTime();

  const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
  const totalWeeks = Math.max(1, Math.round((end - start) / oneWeekMs));
  const remainingWeeks = Math.max(0, Math.round((end - now) / oneWeekMs));

  return { totalWeeks, remainingWeeks };
};
