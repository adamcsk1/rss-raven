import { Routes } from '@angular/router';
import { backgroundSyncGuard } from '@guards/background-sync.guard';
import { blockedGuard } from '@guards/blocked.guard';
import { proxySettingsGuard } from '@guards/proxy-settings.guard';

export const routes: Routes = [
  {
    path: 'background-sync',
    loadComponent: () => import('./pages/background-sync/background-sync.component').then((module) => module.BackgroundSyncComponent),
    canActivate: [backgroundSyncGuard],
  },
  {
    path: 'blocked',
    loadComponent: () => import('./pages/blocked/blocked.component').then((module) => module.BlockedComponent),
  },
  {
    path: 'about',
    canActivate: [blockedGuard],
    loadComponent: () => import('./pages/about/about.component').then((module) => module.AboutComponent),
  },
  {
    path: 'settings',
    canActivate: [blockedGuard],
    children: [
      {
        path: 'list',
        loadComponent: () => import('./pages/settings/settings-list/settings-list.component').then((module) => module.SettingsListComponent),
      },
      {
        path: 'proxy',
        loadComponent: () => import('./pages/settings/settings-proxy/settings-proxy.component').then((module) => module.SettingsProxyComponent),
        canActivate: [proxySettingsGuard],
      },
      {
        path: 'theme',
        loadComponent: () => import('./pages/settings/settings-theme/settings-theme.component').then((module) => module.SettingsThemeComponent),
      },
      {
        path: 'sync',
        loadComponent: () => import('./pages/settings/settings-sync/settings-sync.component').then((module) => module.SettingsSyncComponent),
      },
      {
        path: 'opml-import',
        loadComponent: () => import('./pages/settings/settings-opml-import/settings-opml-import.component').then((module) => module.SettingsOpmlImportComponent),
      },
      {
        path: 'opml-export',
        loadComponent: () => import('./pages/settings/settings-opml-export/settings-opml-export.component').then((module) => module.SettingsOpmlExportComponent),
      },
      {
        path: 'settings-import',
        loadComponent: () => import('./pages/settings/settings-import/settings-import.component').then((module) => module.SettingsImportComponent),
      },
      {
        path: 'settings-export',
        loadComponent: () => import('./pages/settings/settings-export/settings-export.component').then((module) => module.SettingsExportComponent),
      },
      {
        path: 'reset',
        loadComponent: () => import('./pages/settings/settings-reset/settings-reset.component').then((module) => module.SettingsResetComponent),
      },
      {
        path: 'cleanup',
        loadComponent: () => import('./pages/settings/settings-cleanup/settings-cleanup.component').then((module) => module.SettingsCleanupComponent),
      },
      {
        path: 'language',
        loadComponent: () => import('./pages/settings/settings-language/settings-language.component').then((module) => module.SettingsLanguageComponent),
      },
    ],
  },
  {
    path: 'feed',
    canActivate: [blockedGuard],
    children: [
      {
        path: 'add',
        loadComponent: () => import('./pages/feed/feed-add/feed-add.component').then((module) => module.FeedAddComponent),
      },
      {
        path: 'edit/:feedId',
        loadComponent: () => import('./pages/feed/feed-edit/feed-edit.component').then((module) => module.FeedEditComponent),
      },
    ],
  },
  {
    path: 'category',
    canActivate: [blockedGuard],
    children: [
      {
        path: 'edit/:categoryId',
        loadComponent: () => import('./pages/category/category-edit/category-edit.component').then((module) => module.CategoryEditComponent),
      },
    ],
  },
  {
    path: 'news',
    canActivate: [blockedGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
      {
        path: 'feed/:feedId',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
      {
        path: 'category/:categoryId',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
      {
        path: ':filter',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
      {
        path: 'feed/:feedId/:filter',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
      {
        path: 'category/:categoryId/:filter',
        loadComponent: () => import('./pages/news/news.component').then((module) => module.NewsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'news',
  },
];
