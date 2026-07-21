import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { InboxPage } from './components/InboxPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { BlurText } from './components/BlurText'; // <-- BlurText'i tekrar import ediyoruz
import { FeedPage } from './components/FeedPage';

function Dashboard() {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState('feed');
    const [searchedUser, setSearchedUser] = useState('');
    const [highlightQuestionId, setHighlightQuestionId] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);
    const handleSearchProfile = (username: string) => {
        setSearchedUser(username);
        setCurrentTab('profile');
    };

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
        if (tab !== 'profile') {
            setSearchedUser('');
        }
    };

    const handleGoToQuestion = (username: string, questionId: string) => {
        setSearchedUser(username);
        setCurrentTab('profile');
        setHighlightQuestionId(questionId);
    };

    // 🌟 GİRİŞ YAPILMAMIŞSA: Template Design Yapısı + Socially Giriş Arayüzü
    // 🌟 GİRİŞ YAPILMAMIŞSA: Template Design Yapısı + Socially Giriş Arayüzü + Hakkında Alanı
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-x-hidden">

                {/* SOL SÜTUN: Giriş Formu ve Kayan Tab Seçici (Ekranın %38'i) */}
                <div className="w-full md:w-[38%] bg-[#0c0f1d] p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-screen relative z-10 shadow-[25px_0_50px_-15px_rgba(0,0,0,0.4)]">

                    {/* Dikey Hizalanmış ve Yüksekliği Sabitlenmiş Form Konteyneri */}
                    <div className="my-auto max-w-sm w-full mx-auto flex flex-col justify-between min-h-[520px]">

                        {/* Form Alanı (Kayıt/Giriş geçişinde yüksekliği sabit tutarak buton kaymasını önler) */}
                        {/* Form Alanı */}
                        <div className="flex-1 flex flex-col justify-center">
                            <AuthForm
                                onSuccess={() => setCurrentTab('feed')}
                                currentTab={currentTab}
                                onTabChange={(tab) => {
                                    setCurrentTab(tab);
                                    setShowAbout(false);
                                }}
                            />
                        </div>


                        {/* Kapsül Tab Düğmeleri (Kayan Turuncu Göstergeli) */}
                        <div className="w-full bg-[#151929] border border-gray-800/80 p-1 rounded-full flex relative select-none mt-6 shrink-0">
                            {/* Kayan Göstergeli Arka Plan */}
                            <span
                                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-350 ease-out ${
                                    currentTab === 'register'
                                        ? 'translate-x-full bg-gradient-to-r from-orange-500 to-red-500'
                                        : 'translate-x-0 bg-white'
                                }`}
                            />
                            <button
                                onClick={() => {
                                    setCurrentTab('login');
                                    setShowAbout(false); // Giriş yapa basınca hakkında kısmını kapatır
                                }}
                                className={`w-1/2 py-2.5 text-center font-bold text-xs transition-colors duration-300 relative z-10 cursor-pointer ${
                                    currentTab !== 'register' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentTab('register');
                                    setShowAbout(false); // Kayıt ola basınca hakkında kısmını kapatır
                                }}
                                className={`w-1/2 py-2.5 text-center font-bold text-xs transition-colors duration-300 relative z-10 cursor-pointer ${
                                    currentTab === 'register' ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </div>

                {/* SAĞ SÜTUN: Akışkan Turuncu Gradyan ve Hakkında Paneli (Ekranın %62'si) */}
                <div className="w-full md:w-[62%] bg-gradient-to-tr from-[#ff512f] to-[#dd2476] relative p-8 md:p-16 lg:p-24 flex flex-col justify-between text-white overflow-hidden min-h-screen">
                    {/* Arka Plan Küreleri */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-yellow-300 opacity-20 blur-[130px]"></div>
                        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-[110px] animate-pulse"></div>
                    </div>

                    {/* Sağ Üst: ask?me Logosu ve Hakkında Butonu */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="font-logo text-2xl font-black tracking-tight text-white select-none">
                            ask?me
                        </span>
                        <button
                            onClick={() => setShowAbout(!showAbout)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${showAbout
                                ? 'bg-white text-orange-600 shadow-md'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                        >
                            {showAbout ? 'ANASAYFA' : 'HAKKINDA'}
                        </button>
                    </div>

                    {/* Orta / Alt Bölüm (Hakkında veya Karşılama Alanı) */}
                    {showAbout ? (
                        /* Geliştirici Tanıtım Kartı (Sadece Yazılardan Oluşan Tam Kontrast Tasarım) */
                        <div className="relative z-10 space-y-6 mt-auto max-w-xl">

                            {/* Dev Karşılama Başlığı (Aklına Takılanı Sor ile Birebir Aynı) */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight select-none">
                                <BlurText
                                    text="Oğuz Kaan"
                                    delay={15}
                                    duration={450}
                                    className="font-logo block text-white"
                                />
                                <BlurText
                                    text="Yorulmaz"
                                    delay={20}
                                    duration={500}
                                    className="font-logo text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 block mt-1"
                                />
                            </h1>

                            {/* Ünvan ve Okul Bilgisi */}
                            <div className="space-y-1">
                                <p className="text-yellow-300 font-bold text-sm tracking-wider uppercase">
                                    <BlurText
                                        text="Yazılım Mühendisliği Öğrencisi"
                                        delay={8}
                                        duration={400}
                                        animateBy="words"
                                        className="text-yellow-300"
                                    />
                                </p>
                                <p className="text-white/60 font-semibold text-xs tracking-wider uppercase">
                                    <BlurText
                                        text="Konya Teknik Üniversitesi"
                                        delay={8}
                                        duration={400}
                                        animateBy="words"
                                        className="text-white/60"
                                    />
                                </p>
                            </div>
                            {/* Metin Açıklamaları (Kelime bazlı animasyon ile çok hızlı ve akıcı) */}
                            <div className="space-y-4 text-white/80 font-semibold text-base leading-relaxed">
                                <BlurText
                                    text="Merhaba! Ben Oğuz Kaan Yorulmaz. Konya Teknik Üniversitesi Yazılım Mühendisliği bölümü öğrencisiyim."
                                    delay={6}
                                    duration={350}
                                    animateBy="words"
                                    className="text-white/80 font-semibold text-base leading-relaxed block"
                                />
                                <BlurText
                                    text="Modern web teknolojileri, temiz kod mimarisi (Clean Architecture) ve yazılım pratikleri üzerine yoğunlaşarak kendimi geliştiriyorum."
                                    delay={6}
                                    duration={350}
                                    animateBy="words"
                                    className="text-white/80 font-semibold text-base leading-relaxed block"
                                />
                                <BlurText
                                    text="Şu an incelemekte olduğunuz ask?me platformu; .NET 10 (C#), Redis ve MongoDB veritabanı altyapıları ile React (Vite + TypeScript) frontend kütüphanesi kullanılarak Clean Architecture ve Domain-Driven Design (DDD) prensiplerine uygun olarak geliştirdiğim Soru-Cevap (Q&A) projemdir."
                                    delay={6}
                                    duration={350}
                                    animateBy="words"
                                    className="text-white/80 font-semibold text-base leading-relaxed block"
                                />
                            </div>
                            {/* Geri Dön Butonu */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setShowAbout(false)}
                                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full text-xs shadow-md transition-all cursor-pointer"
                                >
                                    Giriş Ekranına Dön
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Varsayılan Karşılama Ekranı */
                        <div className="relative z-10 space-y-6 mt-auto max-w-xl">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight select-none">
                                <BlurText
                                    text="Aklına Takılanı"
                                    delay={40}
                                    duration={700}
                                    className="font-logo block text-white"
                                />
                                <BlurText
                                    text="Sor?"
                                    delay={60}
                                    duration={800}
                                    className="font-logo text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 block mt-1"
                                />
                            </h1>
                            <p className="text-white/80 font-semibold text-lg leading-relaxed">
                                Arkadaşlarına şahsi sorular sor, merak ettiklerini öğren veya kendi profilini paylaşarak akışını canlandır.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
                currentTab={currentTab}
                onTabChange={handleTabChange}
                onSearchProfile={handleSearchProfile}
            />
            <main className="flex-1 py-8 px-4">
                {currentTab === 'feed' && (
                    <FeedPage onGoToQuestion={handleGoToQuestion} />
                )}
                {currentTab === 'inbox' && (
                    <InboxPage onGoToQuestion={handleGoToQuestion} />
                )}
                {currentTab === 'profile' && (
                    <ProfilePage
                        targetUsername={searchedUser || user.username}
                        highlightQuestionId={highlightQuestionId}
                        clearHighlight={() => setHighlightQuestionId(null)}
                    />
                )}
                {currentTab === 'settings' && user.role === 'Admin' && (
                    <SettingsPage />
                )}
            </main>
        </div>
    );
}

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
};
