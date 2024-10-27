import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CountByFeedPipe } from '@pages/settings/settings-cleanup/pipes/count-by-feed.pipe';
import { SettingsCleanupExportService } from '@pages/settings/settings-cleanup/settings-cleanup.service';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rssr-settings-cleanup',
  standalone: true,
  imports: [ButtonModule, NgxSignalTranslatePipe, CountByFeedPipe, AsyncPipe, DatePipe, NgClass],
  templateUrl: './settings-cleanup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsCleanupExportService, ConfirmationFacadeService],
  host: { class: 'content-container' },
})
export class SettingsCleanupComponent {
  readonly #appStore = inject(appStateToken);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #settingsCleanupExportService = inject(SettingsCleanupExportService);
  public readonly lastCleanupRun = this.#settingsCleanupExportService.lastCleanupRun;
  public readonly feedsCollectByCategories = this.#databaseFeedsFacadeService.feedsCollectByCategories;
  public readonly maximumRetainedItemsPerFeed = computed(() => this.#appStore.state.settings().sync.maximumNewsPerFeed);
  public readonly unlimitedItem = computed(() => this.maximumRetainedItemsPerFeed() === 0);

  constructor() {
    this.#appStore.setState('pageTitle', 'DATA_CLEANUP');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onCleanup(): void {
    this.#settingsCleanupExportService.cleanup();
  }

  public onCleanupByFeedId(feedId: string, feedName: string): void {
    if (!this.unlimitedItem()) this.#settingsCleanupExportService.cleanupByFeedId(feedId, feedName);
  }
}
