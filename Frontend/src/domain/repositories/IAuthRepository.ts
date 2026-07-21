export interface LoginResponseDto {
    token: string;
    username: string;
    role: string;
    status: string;
}

export interface IAuthRepository {
    login(username: string, password: string): Promise<LoginResponseDto>;
    register(username: string, email: string, password: string, nameSurname?: string): Promise<boolean>;
    logout(): Promise<void>;
    updateProfile(nameSurname: string, bio: string): Promise<boolean>;
    follow(targetUsername: string): Promise<boolean>;
    unfollow(targetUsername: string): Promise<boolean>;
    isFollowing(targetUsername: string): Promise<boolean>;
    listUsers(): Promise<any[]>;
}
