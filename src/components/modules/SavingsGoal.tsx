/**
 * Модуль цілей - SavingsGoal
 * Дозволяє встановлювати та відслідковувати фінансові цілі заощаджень
 */

import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  currency: 'UAH' | 'USD' | 'EUR';
  deadline: string;
  createdAt: string;
}

export function SavingsGoal() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    currency: 'UAH' as 'UAH' | 'USD' | 'EUR',
    deadline: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  // Завантаження цілей при монтуванні
  useEffect(() => {
    const loaded = getFromStorage<Goal[]>(STORAGE_KEYS.GOALS, []);
    setGoals(loaded);
  }, []);

  // Збереження цілей до localStorage при їх зміні
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  // Розрахунок прогресу для ціљи
  const calculateProgress = (goal: Goal) => {
    if (goal.target === 0) return 0;
    return Math.min((goal.saved / goal.target) * 100, 100);
  };

  // Розрахунок залишку до цілі
  const calculateRemaining = (goal: Goal) => {
    return Math.max(0, goal.target - goal.saved);
  };

  // Розрахунок днів до дедлайну
  const calculateDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  // Розрахунок потрібного щомісячного заощадження
  const calculateMonthlyNeeded = (goal: Goal) => {
    const remaining = calculateRemaining(goal);
    const daysLeft = Math.max(1, calculateDaysRemaining(goal.deadline));
    const monthsLeft = daysLeft / 30.44; // середня кількість днів в місяці
    return Math.max(0, remaining / monthsLeft);
  };

  // Додавання нової цілі
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGoal.name.trim()) {
      alert('Введіть назву цілі');
      return;
    }

    if (newGoal.target <= 0) {
      alert('Введіть коректну суму цілі');
      return;
    }

    if (!newGoal.deadline) {
      alert('Виберіть дату дедлайну');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: newGoal.target,
      saved: 0,
      currency: newGoal.currency,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: 0, currency: 'UAH', deadline: '' });
  };

  // Додавання збережень до цілі
  const handleAddToGoal = (id: string) => {
    const amount = parseFloat(editAmount);
    if (amount > 0) {
      setGoals(
        goals.map(goal =>
          goal.id === id
            ? { ...goal, saved: Math.min(goal.saved + amount, goal.target) }
            : goal
        )
      );
      setEditingId(null);
      setEditAmount('');
    }
  };

  // Видалення цілі
  const handleDeleteGoal = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю ціль?')) {
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  // Визначення статусу цілі
  const getGoalStatus = (goal: Goal) => {
    if (goal.saved >= goal.target) {
      return { status: 'completed', icon: '✓', label: 'Досягнута!' };
    }

    const daysLeft = calculateDaysRemaining(goal.deadline);
    if (daysLeft < 0) {
      return { status: 'overdue', icon: '⚠️', label: 'Просрочена' };
    }

    if (daysLeft < 7) {
      return { status: 'urgent', icon: '🔥', label: 'Терміново' };
    }

    return { status: 'active', icon: '⏳', label: 'Активна' };
  };

  // Сортування цілей (активні спочатку)
  const sortedGoals = [...goals].sort((a, b) => {
    const statusOrder = { completed: 3, active: 1, urgent: 2, overdue: 0 };
    const aStatus = getGoalStatus(a).status;
    const bStatus = getGoalStatus(b).status;
    return (statusOrder[bStatus as keyof typeof statusOrder] || 0) -
           (statusOrder[aStatus as keyof typeof statusOrder] || 0);
  });

  // Статистика
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const completedGoals = goals.filter(g => g.saved >= g.target).length;

  return (
    <div className="module-container savings-goal">
      <h2 className="module-title">🎯 Мої Цілі Заощаджень</h2>

      {/* Форма додавання нової цілі */}
      <form onSubmit={handleAddGoal} className="goal-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Назва цілі</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="Напр.: Ноутбук, Відпустка..."
              className="form-input"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Сума</label>
            <input
              type="number"
              step="100"
              min="0"
              value={newGoal.target || ''}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })
              }
              placeholder="0"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Дедлайн</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Валюта</label>
            <select
              value={newGoal.currency}
              onChange={(e) => {
                const curr = e.target.value as 'UAH' | 'USD' | 'EUR';
                setNewGoal({
                  ...newGoal,
                  currency: curr,
                });
              }}
              className="form-select"
            >
              <option value="UAH">UAH (грн)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          + Додати нову ціль
        </button>
      </form>

      {/* Статистика */}
      <div className="goals-statistics">
        <div className="stat-card">
          <div className="stat-label">Активних цілей</div>
          <div className="stat-value">{goals.filter(g => g.saved < g.target).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Досягнутих</div>
          <div className="stat-value positive">{completedGoals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Усього заощаджено</div>
          <div className="stat-value positive">{totalSaved.toFixed(0)} грн</div>
        </div>
      </div>

      {/* Список цілей */}
      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <p className="empty-state-text">Немає цілей. Додайте першу ціль!</p>
        </div>
      ) : (
        <div className="goals-list">
          {sortedGoals.map((goal) => {
            const progress = calculateProgress(goal);
            const remaining = calculateRemaining(goal);
            const daysLeft = calculateDaysRemaining(goal.deadline);
            const monthlyNeeded = calculateMonthlyNeeded(goal);
            const goalStatus = getGoalStatus(goal);

            return (
              <div key={goal.id} className={`goal-card goal-${goalStatus.status}`}>
                <div className="goal-header">
                  <div className="goal-title-section">
                    <h3 className="goal-name">{goal.name}</h3>
                    <span className={`goal-status-badge status-${goalStatus.status}`}>
                      {goalStatus.icon} {goalStatus.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="btn-delete-goal"
                    title="Видалити"
                  >
                    ✕
                  </button>
                </div>

                <div className="goal-content">
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill goal-progress-${goalStatus.status}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      <span className="progress-percent">{progress.toFixed(0)}%</span>
                      <span className="progress-amount">
                        {goal.saved.toFixed(0)} / {goal.target.toFixed(0)} {goal.currency}
                      </span>
                    </div>
                  </div>

                  <div className="goal-info-grid">
                    <div className="goal-info-item">
                      <span className="info-label">Залишилось</span>
                      <span className="info-value">{remaining.toFixed(0)} {goal.currency}</span>
                    </div>
                    <div className="goal-info-item">
                      <span className="info-label">Днів до дедлайну</span>
                      <span className={`info-value ${daysLeft < 0 ? 'urgent' : ''}`}>
                        {daysLeft < 0 ? 'Просрочено' : daysLeft + ' днів'}
                      </span>
                    </div>
                    <div className="goal-info-item">
                      <span className="info-label">Щомісячно потрібно</span>
                      <span className="info-value">{monthlyNeeded.toFixed(0)} {goal.currency}</span>
                    </div>
                  </div>

                  {/* Форма додавання до цілі */}
                  <div className="add-to-goal-section">
                    {editingId === goal.id ? (
                      <div className="add-input-group">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          placeholder="Сума"
                          className="form-input add-input"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddToGoal(goal.id)}
                          className="btn btn-sm btn-primary"
                        >
                          Додати
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditAmount('');
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Скасувати
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(goal.id)}
                        className="btn btn-sm btn-primary"
                      >
                        + Додати заощадження
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Порада */}
      {goals.length > 0 && (
        <div className="goal-tip">
          <p className="tip-text">
            💡 <strong>Порада:</strong> Регулярно додавайте заощадження до своїх цілей. 
            Система розраховує, скільки потрібно заощаджувати щомісячно для досягнення цілі вчасно.
          </p>
        </div>
      )}
    </div>
  );
}
