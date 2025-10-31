/**
 * Модуль бюджету - BudgetPlanner
 * Дозволяє встановлювати ліміти витрат по категоріях та стежити за перевищеннями
 */

import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Entertainment' | 'Other';
  description?: string;
}

const CATEGORIES: Record<string, string> = {
  'Food': '💵 Їжа',
  'Transport': '🚗 Транспорт',
  'Entertainment': '🎮 Розваги',
  'Other': '📌 Інше',
};

const DEFAULT_LIMITS: Record<string, number> = {
  'Food': 3000,
  'Transport': 1500,
  'Entertainment': 2000,
  'Other': 1000,
};

export function BudgetPlanner() {
  const [budgets, setBudgets] = useState<Record<string, number>>(DEFAULT_LIMITS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Завантаження бюджету та витрат при монтуванні
  useEffect(() => {
    const loadedBudgets = getFromStorage<Record<string, number>>(
      STORAGE_KEYS.BUDGET,
      DEFAULT_LIMITS
    );
    setBudgets(loadedBudgets);

    const loadedExpenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    setExpenses(loadedExpenses);
  }, []);

  // Збереження бюджету до localStorage при його зміні
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUDGET, budgets);
  }, [budgets]);

  // Отримання витрат за поточний місяць
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));

  // Розрахунок витрат по категоріях
  const categorySpending = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Розрахунок статусу для категорії
  const getCategoryStatus = (category: string) => {
    const spent = categorySpending[category] || 0;
    const limit = budgets[category] || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const remaining = Math.max(0, limit - spent);

    return {
      spent,
      limit,
      remaining,
      percentage: Math.min(percentage, 100),
      isExceeded: spent > limit,
    };
  };

  // Визначення кольору залежно від стану
  const getStatusColor = (percentage: number, isExceeded: boolean) => {
    if (isExceeded) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'default';
  };

  // Редагування ліміту
  const handleEditStart = (category: string, value: number) => {
    setEditingCategory(category);
    setEditValue(value.toString());
  };

  const handleEditSave = (category: string) => {
    const newValue = parseFloat(editValue);
    if (newValue > 0) {
      setBudgets({ ...budgets, [category]: newValue });
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  // Скидання всіх бюджетів до стандартних
  const handleResetBudgets = () => {
    if (confirm('Скинути всі бюджети до стандартних значень?')) {
      setBudgets(DEFAULT_LIMITS);
    }
  };

  // Загальна інформація
  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const totalSpent = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="module-container budget-planner">
      <h2 className="module-title">📊 Мій Бюджет</h2>

      {/* Загальний прогрес */}
      <div className="budget-overview">
        <div className="overview-header">
          <h3>Поточний місяць</h3>
          <button onClick={handleResetBudgets} className="btn btn-secondary btn-sm">
            Скинути
          </button>
        </div>

        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-label">Бюджет</div>
            <div className="stat-value">{totalBudget.toFixed(0)} грн</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Витрачено</div>
            <div className="stat-value positive">{totalSpent.toFixed(2)} грн</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Залишилось</div>
            <div className={`stat-value ${totalRemaining >= 0 ? 'positive' : 'negative'}`}>
              {totalRemaining.toFixed(2)} грн
            </div>
          </div>
        </div>

        <div className="overall-progress">
          <div className="progress-bar">
            <div
              className={`progress-fill ${getStatusColor(totalPercentage, totalSpent > totalBudget)}`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            />
          </div>
          <div className="progress-label">
            {totalPercentage.toFixed(0)}% від загального бюджету
          </div>
        </div>
      </div>

      {/* Категорії */}
      <div className="budget-categories">
        <h3 className="categories-title">По категоріях</h3>

        <div className="categories-grid">
          {Object.entries(CATEGORIES).map(([categoryKey, categoryLabel]) => {
            const status = getCategoryStatus(categoryKey);
            const statusColor = getStatusColor(status.percentage, status.isExceeded);

            return (
              <div key={categoryKey} className="budget-card">
                <div className="card-header">
                  <span className="category-label">{categoryLabel}</span>
                  <span className={`status-badge ${statusColor}`}>
                    {status.isExceeded ? '⚠️ Перевищено' : `${status.percentage.toFixed(0)}%`}
                  </span>
                </div>

                <div className="card-content">
                  <div className="budget-display">
                    {editingCategory === categoryKey ? (
                      <div className="edit-input-group">
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="form-input edit-input"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(categoryKey)}
                          className="btn btn-sm btn-primary"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="btn btn-sm btn-secondary"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        className="budget-value"
                        onClick={() => handleEditStart(categoryKey, budgets[categoryKey])}
                        title="Натисніть для редагування"
                      >
                        <span className="limit-text">{budgets[categoryKey]} грн</span>
                        <span className="edit-hint">✎</span>
                      </div>
                    )}
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${statusColor}`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>

                  <div className="spending-info">
                    <span className="spent-amount">
                      Витрачено: {status.spent.toFixed(2)} грн
                    </span>
                    <span className="remaining-amount">
                      Залишилось: {status.remaining.toFixed(2)} грн
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Статистика */}
      <div className="budget-statistics">
        <h3 className="stats-title">Статистика</h3>

        <div className="stats-list">
          <div className="stat-item">
            <span className="stat-item-label">Категорії в межах бюджету:</span>
            <span className="stat-item-value">
              {Object.keys(CATEGORIES).filter(
                cat => !getCategoryStatus(cat).isExceeded
              ).length} / {Object.keys(CATEGORIES).length}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-item-label">Максимальне перевищення:</span>
            <span className="stat-item-value negative">
              {Math.max(
                ...Object.keys(CATEGORIES).map(cat => {
                  const status = getCategoryStatus(cat);
                  return status.isExceeded ? status.spent - status.limit : 0;
                }),
                0
              ).toFixed(2)} грн
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-item-label">Економлення:</span>
            <span className={`stat-item-value ${totalRemaining >= 0 ? 'positive' : 'negative'}`}>
              {Math.abs(totalRemaining).toFixed(2)} грн
            </span>
          </div>
        </div>
      </div>

      {/* Порада */}
      <div className="budget-tip">
        <p className="tip-text">
          💡 <strong>Порада:</strong> Натисніть на значення ліміту, щоб його змінити. 
          Регулярно переглядайте витрати, щоб залишатися в межах бюджету.
        </p>
      </div>
    </div>
  );
}
