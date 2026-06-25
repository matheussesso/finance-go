import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ChevronDown, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PlanningSelector({ currentPlanning, setCurrentPlanning, plannings, setPlannings }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadPlannings();
  }, []);

  async function loadPlannings() {
    try {
      const res = await api.get('/plannings');
      setPlannings(res.data.data);
      if (res.data.data.length > 0 && !currentPlanning) {
        setCurrentPlanning(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateNew() {
    const title = prompt(t('planning.prompt_name'));
    if (!title) return;
    
    try {
      const now = new Date();
      const res = await api.post('/plannings', {
        title,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      const newPlan = res.data.data;
      setPlannings(prev => [newPlan, ...prev]);
      setCurrentPlanning(newPlan);
      setIsOpen(false);
    } catch (err) {
      alert(t('errors.generic'));
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm">
          {currentPlanning ? currentPlanning.title : t('dashboard.loading')}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#141416] border border-gray-200 dark:border-white/5 shadow-xl rounded-2xl overflow-hidden z-50">
          <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
            {plannings.map(plan => (
              <button
                key={plan.id}
                onClick={() => { setCurrentPlanning(plan); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPlanning?.id === plan.id 
                  ? 'bg-accent/10 text-accent dark:text-accent-hover' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {plan.title}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-gray-100 dark:border-white/5">
            <button 
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-accent hover:bg-accent/5 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} /> {t('planning.create_new')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
