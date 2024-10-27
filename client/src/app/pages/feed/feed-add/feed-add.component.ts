import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlErrorsComponent } from '@components/form-control-errors/form-control-errors.component';
import { PreventVirtualKeyboardDirective } from '@directives/prevent-virtual-keyboard.directive';
import { Form } from '@interfaces/form.interface';
import { FeedAdd } from '@pages/feed/feed-add/feed-add.interface';
import { FeedAddService } from '@pages/feed/feed-add/feed-add.service';
import { LastErrorPipe } from '@pipes/last-error.pipe';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { categoryTypeOptionsFactory } from '@utils/options/category-type-options.util';
import { conditionalRequiredValidator } from '@validators/conditional-required.validator';
import { urlValidator } from '@validators/url.validator';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'rssr-feed-add',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, PreventVirtualKeyboardDirective, DropdownModule, FormControlErrorsComponent, NgxSignalTranslatePipe],
  templateUrl: './feed-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedAddService, LastErrorPipe],
  host: { class: 'content-container' },
})
export class FeedAddComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #feedAddService = inject(FeedAddService);
  readonly #formBuilder = inject(FormBuilder);
  readonly #appStore = inject(appStateToken);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  public readonly formGroup = this.#formBuilder.group<Form<FeedAdd>>({
    url: this.#formBuilder.control('', { nonNullable: true, validators: [Validators.required, urlValidator] }),
    categoryType: this.#formBuilder.control('new', { nonNullable: true }),
    existingCategoryId: this.#formBuilder.control('', { nonNullable: true, validators: [conditionalRequiredValidator((): boolean => this.formGroup?.value?.categoryType === 'existing')] }),
    newCategoryName: this.#formBuilder.control('', { nonNullable: true, validators: [conditionalRequiredValidator((): boolean => this.formGroup?.value?.categoryType === 'new')] }),
  });
  public readonly categories = toSignal(this.#databaseCategoriesFacadeService.categories$);
  public readonly categoryTypeOptions = categoryTypeOptionsFactory();

  constructor() {
    this.#appStore.setState('pageTitle', 'FOLLOW_FEED');
    this.#appStore.setState('pageBackPath', ['/news']);

    this.formGroup.controls.categoryType.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.formGroup.controls.existingCategoryId.updateValueAndValidity();
      this.formGroup.controls.newCategoryName.updateValueAndValidity();
    });
  }

  public onAdd(): void {
    this.#feedAddService.feedAdd(this.formGroup.getRawValue());
  }
}
