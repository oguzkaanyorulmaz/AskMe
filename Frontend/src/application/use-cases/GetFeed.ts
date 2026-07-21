import type { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';

export class GetFeed {
    private readonly repository: IQuestionRepository;

    constructor(repository: IQuestionRepository) {
        this.repository = repository;
    }

    async execute(): Promise<any[]> {
        return await this.repository.getFeed();
    }
}
