import type { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question } from '../../domain/entities/Question';
import { API_BASE_URL } from '../../core/constants';

export class ApiQuestionRepository implements IQuestionRepository {
    private getToken(): string {
        try {
            const stored = localStorage.getItem('askme_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed.token || '';
            }
        } catch (e) {
            console.error("Token okuma hatası", e);
        }
        return '';
    }

    async askQuestion(askedToUserId: string, askedToUsername: string, content: string, isAnonymous: boolean, allowedAnswerers?: string): Promise<Question> {
        const response = await fetch(`${API_BASE_URL}/Question/Ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                askedToUsername: askedToUsername,
                questionText: content,
                isAnonymous: isAnonymous,
                allowedAnswerers: allowedAnswerers || 'Everyone'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Soru gönderilemedi.');
        }

        // Backend { isSuccess: true } döner. Arayüz için yeni Question nesnesi dönüyoruz.
        return new Question({
            id: Math.random().toString(),
            content: content,
            askedToUserId: askedToUserId,
            askedToUsername: askedToUsername,
            isAnonymous: isAnonymous,
            status: 'Unanswered',
            createdAt: new Date().toISOString(),
            allowedAnswerers: allowedAnswerers
        });
    }

    async deleteQuestion(id: string): Promise<boolean> {
        const response = await fetch(`${API_BASE_URL}/Question/Delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                questionId: id
            })
        });

        return response.ok;
    }

    async getInbox(username: string): Promise<Question[]> {
        const response = await fetch(`${API_BASE_URL}/Question/Inbox?Page=1&PageSize=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Gelen kutusu yüklenemedi.');
        }

        const json = await response.json();
        const items = json.items || [];

        return items.map((item: any) => new Question({
            id: item.id,
            content: item.content,
            askedToUserId: '',
            askedToUsername: username,
            askedByUsername: item.askedBy,
            isAnonymous: item.askedBy === 'Gizli Kullanıcı',
            status: 'Unanswered',
            createdAt: item.createdAt
        }));
    }

    async answerQuestion(questionId: string, content: string): Promise<boolean> {
        const response = await fetch(`${API_BASE_URL}/Answer/Answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                questionId: questionId,
                answerText: content
            })
        });

        return response.ok;
    }

    async getProfileQuestions(targetUsername: string): Promise<any[]> {
        // 🌟 targetUsername değişkenini URL sorgu parametresi olarak ekledik:
        const url = `${API_BASE_URL}/Question/ProfileQuestions?TargetUsername=${encodeURIComponent(targetUsername)}&Page=1&PageSize=100`;

        // Eğer token varsa header'a ekle, yoksa normal isteği yolla
        const headers: HeadersInit = {};
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
            throw new Error('Profil soruları yüklenemedi.');
        }

        const json = await response.json();
        // Backend'den dönen Items listesini olduğu gibi döndür
        return json.items || [];
    }
    async getFeed(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/Question/Feed?Page=1&PageSize=20`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Akış yüklenemedi.');
        }

        const data = await response.json();
        return data.items || [];
    }

}
