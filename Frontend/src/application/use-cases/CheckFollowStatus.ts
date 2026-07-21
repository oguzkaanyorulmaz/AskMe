import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class CheckFollowStatus {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(targetUsername: string): Promise<boolean> {
        return await this.repository.isFollowing(targetUsername);
    }
}
