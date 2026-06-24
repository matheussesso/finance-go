import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../services/api';
import { LogOut, Plus, Trash2, CheckCircle, Circle, Sun, Moon, TrendingUp, TrendingDown, DollarSign, LayoutDashboard, Calendar } from 'lucide-react';
import { PlanningSelector } from '../components/PlanningSelector';
import { CalendarView } from '../components/CalendarView';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [plannings, setPlannings] = useState([]);
  const [currentPlanning, setCurrentPlanning] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // 'board' ou 'calendar'

  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockType, setNewBlockType] = useState('despesa');

  // Atualiza os blocos sempre que o planejamento selecionado muda
  useEffect(() => {
    if (currentPlanning) {
      loadPlanningDetails();
    }
  }, [currentPlanning?.id]);

  async function loadPlanningDetails() {
    try {
      const response = await api.get(`/plannings/${currentPlanning.id}`);
      setCurrentPlanning(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateBlock(e) {
    e.preventDefault();
    if (!newBlockTitle || !currentPlanning) return;

    await api.post('/blocks', { 
      planning_id: currentPlanning.id,
      title: newBlockTitle, 
      type: newBlockType 
    });
    setNewBlockTitle('');
    loadPlanningDetails();
  }

  async function handleDeleteBlock(id) {
    if (confirm("Tem certeza que deseja excluir todo o bloco e seus itens?")) {
      await api.delete(`/blocks/${id}`);
      loadPlanningDetails();
    }
  }

  async function handleCreateItem(e, blockId, specificDate = null) {
    e?.preventDefault();
    
    let desc, amount, dueDate;

    if (e) {
      const form = e.target;
      desc = form.description.value;
      amount = parseFloat(form.amount.value);
      dueDate = form.due_date?.value;
    } else {
      desc = prompt("Descrição do item:");
      amount = parseFloat(prompt("Valor:"));
      if (specificDate) {
        dueDate = new Date(currentPlanning.year, currentPlanning.month - 1, specificDate).toISOString();
      }
    }

    if (!desc || isNaN(amount)) return;

    await api.post('/items', {
      block_id: blockId,
      description: desc,
      amount: amount,
      is_paid: false,
      due_date: dueDate || null
    });
    
    if (e) e.target.reset();
    loadPlanningDetails();
  }

  async function handleDeleteItem(blockId, itemId) {
    await api.delete(`/blocks/${blockId}/items/${itemId}`);
    loadPlanningDetails();
  }

  const handleCalendarCreateClick = (day) => {
    // Escolher um bloco para vincular o item rápido do calendário
    if (!currentPlanning.blocks || currentPlanning.blocks.length === 0) {
      alert("Crie um bloco primeiro!");
      return;
    }
    const blockId = prompt("Digite o ID do Bloco (Em um sistema real isso seria um modal com select):\n" + currentPlanning.blocks.map(b => `${b.id} - ${b.title}`).join('\n'));
    if (blockId) {
      handleCreateItem(null, parseInt(blockId), day);
    }
  }

  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + item.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] pb-20 transition-colors duration-300">
      
      {/* Header Premium */}
      <header className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#0F0F13]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <DollarSign className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">FinanceGo</h1>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            <PlanningSelector 
              currentPlanning={currentPlanning}
              setCurrentPlanning={setCurrentPlanning}
              plannings={plannings}
              setPlannings={setPlannings}
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'board' ? 'bg-white dark:bg-[#141416] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
              >
                <LayoutDashboard size={18} /> <span className="hidden sm:block text-sm font-medium pr-1">Board</span>
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-[#141416] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
              >
                <Calendar size={18} /> <span className="hidden sm:block text-sm font-medium pr-1">Calendar</span>
              </button>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
              Olá, <strong className="text-gray-900 dark:text-white font-semibold">{user?.name?.split(' ')[0]}</strong>
            </span>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {viewMode === 'calendar' ? (
          <CalendarView currentPlanning={currentPlanning} onCreateItemClick={handleCalendarCreateClick} />
        ) : (
          <>
            {/* Sessão de Criação Rápida */}
        <section className="mb-12 bg-white dark:bg-secondary-dark/30 border border-gray-200 dark:border-white/5 p-6 rounded-3xl shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Plus className="text-accent w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Bloco de Finanças</h2>
          </div>
          
          <form onSubmit={handleCreateBlock} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Ex: Contas da Casa, Cartão Nubank..." 
              value={newBlockTitle}
              onChange={e => setNewBlockTitle(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 focus:bg-white dark:focus:bg-transparent outline-none transition-all"
            />
            <select 
              value={newBlockType}
              onChange={e => setNewBlockType(e.target.value)}
              className="bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none cursor-pointer"
            >
              <option value="despesa">Saída (Despesa)</option>
              <option value="receita">Entrada (Receita)</option>
            </select>
            <button 
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-accent/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Criar Bloco
            </button>
          </form>
        </section>

        {/* Grid de Blocos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(!currentPlanning?.blocks || currentPlanning.blocks.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <DollarSign size={48} className="mb-4 opacity-20" />
              <p>Nenhum bloco financeiro criado neste planejamento.</p>
              <p className="text-sm mt-1">Crie seu primeiro bloco acima para começar a organizar.</p>
            </div>
          )}

          {currentPlanning?.blocks?.map(block => (
            <div key={block.id} className="bg-white dark:bg-secondary-dark/20 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 dark:hover:border-white/10 hover:shadow-md dark:hover:shadow-none transition-all flex flex-col group/card relative">
              
              {/* Header do Bloco */}
              <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#141416]/50 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${block.type === 'receita' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {block.type === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{block.title}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{block.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteBlock(block.id)} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover/card:opacity-100"
                  title="Excluir bloco"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Lista de Itens */}
              <div className="p-5 flex-1 flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {(!block.items || block.items.length === 0) ? (
                  <p className="text-gray-400 dark:text-gray-600 text-sm text-center py-6">Adicione seu primeiro item abaixo</p>
                ) : (
                  block.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-300 dark:text-gray-600 hover:text-accent transition-colors">
                          <Circle size={14} strokeWidth={3} />
                        </button>
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{item.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="text-gray-900 dark:text-white font-semibold text-sm">
                          R$ {item.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        </strong>
                        <button 
                          onClick={() => handleDeleteItem(block.id, item.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario de Adicionar Item */}
              <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#141416]/20">
                <form onSubmit={(e) => handleCreateItem(e, block.id)} className="flex flex-col gap-2 relative">
                  <div className="flex gap-2">
                    <input name="description" placeholder="Ex: Conta de Luz" className="flex-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none" required />
                    <input name="amount" type="number" step="0.01" placeholder="R$ 0,00" className="w-24 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none" required />
                  </div>
                  <div className="flex gap-2">
                    <input name="due_date" type="date" className="flex-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/50 outline-none" />
                    <button type="submit" className="w-24 flex items-center justify-center bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Rodapé Total */}
              <div className={`p-5 border-t border-gray-100 dark:border-white/5 flex justify-between items-center ${block.type === 'receita' ? 'bg-emerald-50 dark:bg-emerald-500/5' : 'bg-rose-50 dark:bg-rose-500/5'}`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${block.type === 'receita' ? 'text-emerald-700 dark:text-emerald-500' : 'text-rose-700 dark:text-rose-500'}`}>
                  Total
                </span>
                <span className={`text-xl font-black ${block.type === 'receita' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                  R$ {calculateTotal(block.items).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
              </div>
            </div>
          ))}
        </div>
          </>
        )}
      </main>
    </div>
  );
}
