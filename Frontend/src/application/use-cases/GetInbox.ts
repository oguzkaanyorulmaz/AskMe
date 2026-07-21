import type { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question } from '../../domain/entities/Question';

export class GetInbox {
    private readonly repository: IQuestionRepository;

    constructor(repository: IQuestionRepository) {
        this.repository = repository;
    }

    async execute(username: string): Promise<Question[]> {
        return await this.repository.getInbox(username);
    }
}
