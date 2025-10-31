/**
 * Утиліти для роботи з LocalStorage
 */

export const STORAGE_KEYS = {
  RATES: 'currency_rates_cache',
  EXPENSES: 'expenses_log',
  BUDGET: 'budget_limits',
  GOALS: 'savings_goals',
  STOCKS: 'stock_portfolio',
  STOCK_PRICES: 'last_stock_prices'
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage: ${key}`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
}

export function clearStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing storage: ${key}`, error);
  }
}

export function getAllStorage(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : null;
      }
    }
  } catch (error) {
    console.error('Error reading all storage:', error);
  }
  return data;
}
