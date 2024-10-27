export interface JavascriptHandler {
  postNativeMessage: (message: string) => void;
}

export type getNativeMessage = (message: string) => void;

export interface AndroidBridgeMessage<T = unknown> {
  event: 'backgroundSyncTime' | 'syncInProgress' | 'back' | 'toast' | 'saveAs' | 'reload' | 'backgroundSyncFinished' | 'language';
  data: T;
}
