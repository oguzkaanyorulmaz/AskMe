import type { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question } from '../../domain/entities/Question';

export class AskQuestion {
    private readonly repository: IQuestionRepository;

    constructor(repository: IQuestionRepository) {
        this.repository = repository;
    }

    async execute(askedToUserId: string, askedToUsername: string, content: string, isAnonymous: boolean, allowedAnswerers?: string): Promise<Question> {
        return await this.repository.askQuestion(askedToUserId, askedToUsername, content, isAnonymous, allowedAnswerers);
    }
}
