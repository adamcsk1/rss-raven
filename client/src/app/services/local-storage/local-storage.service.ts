import { Injectable } from '@angular/core';
import { Keys } from '@services/local-storage/local-storage.interface';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public setItem(key: Keys, data: string): void {
    window.localStorage.setItem(key, data);
  }

  public getItem(key: Keys): string {
    return window.localStorage.getItem(key) || '';
  }
}
