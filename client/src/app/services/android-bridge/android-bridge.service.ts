import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AndroidBridgeMessage, getNativeMessage, JavascriptHandler } from '@services/android-bridge/android-bridge.interface';
import { filter, ReplaySubject, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AndroidBridgeService {
  #initialized = new ReplaySubject<boolean>(1);
  #javascriptHandler!: JavascriptHandler;
  #nativeMessages = new Subject<AndroidBridgeMessage>();
  public readonly nativeMessages$ = this.#nativeMessages.asObservable();

  public initialize(): void {
    const extendedWindow = window as typeof window & { RssrJavascriptHandler: JavascriptHandler; getNativeMessage: getNativeMessage };

    if (environment.type === 'android' && !extendedWindow.getNativeMessage && extendedWindow.RssrJavascriptHandler) {
      this.#javascriptHandler = extendedWindow.RssrJavascriptHandler;
      extendedWindow.getNativeMessage = (message: string) => {
        try {
          this.#nativeMessages.next(JSON.parse(message) as AndroidBridgeMessage);
        } catch {
          /* empty */
        }
      };
      this.#initialized.next(true);
    }
  }

  public postNativeMessage<T>(params: AndroidBridgeMessage<T>): void {
    if (environment.type === 'android') {
      this.#initialized
        .pipe(
          filter((status) => status),
          take(1),
        )
        .subscribe(() => this.#immediatelyPostNativeMessage(params));
    }
  }

  #immediatelyPostNativeMessage<T>(params: AndroidBridgeMessage<T>): void {
    this.#javascriptHandler.postNativeMessage(JSON.stringify(params));
  }
}
