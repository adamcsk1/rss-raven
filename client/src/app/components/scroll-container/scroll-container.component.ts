import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rssr-scroll-container',
  standalone: true,
  templateUrl: './scroll-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollContainerComponent {}
