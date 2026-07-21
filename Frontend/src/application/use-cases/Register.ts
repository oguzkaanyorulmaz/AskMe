import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class Register {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(username: string, email: string, password: string, nameSurname?: string): Promise<boolean> {
        return await this.repository.register(username, email, password, nameSurname);
    }
}
