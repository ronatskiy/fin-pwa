import { useState } from 'react';

interface InstallInfoProps {
  className?: string;
}

export function InstallInfo({ className = '' }: InstallInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`collapsible-info ${className}`}>
      <button 
        className="collapsible-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="toggle-icon">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="header-text">💡 Як встановити PWA</span>
      </button>
      
      {isExpanded && (
        <div className="collapsible-content">
          <div className="install-case">
            <h3>📱 Варіант 1: Через меню браузера (Chrome/Edge)</h3>
            <ol>
              <li>Натисніть меню <strong>(⋮)</strong> у правому верхньому кутку</li>
              <li>Виберіть <strong>"Встановити додаток"</strong> або <strong>"Cast, Save and Share"</strong> → <strong>"Встановити додаток"</strong></li>
              <li>Підтвердіть встановлення</li>
              <li>Додаток з'явиться в меню <strong>Пуск</strong> (Windows) або <strong>Програми</strong> (Mac)</li>
            </ol>
          </div>

          <div className="install-case">
            <h3>📱 Варіант 2: На Android</h3>
            <ol>
              <li>Відкрийте цю сторінку у Chrome на Android</li>
              <li>Натисніть меню <strong>(⋮)</strong></li>
              <li>Виберіть <strong>"Встановити додаток"</strong> або <strong>"Add to Home screen"</strong></li>
              <li>Назвіть додаток (за необхідності) та натисніть <strong>"Додати"</strong></li>
              <li>Пінаграма з'явиться на вашому головному екрані</li>
            </ol>
          </div>

          <div className="install-case">
            <h3>🍎 Варіант 3: На iOS (Safari)</h3>
            <ol>
              <li>Відкрийте цю сторінку у Safari на iPhone/iPad</li>
              <li>Натисніть кнопку <strong>"Поділ"</strong> (поділитись)</li>
              <li>Прокрутіть вниз та виберіть <strong>"На початковий екран"</strong></li>
              <li>Назвіть додаток та натисніть <strong>"Додати"</strong></li>
              <li>Додаток буде встановлено як веб-клік на вашому домашньому екрані</li>
            </ol>
          </div>

          <div className="install-benefits">
            <h3>✨ Переваги встановлення PWA</h3>
            <ul>
              <li>⚡ Швидкий запуск без браузера</li>
              <li>📵 Повна офлайн-функціональність</li>
              <li>💾 Економія місця на диску</li>
              <li>🔄 Автоматичні оновлення</li>
              <li>🔔 Підтримка повідомлень (на деяких платформах)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
