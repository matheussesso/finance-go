import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { WalletCards } from 'lucide-react'; // Ícone premium

export function Login() {
  const { signIn } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // States do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await api.post('/auth/register', { name, email, password });
        // Se registrar com sucesso, já faz login automaticamente
        await signIn(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro no servidor.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4">
      {/* Background gradient sutil */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] opacity-40 mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30 mb-4 transform transition hover:scale-105">
              <WalletCards className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Finance<span className="text-accent">Go</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              {isRegistering ? 'Crie sua conta para começar' : 'Acesse suas finanças pessoais'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-accent hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98] mt-6"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Registre-se'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
