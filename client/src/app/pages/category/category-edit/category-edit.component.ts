import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@interfaces/category.interface';
import { Form } from '@interfaces/form.interface';
import { CategoryEditService } from '@pages/category/category-edit/category-edit.service';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { take } from 'rxjs';

@Component({
  selector: 'rssr-category-edit',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, CheckboxModule, NgxSignalTranslatePipe],
  templateUrl: './category-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationFacadeService, CategoryEditService],
  host: { class: 'content-container' },
})
export class CategoryEditComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #appStore = inject(appStateToken);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #route = inject(ActivatedRoute);
  readonly #categoryEditService = inject(CategoryEditService);
  public readonly formGroup = this.#formBuilder.group<Form<Category>>({
    id: this.#formBuilder.control('', { nonNullable: true }),
    name: this.#formBuilder.control('', { nonNullable: true, validators: [Validators.required] }),
    hidden: this.#formBuilder.control(false, { nonNullable: true }),
  });

  constructor() {
    const categoryId = this.#route.snapshot.paramMap.get('categoryId') || '';

    this.#appStore.setState('pageTitle', 'EDIT_CATEGORY');
    this.#appStore.setState('pageBackPath', ['/news', 'category', categoryId]);

    this.#databaseCategoriesFacadeService
      .categoryById(categoryId)
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe((categoryData) => this.formGroup.patchValue(categoryData));
  }

  public onSave(): void {
    this.#categoryEditService.categoryUpdate(this.formGroup.getRawValue());
  }

  public onDelete(): void {
    this.#categoryEditService.confirmCategoryDelete(this.formGroup.getRawValue());
  }
}
