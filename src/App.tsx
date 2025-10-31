import { useState } from 'react';
import './App.css';
import { Navigation } from './components/Navigation';
import { Converter } from './components/modules/Converter';
import { ExpenseTracker } from './components/modules/ExpenseTracker';
import { BudgetPlanner } from './components/modules/BudgetPlanner';
import { SavingsGoal } from './components/modules/SavingsGoal';

type Tab = 'converter' | 'expenses' | 'budget' | 'goals';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('converter');

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">💡 Фінансова Грамотність</h1>
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="module-wrapper">
          {activeTab === 'converter' && <Converter />}
          {activeTab === 'expenses' && <ExpenseTracker />}
          {activeTab === 'budget' && <BudgetPlanner />}
          {activeTab === 'goals' && <SavingsGoal />}
        </div>
      </div>
    </div>
  );
}

export default App;
