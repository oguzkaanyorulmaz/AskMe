import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class UnfollowUser {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(targetUsername: string): Promise<boolean> {
        return await this.repository.unfollow(targetUsername);
    }
}
