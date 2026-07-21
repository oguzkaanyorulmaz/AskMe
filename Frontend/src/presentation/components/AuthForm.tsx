import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
    onSuccess: () => void;
    currentTab: string; // 'login' veya 'register' (App.tsx'ten gelen)
    onTabChange: (tab: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, currentTab, onTabChange }) => {
    const { login, register } = useAuth();
    const isRegister = currentTab === 'register';

    // Form Durumları
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [nameSurname, setNameSurname] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Tab değiştiğinde hata mesajını temizle
    useEffect(() => {
        setError(null);
    }, [currentTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                // Kayıt İşlemi
                const registerSuccess = await register(username, email, password, nameSurname);
                if (registerSuccess) {
                    // Kayıt başarılıysa otomatik giriş yap
                    const loginSuccess = await login(username, password);
                    if (loginSuccess) {
                        onSuccess();
                    } else {
                        setError('Kayıt başarılı, ancak otomatik giriş yapılamadı. Lütfen manuel giriş yapın.');
                    }
                } else {
                    setError('Kayıt başarısız. Kullanıcı adı veya e-posta kullanımda olabilir.');
                }
            } else {
                // Giriş İşlemi
                const loginSuccess = await login(username, password);
                if (loginSuccess) {
                    onSuccess();
                } else {
                    setError('Geçersiz kullanıcı adı veya şifre.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center space-y-8 text-white">

            {/* ÜST KISIM: Logo ve Dikey Başlık Animasyonu (Slot-machine stili) */}
            <div className="text-center flex flex-col items-center w-full">
                {/* Turuncu Yuvarlak Kutu (İçinde Beyaz Soru İşareti) */}
                <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg font-logo font-black text-2xl text-white select-none">
                    ?
                </div>
                <span className="font-logo text-2xl font-black tracking-tight text-white mt-3 select-none">
                    ask?me
                </span>

                {/* Dikeyde Kayarak Değişen Başlık Alanı */}
                <div className="relative h-16 w-full overflow-hidden mt-6">
                    {/* Giriş Yapın Başlığı */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out transform ${isRegister ? '-translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
                        }`}>
                        <span className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">HOŞ GELDİNİZ</span>
                        <h1 className="text-3xl font-black tracking-tight text-white mt-1">Giriş Yapın</h1>
                    </div>

                    {/* Kayıt Olun Başlığı */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out transform ${isRegister ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
                        }`}>
                        <span className="text-[10px] tracking-widest text-gray-500 font-bold uppercase">YENİ ÜYELİK</span>
                        <h1 className="text-3xl font-black tracking-tight text-white mt-1">Kayıt Olun</h1>
                    </div>
                </div>
            </div>

            {/* HATA BİLDİRİMİ */}
            {error && (
                <div className="w-full p-3.5 text-xs font-semibold text-red-400 bg-red-950/30 border border-red-900/50 rounded-full text-center">
                    {error}
                </div>
            )}

            {/* FORM BAŞLANGICI */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">

                {/* 1. KULLANICI ADI (Her iki modda da en üstte sabit) */}
                <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-2">
                        Kullanıcı Adı
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            disabled={loading}
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                            autoComplete="username"
                            className="w-full px-5 h-12 bg-[#151929] border border-gray-800 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm font-semibold placeholder-gray-600 text-white transition-all disabled:opacity-50 pl-5 pr-12"
                            placeholder="kullanıcı_adı"
                        />
                        <span className="absolute right-5 top-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer select-none focus:outline-none font-logo text-base font-bold">

                        </span>
                    </div>
                </div>

                {/* 2. SLIDING ALAN: E-posta ve Ad Soyad (Kayıt olunca soldan kayarak açılır) */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden space-y-4 ${isRegister
                        ? 'max-h-[220px] opacity-100 transform translate-x-0'
                        : 'max-h-0 opacity-0 transform -translate-x-12 pointer-events-none'
                    }`}>
                    {/* E-posta */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-2">
                            E-posta Adresi
                        </label>
                        <input
                            type="email"
                            required={isRegister}
                            disabled={!isRegister || loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full px-5 h-12 bg-[#151929] border border-gray-800 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm font-semibold placeholder-gray-600 text-white transition-all disabled:opacity-50"
                            placeholder="isim@adres.com"
                        />
                    </div>

                    {/* Ad Soyad */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-2">
                            Ad Soyad
                        </label>
                        <input
                            type="text"
                            required={isRegister}
                            disabled={!isRegister || loading}
                            value={nameSurname}
                            onChange={(e) => setNameSurname(e.target.value)}
                            autoComplete="name"
                            className="w-full px-5 h-12 bg-[#151929] border border-gray-800 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm font-semibold placeholder-gray-600 text-white transition-all disabled:opacity-50"
                            placeholder="Ahmet Yılmaz"
                        />
                    </div>
                </div>

                {/* 3. ŞİFRE (Her iki modda da alt kısımdadır, yukarı/aşağı kendiliğinden kayar) */}
                <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase pl-2">
                        Şifre
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            minLength={isRegister ? 6 : undefined}
                            className="w-full px-5 h-12 bg-[#151929] border border-gray-800 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-sm font-semibold placeholder-gray-600 text-white transition-all pl-5 pr-12 disabled:opacity-50"
                            placeholder="Şifreniz"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer select-none focus:outline-none"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* GÖNDER BUTONU (Aşağı/yukarı kayar) */}
                <button
                    type="submit"
                    disabled={loading}
                    className="custom-auth-btn mt-6"
                >
                    {loading ? (isRegister ? 'Kayıt Yapılıyor...' : 'Giriş Yapılıyor...') : (isRegister ? 'Kayıt Ol' : 'Giriş Yap')}
                </button>
            </form>

            {/* Alternatif Metin Linki */}
            <div className="text-center text-xs font-semibold text-gray-500">
                {isRegister ? (
                    <>
                        Zaten hesabınız var mı?{' '}
                        <button
                            type="button"
                            onClick={() => onTabChange('login')}
                            className="text-orange-500 hover:text-orange-400 font-bold transition-colors cursor-pointer"
                        >
                            Giriş Yapın
                        </button>
                    </>
                ) : (
                    <>
                        Hesabınız yok mu?{' '}
                        <button
                            type="button"
                            onClick={() => onTabChange('register')}
                            className="text-orange-500 hover:text-orange-400 font-bold transition-colors cursor-pointer"
                        >
                            Kayıt Olun
                        </button>
                    </>
                )}
            </div>



        </div>
    );
};
