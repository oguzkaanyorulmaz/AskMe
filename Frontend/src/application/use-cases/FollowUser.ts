import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class FollowUser {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(targetUsername: string): Promise<boolean> {
        return await this.repository.follow(targetUsername);
    }
}
