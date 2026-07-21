import React, { useState, useEffect } from 'react';
import { ApiSystemSettingsRepository } from '../../infrastructure/repositories/ApiSystemSettingsRepository';

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<{ key: string; value: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const repository = new ApiSystemSettingsRepository();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await repository.getSettings();
                setSettings(data.map(s => ({ key: s.settingKey, value: s.settingValue })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key: string, newVal: string) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newVal } : s));
    };

    const handleSave = async (key: string, val: string) => {
        setSaving(true);
        setMessage(null);
        try {
            const success = await repository.setSetting(key, val);
            if (success) {
                setMessage('Ayar başarıyla kaydedildi.');
            } else {
                setMessage('Ayar kaydedilemedi.');
            }
        } catch {
            setMessage('Ayar kaydedilirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500 font-medium">Ayarlar yükleniyor...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 border-b border-gray-100 pb-4">
                Sistem Ayarları (Admin)
            </h1>

            {message && (
                <div className="p-3 text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-xl">
                    {message}
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
                {settings.length === 0 ? (
                    <p className="text-gray-400 text-sm">Görüntülenecek ayar bulunamadı.</p>
                ) : (
                    settings.map((s) => (
                        <div key={s.key} className="space-y-2 border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                                {s.key}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={s.value}
                                    onChange={(e) => handleChange(s.key, e.target.value)}
                                    className="flex-1 px-4 h-10 border border-gray-200 rounded-xl focus:outline-hidden focus:border-orange-500 text-sm font-semibold"
                                />
                                <button
                                    onClick={() => handleSave(s.key, s.value)}
                                    disabled={saving}
                                    className="px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
