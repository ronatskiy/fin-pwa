/**
 * Компонент Конвертера Валют
 * Вилучено з App.tsx для більш модульної архітектури
 */

import { useState, useEffect } from 'react';
import { InstallInfo } from './InstallInfo';

// Базові курси для резерву (fallback)
const FALLBACK_RATES = {
  UAH: 1,
  USD: 0.025,
  EUR: 0.023,
  PLN: 0.1,
  GBP: 0.02,
};

const CACHE_KEY = 'currency_rates_cache';

export function Converter() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('UAH');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [isOffline, setIsOffline] = useState(false);
  const [swStatus, setSwStatus] = useState<string>('Перевірка...');
  const currencies = Object.keys(rates);

  // Функція для завантаження, кешування та офлайн-логіки
  const fetchAndCacheRates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch('/api/rates.json');
      if (!response.ok) throw new Error('Network response was not ok');

      const freshRates = await response.json();
      setRates(freshRates);
      setIsOffline(false);

      localStorage.setItem(CACHE_KEY, JSON.stringify(freshRates));
      console.log("Курси успішно завантажено та кешовано.");

    } catch (error) {
      console.warn("Мережева помилка. Спроба завантажити з LocalStorage...");
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setRates(JSON.parse(cached));
        setIsOffline(true);
        console.log("Курси завантажено з LocalStorage.");
      } else {
        setRates(FALLBACK_RATES);
        setIsOffline(true);
        console.log("Використовуються резервні (хардкодовані) курси.");
      }
    }
  };

  useEffect(() => {
    fetchAndCacheRates();
  }, []);

  // PWA Service Worker Registration Check
  useEffect(() => {
    const checkSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length > 0) {
            setSwStatus('✅ Service Worker активний (PWA готова до встановлення)');
            console.log("Service Worker активні:", registrations);
          } else {
            // Спробуємо зареєструвати
            const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            setSwStatus('✅ Service Worker активний (PWA готова до встановлення)');
            console.log("Service Worker зареєстрований:", reg);
          }
        } catch (err) {
          setSwStatus('⚠️ Service Worker помилка: ' + (err as Error).message);
          console.error("Service Worker помилка:", err);
        }
      } else {
        setSwStatus('❌ Service Worker не підтримується браузером');
      }
    };

    // Затримка для дозволу браузеру завантажити все
    setTimeout(checkSW, 1000);
  }, []);

  // Логіка конвертації
  useEffect(() => {
    if (rates && amount > 0) {
      const amountUAH = amount / rates[fromCurrency as keyof typeof rates];
      const result = amountUAH * rates[toCurrency as keyof typeof rates];
      setConvertedAmount(result.toFixed(2));
    } else {
      setConvertedAmount('');
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  return (
    <div className="module-container converter-module">
      <div className="sw-status">
        {swStatus}
      </div>
      
      {isOffline && (
        <div className="offline-warning">
          ⚠️ Офлайн-режим. Конвертація виконується на основі кешованих або резервних курсів.
        </div>
      )}

      <div className="form-group">
        <label className="label">Сума</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Введіть суму"
          className="input"
        />
      </div>

      <div className="currency-section">
        <div className="currency-group">
          <label className="label">З валюти</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="select"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="arrow">→</div>

        <div className="currency-group">
          <label className="label">На валюту</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="select"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="result">
        <h2 className="result-title">Результат</h2>
        <p className="result-amount">
          {convertedAmount || '...'} {toCurrency}
        </p>
        <p className="result-info">
          {amount} {fromCurrency} = {convertedAmount || '...'} {toCurrency}
        </p>
      </div>

      <InstallInfo />
    </div>
  );
}
