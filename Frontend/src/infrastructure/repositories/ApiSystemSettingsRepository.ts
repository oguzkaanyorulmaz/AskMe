import type { ISystemSettingsRepository } from '../../domain/repositories/ISystemSettingsRepository';
import { SystemSettings } from '../../domain/entities/SystemSettings';
import { API_BASE_URL } from '../../core/constants';

export class ApiSystemSettingsRepository implements ISystemSettingsRepository {
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

    async getSettings(): Promise<SystemSettings[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/SystemManagement/SystemSettings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            if (!response.ok) throw new Error();
            const json = await response.json();
            const items = json.items || [];
            return items.map((item: any) => new SystemSettings({
                id: item.id || Math.random().toString(),
                settingKey: item.key || '',
                settingValue: String(item.value || '')
            }));
        } catch {
            // Backend metodunun eksik olması durumuna karşın fallback (yedek veri) dönüyoruz.
            return [
                new SystemSettings({ id: '1', settingKey: 'RegisterUserRole', settingValue: 'User' })
            ];
        }
    }

    async setSetting(key: string, value: string): Promise<boolean> {
        const response = await fetch(`${API_BASE_URL}/SystemManagement/SystemSettings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                items: [
                    { key, value }
                ]
            })
        });

        return response.ok;
    }
}
