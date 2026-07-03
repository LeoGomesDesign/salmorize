'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user?.email) {
        router.replace('/onboarding');
        return;
      }

      setUserEmail(data.user.email);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6 flex items-center justify-center">
        <p className="text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h1>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Email conectado:</p>
            <p className="font-semibold text-gray-900">{userEmail}</p>
          </div>

          <p className="text-gray-600 mb-8">
            Seu progresso de onboarding foi salvo com sucesso. Agora você pode começar a memorizar os Salmos!
          </p>

          <div className="space-y-3 mb-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
              Começar a aprender
            </button>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200">
              Ver meu progresso
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full border-2 border-red-300 hover:border-red-400 text-red-600 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
