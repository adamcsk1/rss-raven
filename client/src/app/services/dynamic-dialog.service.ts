import { inject, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class DynamicDialogService {
  readonly #dialogService = inject(DialogService);
  #dynamicDialogRef!: DynamicDialogRef | null;
  public readonly getInstance = <T = unknown>(ref: DynamicDialogRef<T>) => this.#dialogService.getInstance(ref);
  public get hasDialog(): boolean {
    return !!this.#dynamicDialogRef;
  }

  public open<T>(componentType: Type<T>, config: DynamicDialogConfig): DynamicDialogRef<T> {
    this.#dynamicDialogRef = this.#dialogService.open(componentType, config);
    return this.#dynamicDialogRef;
  }

  public close(): void {
    this.#dynamicDialogRef?.close();
    this.#dynamicDialogRef = null;
  }
}
