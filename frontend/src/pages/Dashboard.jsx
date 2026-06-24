import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { LogOut, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const [blocks, setBlocks] = useState([]);
  
  // Form states para criação
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockType, setNewBlockType] = useState('despesa');

  useEffect(() => {
    loadBlocks();
  }, []);

  async function loadBlocks() {
    try {
      const response = await api.get('/blocks');
      setBlocks(response.data.data); // data é do Axios, o segundo data é o nosso StandardResponse do Go
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateBlock(e) {
    e.preventDefault();
    if (!newBlockTitle) return;

    await api.post('/blocks', { title: newBlockTitle, type: newBlockType });
    setNewBlockTitle('');
    loadBlocks();
  }

  async function handleDeleteBlock(id) {
    if (confirm("Tem certeza que deseja excluir todo o bloco e seus itens?")) {
      await api.delete(`/blocks/${id}`);
      loadBlocks();
    }
  }

  async function handleCreateItem(e, blockId) {
    e.preventDefault();
    const form = e.target;
    const desc = form.description.value;
    const amount = parseFloat(form.amount.value);

    if (!desc || isNaN(amount)) return;

    await api.post('/items', {
      block_id: blockId,
      description: desc,
      amount: amount,
      is_paid: false
    });
    
    form.reset();
    loadBlocks();
  }

  async function handleDeleteItem(blockId, itemId) {
    await api.delete(`/blocks/${blockId}/items/${itemId}`);
    loadBlocks();
  }

  // Função helper para calcular o total do bloco
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + item.amount, 0);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-20">
      {/* Header Premium */}
      <header className="border-b border-white/5 bg-[#0F0F13]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-bold">F</span>
            </div>
            <h1 className="text-xl font-semibold text-white">FinanceGo</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-sm hidden sm:block">
              Bem-vindo, <strong className="text-white font-medium">{user?.name}</strong>
            </span>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* Sessão de Criação Rápida */}
        <section className="mb-12 bg-secondary/30 border border-white/5 p-6 rounded-3xl">
          <h2 className="text-lg font-medium text-white mb-4">Novo Bloco de Finanças</h2>
          <form onSubmit={handleCreateBlock} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Ex: Contas da Casa, Cartão Nubank..." 
              value={newBlockTitle}
              onChange={e => setNewBlockTitle(e.target.value)}
              className="flex-1 bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-accent/50 outline-none transition-all"
            />
            <select 
              value={newBlockType}
              onChange={e => setNewBlockType(e.target.value)}
              className="bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-accent/50 outline-none"
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            <button 
              type="submit"
              className="bg-accent hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-accent/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Criar
            </button>
          </form>
        </section>

        {/* Grid de Blocos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              Nenhum bloco financeiro criado ainda.
            </div>
          )}

          {blocks.map(block => (
            <div key={block.id} className="bg-secondary/20 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors flex flex-col">
              
              {/* Header do Bloco */}
              <div className="p-5 border-b border-white/5 bg-[#141416]/50 flex justify-between items-center group">
                <div>
                  <h3 className="font-semibold text-white text-lg">{block.title}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{block.type}</span>
                </div>
                <button onClick={() => handleDeleteBlock(block.id)} className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Lista de Itens */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                {(!block.items || block.items.length === 0) ? (
                  <p className="text-gray-600 text-sm italic text-center py-4">Vazio</p>
                ) : (
                  block.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-accent transition-colors">
                          <Circle size={16} />
                        </button>
                        <span className="text-gray-300 text-sm">{item.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="text-white font-medium text-sm">
                          R$ {item.amount.toFixed(2)}
                        </strong>
                        <button 
                          onClick={() => handleDeleteItem(block.id, item.id)}
                          className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario de Adicionar Item */}
              <div className="p-4 border-t border-white/5 bg-[#141416]/20">
                <form onSubmit={(e) => handleCreateItem(e, block.id)} className="flex gap-2">
                  <input name="description" placeholder="Ex: Conta de Luz" className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-accent outline-none" required />
                  <input name="amount" type="number" step="0.01" placeholder="Valor" className="w-24 bg-[#0A0A0B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-accent outline-none" required />
                  <button type="submit" className="bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-2 transition-colors">
                    <Plus size={16} />
                  </button>
                </form>
              </div>

              {/* Rodapé Total */}
              <div className="p-5 border-t border-white/5 bg-accent/5 flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Total</span>
                <span className="text-xl font-bold text-white">
                  R$ {calculateTotal(block.items).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
