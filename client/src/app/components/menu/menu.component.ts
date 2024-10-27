import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UnreadCountByFeedPipe } from '@components/menu/pipes/unread-count-by-feed.pipe';
import { ColorByFirstCharacterPipe } from '@pipes/color-by-first-character.pipe';
import { EncodeUriPipe } from '@pipes/encode-uri-component.pipe';
import { FirstCharacterPipe } from '@pipes/first-character.pipe';
import { ImageAvailablePipe } from '@pipes/image-available.pipe';
import { LastErrorPipe } from '@pipes/last-error.pipe';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'rssr-menu',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    AccordionModule,
    BadgeModule,
    FirstCharacterPipe,
    ColorByFirstCharacterPipe,
    NgStyle,
    ImageAvailablePipe,
    UnreadCountByFeedPipe,
    AsyncPipe,
    UnreadCountByFeedPipe,
    EncodeUriPipe,
    TooltipModule,
    LastErrorPipe,
    NgClass,
    NgxSignalTranslatePipe,
  ],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly #appStore = inject(appStateToken);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #elementRef = inject(ElementRef);
  private readonly rssrList = viewChild<HTMLElement>('rssrList');
  public readonly missingProxyConfig = computed(() => this.#appStore.state.blocker().proxyWarning);
  public readonly syncRunning = computed(() => this.#appStore.state.syncInProgress());
  public readonly rssrListItemMaxWidth = computed(() => {
    const rssrListElement = this.rssrList();
    return (rssrListElement?.clientWidth || 300) - 100;
  });
  public readonly categoryMaxWidth = computed(() => {
    const parent = this.#elementRef.nativeElement;
    return parent?.clientWidth || 300;
  });
  public readonly allFeedUnreadCount = toSignal(this.#databaseNewsFacadeService.unreadCount$);
  public readonly menuItems = this.#databaseFeedsFacadeService.feedsCollectByCategories;
}
