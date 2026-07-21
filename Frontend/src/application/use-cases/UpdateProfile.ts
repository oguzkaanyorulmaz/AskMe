import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class UpdateProfile {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(nameSurname: string, bio: string): Promise<boolean> {
        return await this.repository.updateProfile(nameSurname, bio);
    }
}
