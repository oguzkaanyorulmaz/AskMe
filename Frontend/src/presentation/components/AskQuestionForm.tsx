import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ApiQuestionRepository } from '../../infrastructure/repositories/ApiQuestionRepository';
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { AskQuestion } from '../../application/use-cases/AskQuestion';
import { ListUsers } from '../../application/use-cases/ListUsers';

const questionRepository = new ApiQuestionRepository();
const authRepository = new ApiAuthRepository();
const askQuestionUseCase = new AskQuestion(questionRepository);
const listUsersUseCase = new ListUsers(authRepository);

interface AskQuestionFormProps {
    defaultTargetUsername?: string; // Profil sayfasında kilitli kullanıcı adı
    onSuccess?: () => void;
}

export const AskQuestionForm: React.FC<AskQuestionFormProps> = ({ defaultTargetUsername, onSuccess }) => {
    const { user } = useAuth();
    const [targetUsername, setTargetUsername] = useState(defaultTargetUsername || '');
    const [questionText, setQuestionText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [allowedAnswerers, setAllowedAnswerers] = useState('Everyone');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Combobox (Otomatik Tamamlama) State'leri
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Bileşen yüklendiğinde tüm kullanıcı listesini al
        const loadUsers = async () => {
            try {
                const users = await listUsersUseCase.execute();
                // Giriş yapan kullanıcıyı listeden çıkar (kendine sormayı boş bırakarak yapacak)
                const otherUsers = users.filter((u: any) => u.username.toLowerCase() !== user?.username.toLowerCase());
                setAllUsers(otherUsers);
            } catch (err) {
                console.error('Kullanıcı listesi yüklenemedi:', err);
            }
        };

        if (!defaultTargetUsername && user) {
            loadUsers();
        }
    }, [defaultTargetUsername, user]);

    // Input değiştiğinde arama yap
    const handleTargetChange = (val: string) => {
        setTargetUsername(val);
        setMessage(null);

        if (!val.trim()) {
            setFilteredUsers([]);
            setShowDropdown(false);
            return;
        }

        const filtered = allUsers.filter((u: any) =>
            u.username.toLowerCase().includes(val.toLowerCase()) ||
            (u.nameSurname && u.nameSurname.toLowerCase().includes(val.toLowerCase()))
        );
        setFilteredUsers(filtered);
        setShowDropdown(true);
    };

    // Dışarı tıklandığında dropdown'ı kapat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalTarget = targetUsername.trim();
        
        let resolvedTarget = user?.username || '';
        
        // Kullanıcı adı doğrulaması:
        if (finalTarget) {
            const matchedUser = allUsers.find(
                (u: any) => u.username.toLowerCase() === finalTarget.toLowerCase()
            );
            
            if (!matchedUser) {
                setMessage({
                    type: 'error',
                    text: 'Böyle bir kullanıcı bulunamadı. Lütfen listeden geçerli bir kullanıcı seçin.'
                });
                return;
            }
            resolvedTarget = matchedUser.username;
        }

        if (!questionText.trim()) return;

        setSubmitting(true);
        setMessage(null);

        const submitAnonymous = (resolvedTarget.toLowerCase() === user?.username.toLowerCase()) ? false : isAnonymous;

        try {
            await askQuestionUseCase.execute(
                '',
                resolvedTarget,
                questionText.trim(),
                submitAnonymous,
                isOwn ? allowedAnswerers : 'Everyone'
            );

            setMessage({
                type: 'success',
                text: resolvedTarget.toLowerCase() === user?.username.toLowerCase()
                    ? 'Sorunuz başarıyla kendi profilinizde yayınlandı!'
                    : `@${resolvedTarget} kullanıcısına sorunuz başarıyla gönderildi!`
            });

            setQuestionText('');
            setIsAnonymous(false);
            if (!defaultTargetUsername) {
                setTargetUsername('');
            }
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Gönderim başarısız.' });
        } finally {
            setSubmitting(false);
        }
    };

    const isOwn = (targetUsername.trim().toLowerCase() === user?.username.toLowerCase()) || !targetUsername.trim();

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4 relative z-20">
            <h3 className="font-black text-lg text-gray-900">
                {defaultTargetUsername 
                    ? (defaultTargetUsername.toLowerCase() === user?.username.toLowerCase() 
                        ? 'Kendine Soru Sor' 
                        : `@${defaultTargetUsername} kullanıcısına soru sor`)
                    : 'Yeni Soru Sor'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Kime Sormak İstiyorsun Combobox Alanı */}
                {!defaultTargetUsername && (
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-xs font-bold text-gray-600 mb-1 tracking-wider uppercase">Kime Sormak İstiyorsun?</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Kullanıcı adı yazın... (kendiniz için boş bırakın)"
                                value={targetUsername}
                                onChange={(e) => handleTargetChange(e.target.value)}
                                onFocus={() => {
                                    if (targetUsername.trim() && filteredUsers.length > 0) {
                                        setShowDropdown(true);
                                    }
                                }}
                                className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 text-sm font-semibold pr-10"
                            />
                            {targetUsername && (
                                <button
                                    type="button"
                                    onClick={() => handleTargetChange('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                                >
                                    ❌
                                </button>
                            )}
                        </div>

                        {/* Dropdown Önerileri */}
                        {showDropdown && filteredUsers.length > 0 && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg max-h-48 overflow-y-auto z-30 py-1">
                                {filteredUsers.map((u: any) => (
                                    <div
                                        key={u.id}
                                        onClick={() => {
                                            setTargetUsername(u.username);
                                            setShowDropdown(false);
                                        }}
                                        className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-gray-900">@{u.username}</span>
                                            {u.nameSurname && (
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{u.nameSurname}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 tracking-wider uppercase">Sorunuz</label>
                    <textarea
                        required
                        placeholder={isOwn ? "Profilinizde hemen görünmesi için kendinize bir soru sorabilirsiniz..." : "Merak ettiğiniz soruyu buraya yazın..."}
                        rows={3}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-orange-500 text-sm resize-none bg-gray-50 focus:bg-white transition-all font-semibold"
                    />
                </div>

                {message && (
                    <div className={`p-3 text-xs rounded-xl border ${message.type === 'success' ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    {isOwn ? (
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cevaplayabilir:</label>
                            <select
                                value={allowedAnswerers}
                                onChange={(e) => setAllowedAnswerers(e.target.value)}
                                className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-bold focus:outline-hidden bg-white cursor-pointer"
                            >
                                <option value="Everyone">Herkes</option>
                                <option value="Followers">Sadece Takipçilerim</option>
                            </select>
                        </div>
                    ) : (
                        <label className="flex items-center gap-2 text-sm text-gray-500 font-bold select-none cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 accent-orange-500"
                            />
                            Anonim olarak sor
                        </label>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || !questionText.trim()}
                        className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold rounded-full text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                    >
                        {submitting ? 'Gönderiliyor...' : 'Sor'}
                    </button>
                </div>
            </form>
        </div>
    );
};
