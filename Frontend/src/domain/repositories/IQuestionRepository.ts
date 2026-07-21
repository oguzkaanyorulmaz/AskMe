import { Question } from '../entities/Question';

export interface IQuestionRepository {
    askQuestion(askedToUserId: string, askedToUsername: string, content: string, isAnonymous: boolean, allowedAnswerers?: string): Promise<Question>;
    deleteQuestion(id: string): Promise<boolean>;
    getInbox(username: string): Promise<Question[]>;
    answerQuestion(questionId: string, content: string): Promise<boolean>;
    getProfileQuestions(targetUsername: string): Promise<any[]>;
    getFeed(): Promise<any[]>;

}
