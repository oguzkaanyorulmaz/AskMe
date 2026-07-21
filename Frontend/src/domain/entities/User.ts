export interface UserProps {
    id: string;
    username: string;
    email: string;
    nameSurname?: string;
    bio?: string;
    profilePictureUrl?: string;
    role: string;
    status: string;
}

export class User {
    private readonly props: UserProps;

    constructor(props: UserProps) {
        this.props = props;
    }

    get id(): string { return this.props.id; }
    get username(): string { return this.props.username; }
    get email(): string { return this.props.email; }
    get nameSurname(): string | undefined { return this.props.nameSurname; }
    get bio(): string | undefined { return this.props.bio; }
    get profilePictureUrl(): string | undefined { return this.props.profilePictureUrl; }
    get role(): string { return this.props.role; }
    get status(): string { return this.props.status; }
}
