import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ApiQuestionRepository } from '../../infrastructure/repositories/ApiQuestionRepository';
import { AskQuestion } from '../../application/use-cases/AskQuestion';
import { AnswerQuestion } from '../../application/use-cases/AnswerQuestion';
import { API_BASE_URL } from '../../core/constants';

interface ProfilePageProps {
    targetUsername: string;
    highlightQuestionId?: string | null; // <-- Yeni
    clearHighlight?: () => void;         // <-- Yeni
}

const questionRepository = new ApiQuestionRepository();
const askQuestionUseCase = new AskQuestion(questionRepository);
const answerQuestionUseCase = new AnswerQuestion(questionRepository);

export const ProfilePage: React.FC<ProfilePageProps> = ({ targetUsername, highlightQuestionId, clearHighlight }) => {
    const { user, updateProfile } = useAuth();
    const [profile, setProfile] = useState<{ userId: string; username: string; nameSurname: string; bio: string } | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);

    // Düzenleme Modu Durumları
    const [isEditing, setIsEditing] = useState(false);
    const [editNameSurname, setEditNameSurname] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    // Soru Sorma Durumları
    const [questionText, setQuestionText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Çoklu Cevap Ekleme Durumları
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [answeringId, setAnsweringId] = useState<string | null>(null);

    const fetchProfileData = async () => {
        try {
            const resProfile = await fetch(`${API_BASE_URL}/Profile/View`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUsername })
            });

            if (!resProfile.ok) throw new Error('Profil yüklenemedi.');
            const profileData = await resProfile.json();

            setProfile({
                userId: profileData.userId || '',
                username: profileData.username || targetUsername,
                nameSurname: profileData.nameSurname || targetUsername,
                bio: profileData.bio || 'Henüz bir biyografi eklenmemiş.'
            });

            setEditNameSurname(profileData.nameSurname || targetUsername);
            setEditBio(profileData.bio || '');

            const profileQuestions = await questionRepository.getProfileQuestions(targetUsername);
            setQuestions(profileQuestions);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Profil yüklenirken hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (targetUsername) {
            setLoading(true);
            fetchProfileData();
        }
    }, [targetUsername]);

    // 🌟 Otomatik Kaydırma ve Parlama Zamanlayıcısı
    useEffect(() => {
        if (!loading && highlightQuestionId && questions.length > 0) {
            const element = document.getElementById(`q-${highlightQuestionId}`);
            if (element) {
                // Hafif gecikmeyle düzgün kaydırma tetikle
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);

                // 4 saniye sonra parlamayı söndür
                const timer = setTimeout(() => {
                    if (clearHighlight) clearHighlight();
                }, 4000);
                return () => clearTimeout(timer);
            }
        }
    }, [loading, highlightQuestionId, questions]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!questionText.trim() || !profile) return;

        setSubmitting(true);
        setMessage(null);
        const submitAnonymous = isOwnProfile ? false : isAnonymous;

        try {
            await askQuestionUseCase.execute(
                profile.userId,
                profile.username,
                questionText.trim(),
                submitAnonymous
            );
            setMessage({
                type: 'success',
                text: isOwnProfile
                    ? 'Düşünceniz profilinizde başarıyla paylaşıldı!'
                    : 'Sorunuz başarıyla gönderildi!'
            });
            setQuestionText('');
            setIsAnonymous(false);
            await fetchProfileData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Gönderim başarısız.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setEditLoading(true);
        setMessage(null);
        const success = await updateProfile(editNameSurname, editBio);
        if (success) {
            setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
            setIsEditing(false);
            await fetchProfileData();
        } else {
            setMessage({ type: 'error', text: 'Profil güncellenirken hata oluştu.' });
        }
        setEditLoading(false);
    };

    const handleAddAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
        e.preventDefault();
        if (!newAnswerText.trim()) return;

        setAnsweringId(questionId);
        try {
            const success = await answerQuestionUseCase.execute(questionId, newAnswerText.trim());
            if (success) {
                setNewAnswerText('');
                setActiveQuestionId(null);
                const profileQuestions = await questionRepository.getProfileQuestions(targetUsername);
                setQuestions(profileQuestions);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAnsweringId(null);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500 font-medium">Profil yükleniyor...</div>;
    }

    if (!profile) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-gray-100 rounded-3xl shadow-md text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-900 mb-1">Kullanıcı Bulunamadı</h3>
                <p className="text-gray-400 text-sm">Aradığınız kullanıcı adı sistemde kayıtlı değil.</p>
            </div>
        );
    }

    const isOwnProfile = user?.username.toLowerCase() === profile.username.toLowerCase();

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {/* Profile Info Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-black">?</div>
                <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black shadow-xs select-none">
                            {profile.nameSurname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{profile.nameSurname}</h2>
                            <p className="text-white/80 text-sm">@{profile.username}</p>
                        </div>
                    </div>
                    {isOwnProfile && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-1.5 bg-white text-orange-600 font-bold rounded-full text-xs hover:bg-orange-50 shadow-xs cursor-pointer transition-colors"
                        >
                            Profili Düzenle
                        </button>
                    )}
                </div>
                {!isEditing && (
                    <p className="mt-4 text-sm bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
                        {profile.bio}
                    </p>
                )}
            </div>

            {/* Edit Profile Form */}
            {isEditing && isOwnProfile && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-black text-lg text-gray-900">Profilini Düzenle</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 tracking-wider uppercase">Ad Soyad</label>
                            <input
                                type="text"
                                required
                                value={editNameSurname}
                                onChange={(e) => setEditNameSurname(e.target.value)}
                                className="w-full px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 text-sm font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 tracking-wider uppercase">Biyografi (Bio)</label>
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows={3}
                                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-orange-500 text-sm resize-none bg-gray-50 focus:bg-white transition-all font-semibold"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={editLoading}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors disabled:opacity-55"
                            >
                                {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Message Area */}
            {message && (
                <div className={`p-3 text-sm rounded-xl border ${message.type === 'success' ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            {/* Ask Question Form */}
            {!isEditing && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-black text-lg text-gray-900">
                        {isOwnProfile ? 'Düşüncelerini Paylaş' : `@${profile.username} kullanıcısına şahsi soru sor`}
                    </h3>

                    <form onSubmit={handleAsk} className="space-y-3">
                        <textarea
                            required
                            placeholder={isOwnProfile ? "Kendi profilinde herkese açık ne paylaşmak istersin?" : "Neyi merak ediyorsun?"}
                            rows={3}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-hidden focus:border-orange-500 text-sm resize-none bg-gray-50 focus:bg-white transition-all font-semibold"
                        />

                        <div className="flex items-center justify-between">
                            {!isOwnProfile ? (
                                <label className="flex items-center gap-2 text-sm text-gray-500 font-bold select-none cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="w-4 h-4 accent-orange-500"
                                    />
                                    Anonim olarak sor
                                </label>
                            ) : (
                                <div></div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || !questionText.trim()}
                                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold rounded-full text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                            >
                                {isOwnProfile ? 'Paylaş' : 'Sor'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Questions and Answers Timeline */}
            <div className="space-y-4">
                <h3 className="font-black text-lg text-gray-900 px-1">Tüm Sorular ({questions.length})</h3>

                {questions.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center text-gray-400 text-sm">
                        Henüz sorulmuş bir soru bulunmuyor.
                    </div>
                ) : (
                    questions.map((q) => (
                        <div
                            key={q.id}
                            id={`q-${q.id}`} // 🌟 Kaydırma işlemi için element ID verdik
                            className={`bg-white border rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-1000 ${highlightQuestionId === q.id
                                    ? 'animate-glow-orange border-orange-500 ring-4 ring-orange-100' // 🌟 Parlama sınıfı
                                    : 'border-gray-100'
                                }`}
                        >
                            {/* Question details */}
                            <div className="flex justify-between items-start gap-2 border-b border-gray-50 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-900 font-bold text-sm">{q.content}</p>
                                        {q.answers.length === 0 && (
                                            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 rounded-md">
                                                Cevaplanmamış
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold">Soruyu soran: {q.askedBy}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                    {new Date(q.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>

                            {/* Answer(s) List */}
                            <div className="space-y-3">
                                {q.answers && q.answers.map((ans: any, index: number) => (
                                    <div key={ans.id} className="flex gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                            {index + 1}
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-3 flex-1 font-semibold text-gray-700">
                                            {ans.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Multi-Answer Form */}
                            {isOwnProfile && (
                                <div className="pt-2">
                                    {activeQuestionId === q.id ? (
                                        <form onSubmit={(e) => handleAddAnswerSubmit(e, q.id)} className="space-y-2">
                                            <input
                                                type="text"
                                                required
                                                placeholder={q.answers.length === 0 ? "İlk cevabınızı yazın..." : "Yeni cevabınızı yazın..."}
                                                value={newAnswerText}
                                                onChange={(e) => setNewAnswerText(e.target.value)}
                                                className="w-full px-4 h-9 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 text-xs font-semibold"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveQuestionId(null);
                                                        setNewAnswerText('');
                                                    }}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg text-[10px] cursor-pointer"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={answeringId === q.id || !newAnswerText.trim()}
                                                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-[10px] cursor-pointer disabled:opacity-50"
                                                >
                                                    {answeringId === q.id ? 'Gönderiliyor...' : q.answers.length === 0 ? 'Cevapla' : 'Cevap Ekle'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setActiveQuestionId(q.id)}
                                            className="text-xs font-bold text-orange-500 hover:text-orange-600 cursor-pointer flex items-center gap-1 select-none"
                                        >
                                            {q.answers.length === 0 ? (
                                                <span>💬 Soruyu Cevapla</span>
                                            ) : (
                                                <span>+ Başka Bir Cevap Ekle</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
