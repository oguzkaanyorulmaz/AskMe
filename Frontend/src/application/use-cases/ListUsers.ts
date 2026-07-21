import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class ListUsers {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(): Promise<any[]> {
        return await this.repository.listUsers();
    }
}
