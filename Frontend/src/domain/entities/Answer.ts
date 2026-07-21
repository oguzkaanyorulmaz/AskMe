export interface AnswerProps {
    id: string;
    content: string;
    questionId: string;
    userId: string;
}

export class Answer {
    private readonly props: AnswerProps;

    constructor(props: AnswerProps) {
        this.props = props;
    }

    get id(): string { return this.props.id; }
    get content(): string { return this.props.content; }
    get questionId(): string { return this.props.questionId; }
    get userId(): string { return this.props.userId; }
}
