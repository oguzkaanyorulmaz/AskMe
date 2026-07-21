import { SystemSettings } from '../entities/SystemSettings';

export interface ISystemSettingsRepository {
    getSettings(): Promise<SystemSettings[]>;
    setSetting(key: string, value: string): Promise<boolean>;
}
