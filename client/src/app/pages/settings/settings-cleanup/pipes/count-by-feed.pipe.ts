import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'countByFeed',
  standalone: true,
})
export class CountByFeedPipe implements PipeTransform {
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);

  public transform(feedId: string): Observable<number> {
    return this.#databaseNewsFacadeService.countByFeedId(feedId);
  }
}
