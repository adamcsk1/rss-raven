import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivePathService } from '@services/active-path/active-path.service';
import { MarkAsReadService } from '@services/mark-as-read.service';
import { NewsSyncService } from '@services/news-sync/news-sync.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslateService } from 'ngx-signal-translate';
import { MenuItem } from 'primeng/api';

@Injectable()
export class MainContentHeaderService {
  readonly #appStore = inject(appStateToken);
  readonly #markAsReadService = inject(MarkAsReadService);
  readonly #newsSyncService = inject(NewsSyncService);
  readonly #activePathService = inject(ActivePathService);
  readonly #ngxSignalTranslateService = inject(NgxSignalTranslateService);
  readonly #router = inject(Router);
  public get hasUnreadFilter(): boolean {
    return this.#router.url.endsWith('/unread');
  }
  public get hasReadFilter(): boolean {
    return this.#router.url.endsWith('/read');
  }
  public get withoutReadFilter(): boolean {
    return !this.hasUnreadFilter && !this.hasReadFilter;
  }
  public readonly menuItems = computed<MenuItem[]>(() => {
    const syncRunning = this.#appStore.state.syncInProgress();
    const menuItems: MenuItem[] = [
      {
        label: this.#ngxSignalTranslateService.translate('MARK_ALL_AS_READ'),
        icon: 'pi pi-list-check',
        command: () => this.#markAsReadService.mark(),
        disabled: syncRunning,
      },
      {
        label: this.#ngxSignalTranslateService.translate('MANUAL_SYNC'),
        icon: `pi ${syncRunning ? 'pi-spin' : ''} pi-sync`,
        command: () => {
          this.#appStore.setState('manualSyncInProgress', true);
          this.#newsSyncService.sync();
        },
        disabled: syncRunning,
      },
      {
        label: this.#ngxSignalTranslateService.translate('SEARCH'),
        icon: `pi pi-search`,
        command: () => this.#appStore.patchState('search', (state) => ({ ...state, show: true })),
        disabled: syncRunning,
      },
    ];

    if (this.#activePathService.validate('/news/feed', 'includes'))
      menuItems.push({
        label: this.#ngxSignalTranslateService.translate('EDIT_FEED'),
        icon: `pi pi-pencil`,
        command: () => this.#router.navigate(['/feed', 'edit', `${this.#appStore.state.newsParameters().feedId}`]),
      });

    if (this.#activePathService.validate('/news/category', 'includes'))
      menuItems.push({
        label: this.#ngxSignalTranslateService.translate('EDIT_CATEGORY'),
        icon: `pi pi-pencil`,
        command: () => this.#router.navigate(['/category', 'edit', `${this.#appStore.state.newsParameters().categoryId}`]),
      });

    return menuItems;
  });
  public readonly filterMenuItems = computed<MenuItem[]>(() => {
    this.#activePathService.activePath();
    const showAll: MenuItem = {
      label: this.#ngxSignalTranslateService.translate('ALL'),
      icon: 'pi pi-filter-slash',
      command: () => this.#showAllNews(),
    };
    const showRead: MenuItem = {
      label: this.#ngxSignalTranslateService.translate('READ_ONLY'),
      icon: 'pi pi-eye-slash',
      command: () => this.#showReadNews(),
    };
    const showUnread: MenuItem = {
      label: this.#ngxSignalTranslateService.translate('UNREAD_ONLY'),
      icon: 'pi pi-eye',
      command: () => this.#showUnreadNews(),
    };
    const menuItems: MenuItem[] = [];

    if (this.withoutReadFilter) menuItems.push(showRead, showUnread);
    else if (this.hasReadFilter) menuItems.push(showAll, showUnread);
    else if (this.hasUnreadFilter) menuItems.push(showAll, showRead);

    return menuItems;
  });

  #showAllNews(): void {
    if (this.hasUnreadFilter) this.#router.navigate(this.#router.url.replace('/unread', '').split('/'));
    if (this.hasReadFilter) this.#router.navigate(this.#router.url.replace('/read', '').split('/'));
  }

  #showReadNews(): void {
    if (!this.hasReadFilter) this.#router.navigate([...this.#router.url.replace('/unread', '').split('/'), 'read']);
  }

  #showUnreadNews(): void {
    if (!this.hasUnreadFilter) this.#router.navigate([...this.#router.url.replace('/read', '').split('/'), 'unread']);
  }
}
