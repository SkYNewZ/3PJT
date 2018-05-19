export class ApiErrorDetail {
    code: string;
    bindingFailure: boolean;
    rejectedValue: string;
    field: string;
    objectName: string;
    defaultMessage: string;
    arguments: any[];
    codes: string[];
}
