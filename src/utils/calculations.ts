/**
 * Утиліти для фінансових розрахунків
 */

export function formatCurrency(value: number, currency: 'UAH' | 'USD' | 'EUR' | 'PLN' | 'GBP'): string {
  return `${value.toFixed(2)} ${currency}`;
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (months === 0 || annualRate === 0) {
    return principal / Math.max(1, months);
  }
  
  const monthlyRate = annualRate / 100 / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) 
         / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number,
  compoundPeriods: number = 12
): number {
  return principal * Math.pow(1 + rate / 100 / compoundPeriods, compoundPeriods * years);
}

export function calculateLoanTotal(
  _principal: number,
  monthlyPayment: number,
  months: number
): number {
  return monthlyPayment * months;
}

export function calculateLoanOverpayment(
  total: number,
  principal: number
): number {
  return total - principal;
}
