import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationSkipped, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BlockerLoadingComponent } from '@components/blocker-loading/blocker-loading.component';
import { MainContentHeaderComponent } from '@components/main/main-content/main-content-header/main-content-header.component';
import { MenuComponent } from '@components/menu/menu.component';
import { ScrollContainerComponent } from '@components/scroll-container/scroll-container.component';
import { SearchComponent } from '@components/search/search.component';
import { SpinnerLoadingComponent } from '@components/spinner-loading/spinner-loading.component';
import { LogoAutoContrastDirective } from '@directives/logo-auto-contrast.directive';
import { AndroidBridgeEventsService } from '@services/android-bridge/android-bridge-events.service';
import { AndroidBridgeSyncService } from '@services/android-bridge/android-bridge-sync.service';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { BlockerService } from '@services/blocker.service';
import { DatabaseService } from '@services/database/database.service';
import { DynamicDialogService } from '@services/dynamic-dialog.service';
import { IdleService } from '@services/idle.service';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { MarkAsReadService } from '@services/mark-as-read.service';
import { NewsActionsService } from '@services/news-actions.service';
import { NewsSyncService } from '@services/news-sync/news-sync.service';
import { PeriodicalSyncService } from '@services/periodical-sync.service';
import { ThemeService } from '@services/theme.service';
import { TitleService } from '@services/title.service';
import { ToastService } from '@services/toast.service';
import { CleanupWorkerService } from '@services/workers/cleanup-worker.service';
import { FeedSyncWorkerService } from '@services/workers/feed-sync-worker.service';
import { appStateToken, initialAppState } from '@stores/app-state.constant';
import { effectOnce } from '@utils/effect-once.util';
import dayjs from 'dayjs';
import { NgxSignalTranslatePipe, NgxSignalTranslateService } from 'ngx-signal-translate';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { filter, take } from 'rxjs';

@Component({
  selector: 'rssr-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarModule,
    ButtonModule,
    SpinnerLoadingComponent,
    MenuComponent,
    ScrollContainerComponent,
    MainContentHeaderComponent,
    ToastModule,
    BlockerLoadingComponent,
    ConfirmDialogModule,
    LogoAutoContrastDirective,
    NgxSignalTranslatePipe,
    SearchComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // PrimeNg
    ConfirmationService,
    MessageService,
    DialogService,
    // Rss Raven
    NewsSyncService,
    ToastService,
    BlockerService,
    AndroidBridgeEventsService,
    DynamicDialogService,
    PeriodicalSyncService,
    NewsActionsService, // ? Because of the the news detail dialog
    AndroidBridgeSyncService,
    CleanupWorkerService,
    IdleService,
    ThemeService,
    TitleService,
    MarkAsReadService,
  ],
})
export class MainContentComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #databaseService = inject(DatabaseService);
  readonly #signalTranslateService = inject(NgxSignalTranslateService);
  readonly #themeService = inject(ThemeService);
  readonly #router = inject(Router);
  readonly #feedSyncWorkerService = inject(FeedSyncWorkerService);
  readonly #newsSyncService = inject(NewsSyncService);
  readonly #cleanupWorkerService = inject(CleanupWorkerService);
  readonly #androidBridgeService = inject(AndroidBridgeService);
  readonly #androidBridgeSyncService = inject(AndroidBridgeSyncService);
  readonly #blockerService = inject(BlockerService);
  readonly #androidBridgeEventsService = inject(AndroidBridgeEventsService);
  readonly #periodicalSyncService = inject(PeriodicalSyncService);
  readonly #idleService = inject(IdleService);
  readonly #localStorageService = inject(LocalStorageService);
  readonly #titleService = inject(TitleService);
  public readonly blocked = computed(() => this.#appStore.state.blocker().blocked);
  public showSidebar = false;

  constructor() {
    this.#signalTranslateService.setLanguage(initialAppState.settings.language);
    this.#blockerService.check();

    if (!this.blocked()) {
      this.#androidBridgeService.initialize();
      this.#androidBridgeSyncService.initialize();
      this.#androidBridgeEventsService.initialize();
      this.#themeService.listen();
      this.#databaseService.initialize();
      this.#periodicalSyncService.initialize();
      this.#idleService.initialize();
      this.#titleService.initialize();

      this.#router.events
        .pipe(
          filter((event) => event instanceof NavigationStart || event instanceof NavigationSkipped),
          takeUntilDestroyed(this.#destroyRef),
        )
        .subscribe(() => (this.showSidebar = false));

      effectOnce(
        () => this.#appStore.state.newsContentRendered() && this.#appStore.state.settings().sync.syncOnStart,
        () => this.#newsSyncService.sync({ syncType: 'all' }),
      );

      effectOnce(
        () => !!this.#appStore.state.settings().language,
        () => this.#signalTranslateService.setLanguage(this.#appStore.state.settings().language),
      );

      const lastRun = this.#localStorageService.getItem('lastCleanupRun');
      if (!lastRun || dayjs().diff(lastRun, 'd') >= 1) {
        this.#cleanupWorkerService
          .runWorkerOnce()
          .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.#localStorageService.setItem('lastCleanupRun', dayjs().toISOString()));
      }
    }
  }

  public ngOnInit(): void {
    if (!this.blocked()) {
      this.#feedSyncWorkerService.createWorker();
      this.#blockerService.warningCheck();
    }
  }

  public onOpenMenu(): void {
    this.showSidebar = true;
  }
}
