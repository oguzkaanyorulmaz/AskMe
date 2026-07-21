import type { IAuthRepository, LoginResponseDto } from '../../domain/repositories/IAuthRepository';

export class Login {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(username: string, password: string): Promise<LoginResponseDto> {
        return await this.repository.login(username, password);
    }
}
