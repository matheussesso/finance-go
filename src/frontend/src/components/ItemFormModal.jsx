/**
 * @file ItemFormModal.jsx
 * @description Modal component used to create new transaction items within blocks.
 */

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';

/**
 * ItemFormModal Component.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function(): void} props.onClose - Callback triggered when closing the modal
 * @param {function(Object): void} props.onSubmit - Callback triggered when submitting the new item
 * @param {string|null} props.defaultDate - Initial date string to pre-fill the form
 * @param {number|null} props.defaultBlockId - Initial block ID to pre-fill the form
 * @param {Array} props.blocks - Array of available blocks to select from
 * @returns {React.ReactElement} The rendered modal component
 */
export function ItemFormModal({ isOpen, onClose, onSubmit, defaultDate, defaultBlockId, blocks = [] }) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [blockId, setBlockId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (defaultDate) {
        // Format to YYYY-MM-DD
        const d = new Date(defaultDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }
      
      if (defaultBlockId) {
        setBlockId(defaultBlockId.toString());
      } else if (blocks.length > 0) {
        setBlockId(blocks[0].id.toString());
      }
      
      setDescription('');
      setAmount('');
    }
  }, [isOpen, defaultDate, defaultBlockId, blocks]);

  /**
   * Handles the form submission for a new item.
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(parseFloat(amount)) || !blockId) return;

    onSubmit({
      block_id: parseInt(blockId),
      description,
      amount: parseFloat(amount),
      due_date: dueDate ? new Date(dueDate).toISOString() : null
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.new_item_title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {(!defaultBlockId && blocks.length > 0) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.target_block')}</label>
            <select 
              value={blockId}
              onChange={e => setBlockId(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-[#22272e] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none cursor-pointer"
            >
              <option value="" disabled>{t('modals.select_block')}</option>
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.title} ({b.type})</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.description')}</label>
          <input 
            type="text" 
            placeholder={t('modals.description_placeholder')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            minLength={2}
            className="w-full bg-gray-50 dark:bg-[#22272e] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.amount')} (R$)</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              placeholder="0,00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-[#22272e] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modals.due_date')}</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#22272e] border border-gray-200 dark:border-white/10 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none transition-colors"
            />
          </div>
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
            disabled={!description.trim() || !amount}
            className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('modals.add')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
