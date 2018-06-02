import { ApiErrorDetail } from './api-error-detail';
import { plainToClass, classToPlain } from 'class-transformer';

export class ApiError {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: Date;
    errors: ApiErrorDetail[];

    public static FROM_JSON(jsonObject: {}): ApiError {
        return plainToClass(ApiError, jsonObject);
    }

    public toJson(): {} {
        return classToPlain(this);
    }
}
