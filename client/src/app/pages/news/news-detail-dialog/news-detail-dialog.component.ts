import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OneNews } from '@interfaces/news.interface';
import { ImageAvailablePipe } from '@pipes/image-available.pipe';
import { DynamicDialogService } from '@services/dynamic-dialog.service';
import { NewsActionsService } from '@services/news-actions.service';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'rssr-news-detail-dialog',
  standalone: true,
  imports: [ButtonModule, ImageAvailablePipe, NgxSignalTranslatePipe],
  templateUrl: './news-detail-dialog.component.html',
  styleUrl: './news-detail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container-p-0' },
})
export class NewsDetailDialogComponent {
  readonly #dynamicDialogRef = inject(DynamicDialogRef);
  readonly #dynamicDialogService = inject(DynamicDialogService);
  readonly #newsActionsService = inject(NewsActionsService);
  public readonly news = this.#dynamicDialogService.getInstance(this.#dynamicDialogRef).data as OneNews;

  public onClose(): void {
    this.#dynamicDialogRef.close();
  }

  public onOpen(): void {
    window.open(this.news.link, 'blank');
  }

  public onToggleFavorite(): void {
    this.news.favorite = !this.news.favorite;
    this.#newsActionsService.toggleFavorite(this.news.id);
  }

  public onCopyLink(): void {
    this.#newsActionsService.copyLink(this.news.link);
  }
}
