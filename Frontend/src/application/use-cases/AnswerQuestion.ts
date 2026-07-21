import type { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';

export class AnswerQuestion {
    private readonly repository: IQuestionRepository;

    constructor(repository: IQuestionRepository) {
        this.repository = repository;
    }

    async execute(questionId: string, content: string): Promise<boolean> {
        return await this.repository.answerQuestion(questionId, content);
    }
}
