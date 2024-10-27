import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { asyncScheduler } from 'rxjs';

@Injectable()
export class ReloadService {
  readonly #androidBridgeService = inject(AndroidBridgeService);

  public reload(timeout = 500): void {
    asyncScheduler.schedule(() => {
      if (environment.type === 'android') this.#androidBridgeService.postNativeMessage({ event: 'reload', data: null });
      else window.location.reload();
    }, timeout);
  }
}
