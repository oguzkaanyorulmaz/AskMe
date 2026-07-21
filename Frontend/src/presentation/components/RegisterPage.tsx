import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
    onSuccess: () => void;
    onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onGoToLogin }) => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [nameSurname, setNameSurname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const success = await register(username, email, password, nameSurname);
            if (success) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Kayıt başarısız. Bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6 bg-white border border-gray-100 rounded-3xl shadow-xl space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">AskMe'ye Kayıt Ol</h2>
                <p className="text-gray-400 text-xs mt-1">Aramıza katılmak için formu doldur.</p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Kullanıcı Adı</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="kullanıcı_adı"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">E-posta Adresi</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="isim@adres.com"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Ad Soyad</label>
                    <input
                        type="text"
                        required
                        value={nameSurname}
                        onChange={(e) => setNameSurname(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="Ahmet Yılmaz"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1 tracking-wider uppercase">Şifre</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-semibold text-sm"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-55"
                >
                    {loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
                </button>
            </form>

            <hr className="border-gray-100" />

            <div className="text-center pt-2">
                <button
                    onClick={onGoToLogin}
                    className="px-6 h-10 border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                    Zaten hesabın var mı? Giriş Yap
                </button>
            </div>
        </div>
    );
};
