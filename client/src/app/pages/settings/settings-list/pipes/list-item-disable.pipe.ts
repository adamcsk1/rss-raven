import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingsItem } from '@pages/settings/settings-list/settings-list.interface';
import { appStateToken } from '@stores/app-state.constant';

@Pipe({
  name: 'listItemDisabled',
  standalone: true,
  pure: false,
})
export class ListItemDisabledPipe implements PipeTransform {
  readonly #appStore = inject(appStateToken);

  public transform(item: SettingsItem): boolean {
    const proxyWarning = this.#appStore.state.blocker().proxyWarning;
    const syncRunning = this.#appStore.state.syncInProgress();

    if (['opml-import', 'opml-export', 'reset', 'cleanup'].includes(item.key) && (proxyWarning || syncRunning)) return true;

    return false;
  }
}
