/**
 * @file Dashboard.jsx
 * @description Main application dashboard page.
 * Displays financial blocks, items, a calendar view, and summary widgets.
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../services/api';
import { LogOut, Plus, Trash2, Circle, Sun, Moon, TrendingUp, TrendingDown, DollarSign, Menu } from 'lucide-react';
import { PlanningSelector } from '../components/PlanningSelector';
import { CalendarView } from '../components/CalendarView';
import { BlockFormModal } from '../components/BlockFormModal';
import { ItemFormModal } from '../components/ItemFormModal';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';

/**
 * Dashboard Component.
 * Fetches and displays data related to the selected Planning (blocks, items).
 * 
 * @returns {React.ReactElement} The rendered Dashboard page
 */
export function Dashboard() {
  const { t } = useTranslation();
  const { user, signOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [plannings, setPlannings] = useState([]);
  const [currentPlanning, setCurrentPlanning] = useState(null);

  // Modal states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalConfig, setItemModalConfig] = useState({ defaultDate: null, defaultBlockId: null });

  // Update blocks whenever the selected planning changes
  useEffect(() => {
    if (currentPlanning) {
      loadPlanningDetails();
    }
  }, [currentPlanning?.id]);

  /**
   * Fetches detailed information for the currently selected planning.
   */
  async function loadPlanningDetails() {
    try {
      const response = await api.get(`/plannings/${currentPlanning.id}`);
      setCurrentPlanning(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Creates a new financial block.
   * 
   * @param {Object} data - Block data
   * @param {string} data.title - Title of the block
   * @param {string} data.type - Type of the block ('receita' or 'despesa')
   */
  async function handleCreateBlock({ title, type }) {
    if (!currentPlanning) return;

    await api.post('/blocks', { 
      planning_id: currentPlanning.id,
      title: title, 
      type: type 
    });
    setIsBlockModalOpen(false);
    loadPlanningDetails();
  }

  /**
   * Deletes a financial block.
   * 
   * @param {number} id - The ID of the block to delete
   */
  async function handleDeleteBlock(id) {
    if (window.confirm(t('block.delete_confirm'))) {
      await api.delete(`/blocks/${id}`);
      loadPlanningDetails();
    }
  }

  /**
   * Creates a new item within a block.
   * 
   * @param {Object} itemData - Item data
   * @param {number} itemData.block_id - ID of the parent block
   * @param {string} itemData.description - Description of the item
   * @param {number} itemData.amount - Value of the item
   * @param {string|null} itemData.due_date - ISO formatted date string
   */
  async function handleCreateItem(itemData) {
    await api.post('/items', {
      block_id: itemData.block_id,
      description: itemData.description,
      amount: itemData.amount,
      is_paid: false,
      due_date: itemData.due_date
    });
    
    setIsItemModalOpen(false);
    loadPlanningDetails();
  }

  /**
   * Deletes an item from a block.
   * 
   * @param {number} blockId - ID of the parent block
   * @param {number} itemId - ID of the item to delete
   */
  async function handleDeleteItem(blockId, itemId) {
    await api.delete(`/blocks/${blockId}/items/${itemId}`);
    loadPlanningDetails();
  }

  /**
   * Handles clicking on a specific day in the calendar to add an item.
   * 
   * @param {number} day - The day of the month clicked
   */
  const handleCalendarCreateClick = (day) => {
    if (!currentPlanning?.blocks || currentPlanning.blocks.length === 0) {
      alert("Create a block first!");
      return;
    }
    setItemModalConfig({
      defaultDate: new Date(currentPlanning.year, currentPlanning.month - 1, day).toISOString(),
      defaultBlockId: null
    });
    setIsItemModalOpen(true);
  }

  /**
   * Opens the item modal pre-selected for a specific block.
   * 
   * @param {number} blockId - The ID of the block
   */
  const handleOpenItemModalForBlock = (blockId) => {
    setItemModalConfig({
      defaultDate: null,
      defaultBlockId: blockId
    });
    setIsItemModalOpen(true);
  };

  /**
   * Calculates the total amount for an array of items.
   * 
   * @param {Array} items - List of items
   * @returns {number} The calculated total
   */
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + item.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#22272e] pb-20 transition-colors duration-300 font-sans">
      
      {/* Premium Header */}
      <header className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#22272e]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[4rem] py-2 sm:py-0 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <button 
                className="p-1.5 -ml-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                title={t('dashboard.menu') || 'Menu'}
              >
                <Menu size={20} />
              </button>
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center shadow-md shadow-accent/20">
                <DollarSign className="text-white w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">FinanceGo</h1>
            </div>

            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            <PlanningSelector 
              currentPlanning={currentPlanning}
              setCurrentPlanning={setCurrentPlanning}
              plannings={plannings}
              setPlannings={setPlannings}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
              {t('dashboard.welcome')}, <strong className="text-gray-900 dark:text-white font-semibold">{user?.name?.split(' ')[0]}</strong>
            </span>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-md px-2 py-1 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium hidden sm:block">{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        
        {/* Dashboard Layout (Calendar on Right, Blocks on Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Content: Blocks (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="flex items-center justify-between bg-white dark:bg-secondary-dark/30 border border-gray-200 dark:border-white/5 p-4 rounded-md shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                  <DollarSign className="text-accent w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-md font-bold text-gray-900 dark:text-white">{t('dashboard.balance')}</h2>
                </div>
              </div>
              <button 
                onClick={() => setIsBlockModalOpen(true)}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm shadow-accent/20 flex items-center gap-2"
              >
                <Plus size={16} /> <span className="hidden sm:block">{t('dashboard.new_block')}</span>
              </button>
            </div>

            {/* Internal Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(!currentPlanning?.blocks || currentPlanning.blocks.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-secondary-dark/20 rounded-md border border-gray-200 dark:border-white/5 border-dashed">
                  <DollarSign size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">{t('dashboard.no_blocks')}</p>
                  <button onClick={() => setIsBlockModalOpen(true)} className="text-accent text-sm mt-2 hover:underline">{t('dashboard.new_block')}</button>
                </div>
              )}

              {currentPlanning?.blocks?.map(block => (
                <div key={block.id} className="bg-white dark:bg-secondary-dark/30 border border-gray-200 dark:border-white/5 rounded-md overflow-hidden hover:border-accent/30 dark:hover:border-white/10 shadow-sm transition-all flex flex-col group/card relative">
                  
                  {/* Block Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${block.type === 'receita' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                        {block.type === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{block.title}</h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteBlock(block.id)} 
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover/card:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                    {(!block.items || block.items.length === 0) ? (
                      <p className="text-gray-400 dark:text-gray-600 text-xs text-center py-4"></p>
                    ) : (
                      block.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between group p-1.5 -mx-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <button className="text-gray-300 dark:text-gray-600 hover:text-accent transition-colors flex-shrink-0">
                              <Circle size={12} strokeWidth={3} />
                            </button>
                            <span className="text-gray-700 dark:text-gray-300 text-xs font-medium truncate" title={item.description}>{item.description}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <strong className="text-gray-900 dark:text-white font-semibold text-xs">
                              R$ {item.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </strong>
                            <button 
                              onClick={() => handleDeleteItem(block.id, item.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <div className="px-4 pb-3 pt-1 bg-white dark:bg-transparent">
                    <button 
                      onClick={() => handleOpenItemModalForBlock(block.id)}
                      className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent border border-dashed border-gray-200 dark:border-white/10 hover:border-accent/50 dark:hover:border-accent/50 rounded-md transition-colors"
                    >
                      <Plus size={14} /> {t('block.add_item')}
                    </button>
                  </div>

                  {/* Total Footer */}
                  <div className={`p-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center ${block.type === 'receita' ? 'bg-emerald-50 dark:bg-emerald-500/5' : 'bg-rose-50 dark:bg-rose-500/5'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${block.type === 'receita' ? 'text-emerald-700 dark:text-emerald-500' : 'text-rose-700 dark:text-rose-500'}`}>
                      Total
                    </span>
                    <span className={`text-lg font-black ${block.type === 'receita' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                      R$ {calculateTotal(block.items).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Sidebar: Calendar (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CalendarView currentPlanning={currentPlanning} onCreateItemClick={handleCalendarCreateClick} />
            
            {/* Summary Widget */}
            <div className="bg-white dark:bg-secondary-dark/30 border border-gray-200 dark:border-white/5 p-5 rounded-md shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.summary')}</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('dashboard.revenue')}</span>
                  <span className="font-bold text-sm">
                    R$ {currentPlanning?.blocks?.filter(b => b.type === 'receita').reduce((sum, b) => sum + calculateTotal(b.items), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('dashboard.expense')}</span>
                  <span className="font-bold text-sm">
                    R$ {currentPlanning?.blocks?.filter(b => b.type === 'despesa').reduce((sum, b) => sum + calculateTotal(b.items), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Modals */}
      <BlockFormModal 
        isOpen={isBlockModalOpen} 
        onClose={() => setIsBlockModalOpen(false)} 
        onSubmit={handleCreateBlock} 
      />

      <ItemFormModal 
        isOpen={isItemModalOpen} 
        onClose={() => setIsItemModalOpen(false)} 
        onSubmit={handleCreateItem}
        defaultDate={itemModalConfig.defaultDate}
        defaultBlockId={itemModalConfig.defaultBlockId}
        blocks={currentPlanning?.blocks || []}
      />

    </div>
  );
}
