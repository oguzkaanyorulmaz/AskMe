import React, { useState, useEffect } from 'react';
import { ApiQuestionRepository } from '../../infrastructure/repositories/ApiQuestionRepository';
import { GetFeed } from '../../application/use-cases/GetFeed';
import { AskQuestionForm } from './AskQuestionForm';


interface FeedPageProps {
    onGoToQuestion: (username: string, questionId: string) => void;
}

const questionRepository = new ApiQuestionRepository();
const getFeedUseCase = new GetFeed(questionRepository);

export const FeedPage: React.FC<FeedPageProps> = ({ onGoToQuestion }) => {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const items = await getFeedUseCase.execute();
            setFeedItems(items);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Akış yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const getBadgeStyle = (feedType: string) => {
        switch (feedType) {
            case 'AskedToMe':
                return {
                    label: 'Sana Soruldu',
                    class: 'bg-orange-50 text-orange-600 border border-orange-100'
                };
            case 'AskedByMe':
                return {
                    label: 'Sorduğun Soru',
                    class: 'bg-blue-50 text-blue-600 border border-blue-100'
                };
            case 'FollowedUserAnswered':
                return {
                    label: 'Takip Ettiğin Kişi Cevapladı',
                    class: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                };
            case 'FollowedUserAsked':
            default:
                return {
                    label: 'Takip Ettiğin Kişiye Soruldu',
                    class: 'bg-purple-50 text-purple-600 border border-purple-100'
                };
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500 font-medium">Akış yükleniyor...</div>;
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-red-100 rounded-3xl shadow-sm text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="font-bold text-gray-900 mb-1">Hata Oluştu</h3>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                    onClick={fetchFeed}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-bold cursor-pointer"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }



    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-2xl font-black text-gray-900">Ana Sayfa Akışı</h2>
                <button
                    onClick={fetchFeed}
                    className="p-2 bg-white border border-gray-100 hover:bg-gray-50 rounded-full shadow-xs cursor-pointer text-gray-500 hover:text-orange-500 transition-colors"
                    title="Yenile"
                >
                    🔄
                </button>
            </div>
            {/* Akış Başındaki Soru Sorma Formu */}
            <AskQuestionForm onSuccess={fetchFeed} />
            {feedItems.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-xs">
                    <div className="text-5xl mb-4">📢</div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">Akışınız Boş</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                        Henüz takip ettiğiniz biri yok veya akışta bir aktivite bulunmuyor. Keşfetmek için diğer kullanıcıları takip edebilirsiniz!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedItems.map((item) => {
                        const badge = getBadgeStyle(item.feedType);
                        return (
                            <div
                                key={item.id}
                                onClick={() => onGoToQuestion(item.askedTo, item.id)}
                                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer space-y-3"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${badge.class}`}>
                                        {badge.label}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>

                                <div className="border-b border-gray-50 pb-2">
                                    <p className="text-gray-900 font-bold text-sm leading-relaxed">{item.content}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                                        @{item.askedTo} kullanıcısına {item.askedBy} tarafından soruldu
                                    </p>
                                </div>

                                {item.answers && item.answers.length > 0 && (
                                    <div className="space-y-2">
                                        {item.answers.map((ans: any, idx: number) => (
                                            <div key={ans.id} className="flex gap-3 text-xs">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[10px] shrink-0 select-none">
                                                    {idx + 1}
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-2.5 flex-1 font-semibold text-gray-700">
                                                    {ans.content}
                                                    {ans.answeredByUsername && ans.answeredByUsername.toLowerCase() !== item.askedTo.toLowerCase() && (
                                                        <span className="text-[9px] text-orange-500 font-bold block mt-1">
                                                            - @{ans.answeredByUsername} tarafından cevaplandı
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
