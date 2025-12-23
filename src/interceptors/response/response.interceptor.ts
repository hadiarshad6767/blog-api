// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable, map } from 'rxjs';

// @Injectable()
// export class TransformInterceptor<T> implements NestInterceptor<T, any> {
//   intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
//     return next.handle().pipe(
//       map((data) => {
//         // Wrap all successful responses
//         return {
//           status: 200,
//           result: data,
//         };
//       }),
//     );
//   }
// }
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { SuccessResponse } from '../../common/interfaces/success-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 200,
        result: data,
      })),
    );
  }
}
