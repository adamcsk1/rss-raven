import { inject, Injectable } from '@angular/core';
import { OneNews } from '@interfaces/news.interface';
import { NewsDetailDialogComponent } from '@pages/news/news-detail-dialog/news-detail-dialog.component';
import { DynamicDialogService } from '@services/dynamic-dialog.service';

@Injectable()
export class NewsItemService {
  readonly #dynamicDialogService = inject(DynamicDialogService);

  public openDetails(news: OneNews): void {
    this.#dynamicDialogService.open(NewsDetailDialogComponent, {
      showHeader: false,
      styleClass: 'full-size-dialog',
      data: news,
    });
  }
}
