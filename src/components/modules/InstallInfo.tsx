interface InstallInfoProps {
  className?: string;
}

export function InstallInfo({ className = '' }: InstallInfoProps) {
  return (
    <div className={`module-container install-guide ${className}`}>
      <div className="install-content">
          <div className="message info">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>💡 Що таке PWA?</h3>
            <p style={{ margin: 0 }}>
              <strong>Progressive Web App (PWA)</strong> — це веб-додаток, який можна встановити на ваш пристрій як звичайну програму. 
              Він працює швидше, функціонує офлайн та не потребує завантаження з App Store або Google Play.
            </p>
          </div>

          <h2>📥 Як встановити PWA?</h2>

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
        </div>
    </div>
  );
}
