import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInbox } from '../hooks/useInbox';

interface InboxPageProps {
    onGoToQuestion?: (username: string, questionId: string) => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({ onGoToQuestion }) => {
    const { user } = useAuth();
    const { questions, loading, error, handleDelete } = useInbox(user?.username || '');

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">Bildirimler</h1>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 font-bold text-xs rounded-full">
                    {questions.length} Bildirim
                </span>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500 font-medium">Yükleniyor...</div>
            ) : error ? (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">{error}</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
                    <div className="text-4xl mb-3">🔔</div>
                    <h3 className="font-bold text-gray-900 mb-1">Yeni bildirim yok</h3>
                    <p className="text-gray-400 text-sm">Şu an yanıtlanacak yeni bir soru bulunmuyor. Arkadaşlarına profilini paylaş!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer hover:border-orange-200 group"
                            onClick={() => onGoToQuestion && onGoToQuestion(user?.username || '', q.id)}
                            title="Profilde Git ve Cevapla"
                        >
                            {/* Bildirim İçeriği */}
                            <div className="flex-1 space-y-1">
                                <div className="text-[10px] font-bold text-gray-400 tracking-wider group-hover:text-orange-500 transition-colors">
                                    {q.isAnonymous ? '🕵️‍♂️ Gizli Kullanıcı size sordu' : `💬 @${q.askedByUsername} size sordu`}
                                </div>
                                <p className="text-gray-950 font-bold text-sm leading-snug group-hover:text-orange-600 transition-colors">
                                    {q.content}
                                </p>
                                <span className="text-[9px] text-gray-400 font-medium block">
                                    {new Date(q.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>

                            {/* Bildirimi Silme Butonu (Çöp Kutusu) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Kart tıklama olayını engeller (sayfa kaymasın diye)
                                    handleDelete(q.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
                                title="Bildirimi Sil"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
