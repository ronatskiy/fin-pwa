import { useState } from 'react';
import './App.css';
import { Navigation } from './components/Navigation';
import { Converter } from './components/modules/Converter';
import { ExpenseTracker } from './components/modules/ExpenseTracker';
import { BudgetPlanner } from './components/modules/BudgetPlanner';
import { SavingsGoal } from './components/modules/SavingsGoal';
import { InstallInfo } from './components/modules/InstallInfo';

type Tab = 'converter' | 'expenses' | 'budget' | 'goals' | 'help';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">💡 Фінансова Грамотність</h1>
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="module-wrapper">
          {activeTab === 'expenses' && <ExpenseTracker />}
          {activeTab === 'budget' && <BudgetPlanner />}
          {activeTab === 'goals' && <SavingsGoal />}
          {activeTab === 'converter' && <Converter />}
          {activeTab === 'help' && <InstallInfo />}
        </div>
      </div>
    </div>
  );
}

export default App;
