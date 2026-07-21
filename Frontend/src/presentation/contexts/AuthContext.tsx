import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { Login as LoginUseCase } from '../../application/use-cases/Login';
import { Register as RegisterUseCase } from '../../application/use-cases/Register';
import { UpdateProfile as UpdateProfileUseCase } from '../../application/use-cases/UpdateProfile';

interface AuthUser {
    token: string;
    username: string;
    role: string;
    status: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string, nameSurname?: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (nameSurname: string, bio: string) => Promise<boolean>;
    isLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

const repository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(repository);
const registerUseCase = new RegisterUseCase(repository);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('askme_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('askme_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const resDto = await loginUseCase.execute(username, password);
            const authUser: AuthUser = {
                token: resDto.token,
                username: resDto.username,
                role: resDto.role,
                status: resDto.status
            };
            setUser(authUser);
            localStorage.setItem('askme_user', JSON.stringify(authUser));
            return true;
        } catch (e) {
            console.error("Giriş yaparken hata oluştu:", e);
            return false;
        }
    };

    const register = async (username: string, email: string, password: string, nameSurname?: string): Promise<boolean> => {
        try {
            return await registerUseCase.execute(username, email, password, nameSurname);
        } catch (e) {
            console.error("Kayıt olurken hata oluştu:", e);
            return false;
        }
    };

    const logout = () => {
        repository.logout().catch(console.error);
        setUser(null);
        localStorage.removeItem('askme_user');
    };
    const updateProfileUseCase = new UpdateProfileUseCase(repository);
    const updateProfile = async (nameSurname: string, bio: string): Promise<boolean> => {
        try {
            return await updateProfileUseCase.execute(nameSurname, bio);
        } catch (e) {
            console.error("Profil güncellenirken hata:", e);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoggedIn: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
