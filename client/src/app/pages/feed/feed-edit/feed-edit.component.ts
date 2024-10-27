import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormControlErrorsComponent } from '@components/form-control-errors/form-control-errors.component';
import { PreventVirtualKeyboardDirective } from '@directives/prevent-virtual-keyboard.directive';
import { Form } from '@interfaces/form.interface';
import { FeedEdit } from '@pages/feed/feed-edit/feed-edit.interface';
import { FeedEditService } from '@pages/feed/feed-edit/feed-edit.service';
import { LastErrorPipe } from '@pipes/last-error.pipe';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { categoryTypeOptionsFactory } from '@utils/options/category-type-options.util';
import { conditionalRequiredValidator } from '@validators/conditional-required.validator';
import { urlValidator } from '@validators/url.validator';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { take } from 'rxjs';

@Component({
  selector: 'rssr-feed-edit',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    PreventVirtualKeyboardDirective,
    DropdownModule,
    DatePipe,
    CheckboxModule,
    FormControlErrorsComponent,
    NgxSignalTranslatePipe,
    LastErrorPipe,
  ],
  templateUrl: './feed-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationFacadeService, FeedEditService],
  host: { class: 'content-container' },
})
export class FeedEditComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #appStore = inject(appStateToken);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #route = inject(ActivatedRoute);
  readonly #feedEditService = inject(FeedEditService);
  public readonly formGroup = this.#formBuilder.group<Form<FeedEdit>>({
    url: this.#formBuilder.control('', { nonNullable: true, validators: [Validators.required, urlValidator] }),
    id: this.#formBuilder.control('', { nonNullable: true }),
    name: this.#formBuilder.control('', { nonNullable: true, validators: [Validators.required] }),
    categoryId: this.#formBuilder.control('', { nonNullable: true, validators: [conditionalRequiredValidator((): boolean => this.formGroup?.value?.categoryType === 'existing')] }),
    icon: this.#formBuilder.control('', { nonNullable: true, validators: [urlValidator] }),
    lastSync: this.#formBuilder.control('', { nonNullable: true }),
    lastError: this.#formBuilder.control('', { nonNullable: true }),
    categoryType: this.#formBuilder.control('existing', { nonNullable: true }),
    newCategoryName: this.#formBuilder.control('', { nonNullable: true, validators: [conditionalRequiredValidator((): boolean => this.formGroup?.value?.categoryType === 'new')] }),
    hidden: this.#formBuilder.control(false, { nonNullable: true }),
  });
  public readonly categories = toSignal(this.#databaseCategoriesFacadeService.categories$);
  public readonly categoryTypeOptions = categoryTypeOptionsFactory();

  constructor() {
    const feedId = this.#route.snapshot.paramMap.get('feedId') || '';

    this.#appStore.setState('pageTitle', 'EDIT_FEED');
    this.#appStore.setState('pageBackPath', ['/news', 'feed', feedId]);

    this.#databaseFeedsFacadeService
      .feedById(feedId)
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((feedData) => this.formGroup.patchValue(feedData));

    this.formGroup.controls.categoryType.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.formGroup.controls.categoryId.updateValueAndValidity();
      this.formGroup.controls.newCategoryName.updateValueAndValidity();
    });
  }

  public onSave(): void {
    this.#feedEditService.feedUpdate(this.formGroup.getRawValue());
  }

  public onDelete(): void {
    this.#feedEditService.confirmFeedDelete(this.formGroup.getRawValue());
  }
}
