export interface QuestionProps {
    id: string;
    content: string;
    askedToUserId: string;
    askedToUsername: string;
    askedByUserId?: string;
    askedByUsername?: string;
    isAnonymous: boolean;
    status: 'Unanswered' | 'Answered';
    createdAt: string;
}

export class Question {
    private readonly props: QuestionProps;

    constructor(props: QuestionProps) {
        this.props = props;
    }

    get id(): string { return this.props.id; }
    get content(): string { return this.props.content; }
    get askedToUserId(): string { return this.props.askedToUserId; }
    get askedToUsername(): string { return this.props.askedToUsername; }
    get askedByUserId(): string | undefined { return this.props.askedByUserId; }
    get askedByUsername(): string | undefined { return this.props.askedByUsername; }
    get isAnonymous(): boolean { return this.props.isAnonymous; }
    get status(): 'Unanswered' | 'Answered' { return this.props.status; }
    get createdAt(): string { return this.props.createdAt; }
}
