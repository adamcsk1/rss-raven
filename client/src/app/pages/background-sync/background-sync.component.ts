import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rssr-background-sync',
  standalone: true,
  template: 'Rss Raven background sync task',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundSyncComponent {}
