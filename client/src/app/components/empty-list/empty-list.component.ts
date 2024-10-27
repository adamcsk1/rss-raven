import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LogoAutoContrastDirective } from '@directives/logo-auto-contrast.directive';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';

@Component({
  selector: 'rssr-empty-list',
  standalone: true,
  templateUrl: './empty-list.component.html',
  styleUrl: './empty-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoAutoContrastDirective, NgxSignalTranslatePipe],
})
export class EmptyListComponent {
  public readonly icon = input<string>();
}
