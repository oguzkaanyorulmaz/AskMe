import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
    onSearchProfile: (username: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onSearchProfile }) => {
    const { user, logout } = useAuth();
    const [searchVal, setSearchVal] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchVal.trim()) {
            onSearchProfile(searchVal.trim());
            setSearchVal('');
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-xs">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <div
                    onClick={() => onTabChange('feed')}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <span className="font-logo text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        AskMe
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-full">
                        v1.0
                    </span>
                </div>

                {/* Search Profiles */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-hidden focus:bg-white focus:border-orange-500 transition-all font-semibold"
                    />
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </form>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    {user ? (
                        <>
                            {/* Bildirim Zili (Kutum) */}
                            <button
                                onClick={() => onTabChange('inbox')}
                                className={`p-2 rounded-full relative transition-all cursor-pointer ${currentTab === 'inbox' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                title="Gelen Kutusu / Sorular"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {/* Kırmızı bildirim noktası */}
                                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>

                            <button
                                onClick={() => {
                                    onSearchProfile(user.username);
                                    onTabChange('profile');
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${currentTab === 'profile' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Profilim
                            </button>
                            {user.role === 'Admin' && (
                                <button
                                    onClick={() => onTabChange('settings')}
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${currentTab === 'settings' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    Ayarlar
                                </button>
                            )}
                            <button
                                onClick={logout}
                                className="px-3 py-1.5 rounded-full text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                            >
                                Çıkış
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onTabChange('login')}
                                className="px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => onTabChange('register')}
                                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                            >
                                Kayıt Ol
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};
