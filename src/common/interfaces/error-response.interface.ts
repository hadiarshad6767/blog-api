export interface ErrorResponse {
  statusCode: number;
  errorType: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
}