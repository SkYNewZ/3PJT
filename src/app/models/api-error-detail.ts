import { plainToClass, classToPlain } from 'class-transformer';

export class ApiErrorDetail {
    code: string;
    bindingFailure: boolean;
    rejectedValue: string;
    field: string;
    objectName: string;
    defaultMessage: string;
    arguments: any[];
    codes: string[];

    public static FROM_JSON(jsonObject: {}): ApiErrorDetail {
        return plainToClass(ApiErrorDetail, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }
}
