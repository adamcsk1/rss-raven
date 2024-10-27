import { inject, Injectable } from '@angular/core';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { ToastService } from '@services/toast.service';
import { copyToClipboard } from '@utils/copy-to-clipboard.util';
import { mobileUserAgent } from '@utils/mobile-user-agent.util';
import { catchError, of, take } from 'rxjs';

@Injectable()
export class NewsActionsService {
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #toastService = inject(ToastService);

  public toggleFavorite(id: string): void {
    this.#databaseNewsFacadeService
      .toggleFavoriteById(id)
      .pipe(
        take(1),
        catchError((error) => {
          this.#toastService.showError({ key: 'MESSAGE_MARK_AS_FAVORITE_FAILED' });
          return of(error);
        }),
      )
      .subscribe();
  }

  public copyLink(link: string): void {
    copyToClipboard(link);
    if (!mobileUserAgent()) this.#toastService.showInfo({ key: 'MESSAGE_LINK_COPY' });
  }
}
