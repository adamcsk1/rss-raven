import { inject, Injectable } from '@angular/core';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { DynamicDialogService } from '@services/dynamic-dialog.service';
import { filter } from 'rxjs';

@Injectable()
export class AndroidBridgeEventsService {
  readonly #androidBridgeService = inject(AndroidBridgeService);
  readonly #dynamicDialogService = inject(DynamicDialogService);
  #initialized = false;

  public initialize(): void {
    if (!this.#initialized) {
      this.#initialized = true;
      this.#addBackListener();
    }
  }

  #addBackListener(): void {
    this.#androidBridgeService.nativeMessages$.pipe(filter((message) => message.event === 'back')).subscribe(() => {
      if (this.#dynamicDialogService.hasDialog) this.#dynamicDialogService.close();
      else history.back();
    });
  }
}
