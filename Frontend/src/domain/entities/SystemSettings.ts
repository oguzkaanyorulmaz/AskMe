export interface SystemSettingsProps {
    id: string;
    settingKey: string;
    settingValue: string;
}

export class SystemSettings {
    private readonly props: SystemSettingsProps;

    constructor(props: SystemSettingsProps) {
        this.props = props;
    }

    get id(): string { return this.props.id; }
    get settingKey(): string { return this.props.settingKey; }
    get settingValue(): string { return this.props.settingValue; }
}
