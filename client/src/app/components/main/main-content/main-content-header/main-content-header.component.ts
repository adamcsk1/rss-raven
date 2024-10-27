import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { MainContentHeaderService } from '@components/main/main-content/main-content-header/main-content-header.service';
import { ActivePathService } from '@services/active-path/active-path.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'rssr-main-content-header',
  standalone: true,
  imports: [ButtonModule, NgTemplateOutlet, TieredMenuModule, NgxSignalTranslatePipe],
  templateUrl: './main-content-header.component.html',
  styleUrl: './main-content-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MainContentHeaderService],
})
export class MainContentHeaderComponent {
  readonly #appStore = inject(appStateToken);
  readonly #router = inject(Router);
  readonly #mainContentHeaderService = inject(MainContentHeaderService);
  readonly #activePathService = inject(ActivePathService);
  public readonly openMenu = output<void>();
  public readonly pageTitle = this.#appStore.state.pageTitle;
  public readonly isNewsPage = computed(() => this.#activePathService.validate('/news', 'includes'));
  public readonly isFavoritesPage = computed(() => this.#activePathService.validate('/favorites'));
  public readonly hasReadFilter = computed(() => this.#activePathService.validate('/read'));
  public readonly hasUnreadFilter = computed(() => this.#activePathService.validate('/unread'));
  public readonly missingProxyConfig = computed(() => this.#appStore.state.blocker().proxyWarning);
  public readonly menuItems = this.#mainContentHeaderService.menuItems;
  public readonly filterMenuItems = this.#mainContentHeaderService.filterMenuItems;
  public showHelp = false;

  public onOpenMenu(): void {
    this.openMenu.emit();
  }

  public onNavigateBack(): void {
    this.#router.navigate(this.#appStore.state.pageBackPath());
  }

  public onOpenHelp(): void {
    this.showHelp = true;
  }
}
