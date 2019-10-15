import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Row = { id: number };

export const normalize = <T extends Row>(
  arr: T[] = [],
): Record<number, T> =>
  arr.reduce(
    (collection, row) => {
      return {
        ...collection,
        [row.id]: row,
      };
    },
    {} as Record<number, T>,
  );

export interface Response<T extends Row[]> {
  data: Record<string, T[0]>;
}

@Injectable()
export class NormalizerInterceptor<T extends Row[]>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data: T) => ({ data: normalize(data) })));
  }
}
