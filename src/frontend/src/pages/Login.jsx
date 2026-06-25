/**
 * @file Login.jsx
 * @description Authentication page for the application.
 * Handles both user login and user registration flows.
 */

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../services/api';
import { WalletCards, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Login Component.
 * Presents a form for authentication or registration.
 * Communicates with AuthContext to establish the user session.
 * 
 * @returns {React.ReactElement} The rendered Login page
 */
export function Login() {
  const { t } = useTranslation();
  const { signIn } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Handles the form submission for both login and registration.
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await api.post('/auth/register', { name, email, password });
        await signIn(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#22272e] p-4 transition-colors duration-300">
      
      {/* Top-Right Theme Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-[#2d333b] text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-accent/10 dark:bg-accent/20 rounded-full blur-[120px] opacity-70 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-70 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-white/80 dark:bg-secondary-dark/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors duration-300">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30 mb-4 transform transition hover:scale-105">
              <WalletCards className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Finance<span className="text-accent">Go</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {isRegistering ? t('login.register_title') : t('login.title')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('login.name')}</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#2d333b] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all"
                  placeholder={t('login.name_placeholder')}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('login.email')}</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#2d333b] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all"
                placeholder={t('login.email_placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{t('login.password')}</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#2d333b] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98] mt-6"
            >
              {isRegistering ? t('login.register_button') : t('login.button')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-white text-sm transition-colors font-medium"
            >
              {isRegistering ? t('login.have_account') + ' ' + t('login.login_link') : t('login.no_account') + ' ' + t('login.register')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
