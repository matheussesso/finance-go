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
    <select 
      value={i18n.language?.substring(0, 2) || 'pt'} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-semibold px-2 py-1.5 rounded-md outline-none cursor-pointer border border-transparent hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
    >
      <option value="pt">PT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}
