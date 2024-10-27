import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';

const fileType = 'text/plain;charset=utf-8';

@Injectable()
export class DownloadService {
  readonly #androidBridgeService = inject(AndroidBridgeService);

  public saveAs(content: string, fileName: string, extension: string): void {
    fileName = `${fileName}-${dayjs().format('YYMDHms')}.${extension}`;

    if (environment.type === 'android') this.#androidBridgeService.postNativeMessage({ event: 'saveAs', data: { fileName, content: `data:${fileType},${btoa(encodeURIComponent(content))}` } });
    else {
      const blob = new Blob([content], { type: fileType });
      FileSaver.saveAs(blob, fileName);
    }
  }
}
