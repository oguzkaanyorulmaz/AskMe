import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { InboxPage } from './components/InboxPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { BlurText } from './components/BlurText';

function Dashboard() {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState('feed');
    const [searchedUser, setSearchedUser] = useState('');
    const [highlightQuestionId, setHighlightQuestionId] = useState<string | null>(null);

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

    // 🌟 GİRİŞ YAPILMAMIŞSA: Facebook stili iki sütunlu premium giriş ekranı
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-between font-sans">
                {/* Orta Alan */}
                <div className="flex-1 flex items-center justify-center py-12 px-4">
                    <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
                        
                        {/* Sol Taraf: Marka, Logo ve Mesaj */}
                        <div className="flex-1 text-center md:text-left space-y-6 max-w-lg">
                            {/* ask?me Yazı Logosu */}
                            <div className="inline-flex items-center gap-2 select-none">
                                <BlurText 
                                    text="ask?me" 
                                    delay={80} 
                                    duration={800} 
                                    className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-500" 
                                />
                            </div>

                            {/* Açıklama Yazısı */}
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                <BlurText 
                                    text="Aklına Takılanı" 
                                    delay={40} 
                                    duration={700} 
                                    className="block text-gray-900" 
                                />
                                <BlurText 
                                    text="Sor?" 
                                    delay={60} 
                                    duration={800} 
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 block mt-1" 
                                />
                            </h1>
                            <p className="text-gray-500 font-semibold text-lg leading-relaxed">
                                Arkadaşlarına şahsi sorular sor, merak ettiklerini öğren veya kendi profilini paylaşarak akışını canlandır.
                            </p>
                        </div>

                        {/* Sağ Taraf: Giriş / Kayıt Kartı */}
                        <div className="w-full max-w-[400px] shrink-0">
                            {currentTab === 'register' ? (
                                <RegisterPage 
                                    onSuccess={() => setCurrentTab('login')} 
                                    onGoToLogin={() => setCurrentTab('login')} 
                                />
                            ) : (
                                <LoginPage 
                                    onSuccess={() => setCurrentTab('feed')} 
                                    onGoToRegister={() => setCurrentTab('register')} 
                                />
                            )}
                        </div>

                    </div>
                </div>

                {/* Sade Alt Bilgi (Footer) */}
                <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 font-bold tracking-wide">
                    <div className="max-w-5xl mx-auto px-4 flex justify-center gap-4">
                        <span className="text-gray-600">Türkçe</span>
                    </div>
                </footer>
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
                    <div className="max-w-xl mx-auto space-y-6 text-center mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
                        <div className="text-5xl">👋</div>
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">
                            AskMe'ye Hoş Geldiniz!
                        </h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                            Merak ettiğiniz şeyleri arkadaşlarınıza şahsi olarak sorun ya da kendi profilinizi paylaşarak soruları yanıtlayın.
                        </p>
                        <div className="pt-4 flex justify-center gap-3">
                            <button 
                                onClick={() => handleSearchProfile(user.username)}
                                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer text-sm"
                            >
                                Profilime Git
                            </button>
                        </div>
                    </div>
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
