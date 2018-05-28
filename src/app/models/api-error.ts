import { ApiErrorDetail } from './api-error-detail';

export class ApiError {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: Date;
    errors: ApiErrorDetail[];
}
