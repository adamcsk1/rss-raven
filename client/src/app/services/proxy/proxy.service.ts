import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Proxy } from '@interfaces/proxy.interface';
import { PROXY_API_PATH } from '@services/proxy/proxy.constant';
import { appStateToken } from '@stores/app-state.constant';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class ProxyService {
  readonly #appStore = inject(appStateToken);
  readonly #httpClient = inject(HttpClient);
  get #proxyConfig(): Proxy {
    return this.#appStore.state.settings().proxy;
  }

  public getServerStatus(proxy?: Proxy): Observable<boolean> {
    this.#appStore.setState('spinnerLoading', true);
    const proxyConfig = proxy ? proxy : this.#proxyConfig;

    return this.#httpClient.get(`${proxyConfig.basePath}${PROXY_API_PATH}status`, { responseType: 'text', headers: this.#createHeader(proxyConfig) }).pipe(
      map((response: string) => response === 'OK'),
      catchError(() => of(false)),
      tap(() => this.#appStore.setState('spinnerLoading', false)),
    );
  }

  #createHeader(proxy?: Proxy): HttpHeaders {
    const proxyConfig = proxy ? proxy : this.#proxyConfig;
    return new HttpHeaders().set('Authorization', `Basic ${proxyConfig.token}`);
  }
}
