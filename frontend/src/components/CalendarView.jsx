import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function CalendarView({ currentPlanning, onCreateItemClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentPlanning) {
      setCurrentDate(new Date(currentPlanning.year, currentPlanning.month - 1, 1));
    }
  }, [currentPlanning]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Gera array de dias
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Mapeia itens por dia
  const itemsByDay = {};
  if (currentPlanning && currentPlanning.blocks) {
    currentPlanning.blocks.forEach(block => {
      if (block.items) {
        block.items.forEach(item => {
          if (item.due_date) {
            const date = new Date(item.due_date);
            if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
              const day = date.getDate();
              if (!itemsByDay[day]) itemsByDay[day] = [];
              itemsByDay[day].push({ ...item, blockType: block.type, blockTitle: block.title });
            }
          }
        });
      }
    });
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="bg-white dark:bg-secondary-dark/30 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#141416]/50">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {blanks.map(b => (
          <div key={`blank-${b}`} className="border-r border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-transparent"></div>
        ))}
        {days.map(day => (
          <div 
            key={day} 
            className="border-r border-b border-gray-100 dark:border-white/5 p-2 relative group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{day}</span>
            
            <button 
              onClick={() => onCreateItemClick(day)}
              className="absolute top-2 right-2 p-1 bg-accent text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus size={12} />
            </button>

            <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
              {itemsByDay[day]?.map((item, idx) => (
                <div 
                  key={idx} 
                  title={`${item.description} - R$ ${item.amount}`}
                  className={`text-[10px] px-2 py-1 rounded-md truncate font-medium ${
                    item.blockType === 'receita' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' 
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                  }`}
                >
                  {item.description}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
