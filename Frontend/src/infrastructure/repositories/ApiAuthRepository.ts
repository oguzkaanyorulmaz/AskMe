import type { IAuthRepository, LoginResponseDto } from '../../domain/repositories/IAuthRepository';
import { API_BASE_URL } from '../../core/constants';

export class ApiAuthRepository implements IAuthRepository {
    async login(username: string, password: string): Promise<LoginResponseDto> {
        const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || 'Giriş başarısız.');
        }

        const data = await response.json();

        // Backend LoginResponse: { id, username, authToken }
        return {
            token: data.authToken || '',
            username: data.username || '',
            role: 'User', // Backend LoginResponse'ta role alanını göndermediği için varsayılan 'User' olarak eşledik.
            status: 'Active'
        };
    }

    async register(username: string, email: string, password: string, nameSurname?: string): Promise<boolean> {
        const response = await fetch(`${API_BASE_URL}/Auth/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                nameSurname: nameSurname || username
            })
        });

        return response.ok;
    }

    async logout(): Promise<void> {
        const stored = localStorage.getItem('askme_user');
        if (!stored) return;
        const user = JSON.parse(stored);

        await fetch(`${API_BASE_URL}/Auth/Logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ username: user.username })
        });
    }

    async updateProfile(nameSurname: string, bio: string): Promise<boolean> {
        const stored = localStorage.getItem('askme_user');
        if (!stored) return false;
        const user = JSON.parse(stored);

        const response = await fetch(`${API_BASE_URL}/Profile/Update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                nameSurname,
                bio
            })
        });

        return response.ok;
    }

}
