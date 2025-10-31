/**
 * Модуль витрат - ExpenseTracker
 * Дозволяє користувачу додавати, переглядати та аналізувати витрати
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

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'Food',
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Завантаження витрат при монтуванні
  useEffect(() => {
    const loaded = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    setExpenses(loaded);
  }, []);

  // Збереження витрат до localStorage при їх зміні
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  // Фільтрування витрат по вибраному місяцю
  const filteredExpenses = expenses.filter(exp =>
    exp.date.startsWith(selectedMonth)
  );

  // Розрахунок суми по категоріям
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Загальна сума за місяць
  const monthTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Додавання нової витрати
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (newExpense.amount <= 0) {
      alert('Введіть коректну суму');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      date: newExpense.date,
      amount: newExpense.amount,
      category: newExpense.category,
      description: newExpense.description,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: 'Food',
    });
  };

  // Видалення витрати
  const handleDeleteExpense = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю витрату?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  // Форматування дати для відображення
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Форматування місяця-року для заголовка
  const formatMonthYear = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('uk-UA', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="module-container expense-tracker">
      <h2 className="module-title">📋 Витрати за місяць</h2>

      {/* Форма додавання витрати */}
      <form onSubmit={handleAddExpense} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Дата</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Сума (грн)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newExpense.amount || ''}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })
              }
              placeholder="0"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Категорія</label>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  category: e.target.value as Expense['category'],
                })
              }
              className="form-select"
            >
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Опис (опц.)</label>
            <input
              type="text"
              value={newExpense.description || ''}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              placeholder="Деталі..."
              className="form-input"
              maxLength={50}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          + Додати витрату
        </button>
      </form>

      {/* Вибір місяця */}
      <div className="month-selector">
        <label className="form-label">Переглянути місяць</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Підсумок по категоріях */}
      <div className="expense-summary">
        <h3 className="summary-title">
          {formatMonthYear(selectedMonth)}
        </h3>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">Витрат не знайдено</p>
          </div>
        ) : (
          <>
            <div className="category-breakdown">
              {Object.entries(CATEGORIES).map(([category, label]) => {
                const total = categoryTotals[category] || 0;
                if (total === 0) return null;

                const percentage = Math.round((total / monthTotal) * 100);

                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{label}</span>
                      <span className="category-amount">
                        {total.toFixed(2)} грн
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="category-percent">{percentage}%</div>
                  </div>
                );
              })}
            </div>

            {/* Загальна сума */}
            <div className="month-total">
              <span>Всього за місяць:</span>
              <span className="total-amount">{monthTotal.toFixed(2)} грн</span>
            </div>

            {/* Список витрат */}
            <div className="expenses-list">
              <h4 className="list-title">Деталі витрат</h4>
              <div className="table-container">
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Категорія</th>
                      <th>Сума</th>
                      <th>Опис</th>
                      <th>Дія</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <tr key={expense.id}>
                          <td>{formatDate(expense.date)}</td>
                          <td>{CATEGORIES[expense.category]}</td>
                          <td className="amount-cell">
                            {expense.amount.toFixed(2)} грн
                          </td>
                          <td className="description-cell">
                            {expense.description || '—'}
                          </td>
                          <td className="action-cell">
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="btn-delete"
                              title="Видалити"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
