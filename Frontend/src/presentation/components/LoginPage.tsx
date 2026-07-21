import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onSuccess: () => void;
    onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToRegister }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const success = await login(username, password);
        if (success) {
            onSuccess();
        } else {
            setError('Geçersiz kullanıcı adı veya şifre.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6 bg-white border border-gray-100 rounded-3xl shadow-xl space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">AskMe'ye Giriş Yap</h2>
                <p className="text-gray-400 text-xs mt-1">Hesabına erişmek için bilgilerini gir.</p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Kullanıcı Adı</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 h-11 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="kullanıcı_adı"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Şifre</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 h-11 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-55"
                >
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>

            <hr className="border-gray-100" />

            <div className="text-center pt-2">
                <button
                    onClick={onGoToRegister}
                    className="px-6 h-10 border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                    Yeni hesap oluştur
                </button>
            </div>
        </div>
    );
};
