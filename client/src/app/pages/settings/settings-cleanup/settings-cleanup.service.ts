import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { ToastService } from '@services/toast.service';
import { CleanupWorkerService } from '@services/workers/cleanup-worker.service';
import { appStateToken } from '@stores/app-state.constant';
import dayjs from 'dayjs';
import { take } from 'rxjs';

@Injectable()
export class SettingsCleanupExportService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #cleanupWorkerService = inject(CleanupWorkerService);
  readonly #localStorageService = inject(LocalStorageService);
  readonly #toastService = inject(ToastService);
  readonly #confirmationFacadeService = inject(ConfirmationFacadeService);
  readonly #lastCleanupRun = signal(this.#localStorageService.getItem('lastCleanupRun'));
  public readonly lastCleanupRun = this.#lastCleanupRun;

  public cleanup(): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_CLEANUP' }, 'DATA_CLEANUP', () => this.#cleanup());
  }

  public cleanupByFeedId(feedId: string, feedName: string): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_CLEANUP_FEED', params: { name: feedName } }, 'DATA_CLEANUP', () => this.#cleanup(feedId));
  }

  #cleanup(feedId?: string): void {
    this.#appStore.setState('blockerLoading', true);
    this.#cleanupWorkerService
      .runWorkerOnce(true, feedId)
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((message) => {
        this.#appStore.setState('blockerLoading', false);
        if (message.status === 'SUCCESS') {
          if (!feedId) {
            const date = dayjs().toISOString();
            this.#localStorageService.setItem('lastCleanupRun', date);
            this.#lastCleanupRun.set(date);
          }
          this.#toastService.showSuccess({ key: 'MESSAGE_CLEANUP_FINISHED' });
        } else this.#toastService.showError({ key: `MESSAGE_WORKER_${message.status}` });
      });
  }
}
