'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '../context/OnboardingContext';
import { createClient } from '@/lib/supabase/client';

interface LoginFormProps {
  onLoginSuccess?: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { resetOnboarding } = useOnboarding();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const signUpResult = await supabase.auth.signUp({ email, password });

      if (signUpResult.error) {
        if (
          signUpResult.error.status === 400 &&
          signUpResult.error.message.includes('already registered')
        ) {
          const signInResult = await supabase.auth.signInWithPassword({ email, password });
          if (signInResult.error) {
            throw signInResult.error;
          }
          setMessage({
            type: 'success',
            text: 'Login realizado com sucesso! Redirecionando...',
          });
          onLoginSuccess?.(email);
          setTimeout(() => router.replace('/dashboard'), 600);
          return;
        }

        throw signUpResult.error;
      }

      if (signUpResult.data.user) {
        setMessage({
          type: 'success',
          text: 'Conta criada e autenticação realizada. Redirecionando...',
        });
        onLoginSuccess?.(email);
        setTimeout(() => router.replace('/dashboard'), 600);
      } else {
        setMessage({
          type: 'success',
          text: 'Conta criada! Verifique seu email para confirmar o login.',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    resetOnboarding();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-linear-to-b from-indigo-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔐</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Salve seu progresso</h1>
          <p className="text-gray-600">
            Crie ou faça login em sua conta para salvar seu progresso no Salmorize
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition duration-200 ${
              isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isLoading ? 'Entrando...' : 'Fazer Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          type="button"
          className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Continuar sem login
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          Seus dados de progresso serão salvos quando você fizer login
        </p>
      </div>
    </div>
  );
}
