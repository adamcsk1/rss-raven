import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createCategoryOutline } from '@pages/settings/settings-opml-export/utils/create-opml-category-outline.util';
import { createOpmlContent } from '@pages/settings/settings-opml-export/utils/create-opml-content.util';
import { createFeedOutline } from '@pages/settings/settings-opml-export/utils/create-opml-feed-outline.util';
import { createXmlContent } from '@pages/settings/settings-opml-export/utils/create-xml-content.util';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { DownloadService } from '@services/download.service';
import { appStateToken } from '@stores/app-state.constant';
import { combineLatest, take } from 'rxjs';

@Injectable()
export class SettingsOpmlExportService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #downloadService = inject(DownloadService);

  public export(): void {
    this.#appStore.setState('blockerLoading', true);
    combineLatest([this.#databaseFeedsFacadeService.feeds$, this.#databaseCategoriesFacadeService.categories$])
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe(([feeds, categories]) => {
        let opmlBody = '';

        for (const category of categories) {
          const categoryFeeds = feeds.filter((feed) => feed.categoryId === category.id);
          let opmlFeedContent = '';
          for (const feed of categoryFeeds) opmlFeedContent += createFeedOutline(feed);
          opmlBody += createCategoryOutline(category, opmlFeedContent);
        }
        const opmlContent = createOpmlContent(opmlBody);
        const xmlContent = createXmlContent(opmlContent);
        this.#downloadService.saveAs(xmlContent, 'opml-export', 'opml');
        this.#appStore.setState('blockerLoading', false);
      });
  }
}
