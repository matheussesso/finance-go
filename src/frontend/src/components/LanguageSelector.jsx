/**
 * @file LanguageSelector.jsx
 * @description Widget for switching the application's locale using i18next.
 */

import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

/**
 * LanguageSelector Component.
 * Changes the active language state globally and updates API interceptor headers.
 * 
 * @returns {React.ReactElement} Rendered button group for language selection
 */
export function LanguageSelector() {
  const { i18n } = useTranslation();

  /**
   * Modifies the global language context.
   * 
   * @param {string} lng - Language code (e.g., 'en', 'pt', 'es')
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: Update the base axios header instantly (already done via interceptor, but good to guarantee on the active instance)
    api.defaults.headers.common['Accept-Language'] = lng;
  };

  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-md">
      <button 
        onClick={() => changeLanguage('pt')} 
        className={`px-2 py-1 text-xs font-semibold rounded-sm transition-colors ${i18n.language?.startsWith('pt') ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
      >
        PT
      </button>
      <button 
        onClick={() => changeLanguage('en')} 
        className={`px-2 py-1 text-xs font-semibold rounded-sm transition-colors ${i18n.language?.startsWith('en') ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('es')} 
        className={`px-2 py-1 text-xs font-semibold rounded-sm transition-colors ${i18n.language?.startsWith('es') ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
      >
        ES
      </button>
    </div>
  );
}
