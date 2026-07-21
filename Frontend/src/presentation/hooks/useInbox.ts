import { useState, useEffect, useCallback } from 'react';
import { Question } from '../../domain/entities/Question';
import { ApiQuestionRepository } from '../../infrastructure/repositories/ApiQuestionRepository';
import { GetInbox } from '../../application/use-cases/GetInbox';
import { AnswerQuestion } from '../../application/use-cases/AnswerQuestion';

const repository = new ApiQuestionRepository();
const getInboxUseCase = new GetInbox(repository);
const answerQuestionUseCase = new AnswerQuestion(repository);

export function useInbox(username: string) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInbox = useCallback(async () => {
        if (!username) return;
        setLoading(true);
        try {
            const data = await getInboxUseCase.execute(username);
            setQuestions(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Gelen kutusu yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchInbox();
    }, [fetchInbox]);

    const handleAnswer = async (questionId: string, answerText: string): Promise<boolean> => {
        try {
            const success = await answerQuestionUseCase.execute(questionId, answerText);
            if (success) {
                setQuestions(prev => prev.filter(q => q.id !== questionId));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Cevap gönderilirken hata:", err);
            return false;
        }
    };

    const handleDelete = async (questionId: string): Promise<boolean> => {
        try {
            const success = await repository.deleteQuestion(questionId);
            if (success) {
                setQuestions(prev => prev.filter(q => q.id !== questionId));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Soru silinirken hata:", err);
            return false;
        }
    };

    return { questions, loading, error, handleAnswer, handleDelete, refetch: fetchInbox };
}
