/**
 * Компонент навігації з табами для модулів
 */

interface NavigationProps {
  activeTab: 'converter' | 'expenses' | 'budget' | 'goals' | 'help';
  onTabChange: (tab: 'converter' | 'expenses' | 'budget' | 'goals' | 'help') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'expenses' as const, label: 'Витрати', icon: '💰' },
    { id: 'budget' as const, label: 'Бюджет', icon: '📊' },
    { id: 'goals' as const, label: 'Цілі', icon: '🎯' },
    { id: 'converter' as const, label: 'Конвертер', icon: '💱' },
    { id: 'help' as const, label: 'Допомога', icon: '❓' },
  ];

  return (
    <nav className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          title={tab.label}
        >
          {tab.icon}
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
