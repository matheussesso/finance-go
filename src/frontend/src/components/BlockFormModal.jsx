import { useState } from 'react';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';

export function BlockFormModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('despesa');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({ title, type });
    setTitle('');
    setType('despesa');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.new_block_title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.block_name')}</label>
          <input 
            type="text" 
            placeholder={t('modals.block_name_placeholder')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={3}
            className="w-full bg-gray-50 dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.block_type')}</label>
          <select 
            value={type}
            onChange={e => setType(e.target.value)}
            required
            className="w-full bg-gray-50 dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none cursor-pointer"
          >
            <option value="despesa">{t('modals.type_expense')}</option>
            <option value="receita">{t('modals.type_revenue')}</option>
          </select>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
          >
            {t('modals.cancel')}
          </button>
          <button 
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('modals.create')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
