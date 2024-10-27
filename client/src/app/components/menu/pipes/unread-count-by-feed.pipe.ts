import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'unreadCountByFeed',
  standalone: true,
})
export class UnreadCountByFeedPipe implements PipeTransform {
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);

  public transform(feedId: string): Observable<string> {
    return this.#databaseNewsFacadeService.unreadCountByFeedId(feedId).pipe(map((count) => (count > 99 ? '99+' : `${count}`)));
  }
}
