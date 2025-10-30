import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom, take } from 'rxjs';

import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { Currency } from 'src/app/shared/enums/currency.enum';
import { ProductCategory } from '../../models/classes/product-category.entity';
import { Product } from '../../models/classes/product.entity';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackButtonComponent, ButtonModule, DividerModule, IftaLabelModule, ToggleSwitchModule, SelectModule],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent implements OnInit {
  product: Product;
  productForm: FormGroup;
  productId: number;
  productCategories: ProductCategory[] = [];
  currencies = Object.values(Currency);

  private readonly productService = inject(ProductService);
  private readonly productCategoryService = inject(ProductCategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  async ngOnInit(): Promise<void> {
    this.loadCategories();
    this.buildForm();

    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.productId = Number(params['id']);

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product: Product) => {
          this.product = product;
          this.productForm.patchValue({
            ...product,
            price: Number(product.price?.price ?? 0),
            currency: product.price?.currency ?? null,
          });
        },
        error: (error) => {
          this.messageService.showErrorFromDTO(`Error al obtener el producto: ${error}`);
        },
      });
    }
  }

  private buildForm() {
    this.productForm = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      description: new FormControl<string | null>(null, [Validators.minLength(4), Validators.maxLength(255)]),
      productCategoryId: new FormControl<number | null>(null, [Validators.required]),
      price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
      currency: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  submit(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;
    this.productId ? this.update() : this.create();
  }

  private create() {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (product: Product) => {
        this.messageService.showSuccessMessage('Producto creado correctamente');
        this.close();
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al crear el producto: ${error}`);
      },
    });
  }

  private update() {
    this.productService.updateProduct({ id: this.productId, ...this.productForm.value }).subscribe({
      next: (product: Product) => {
        this.messageService.showSuccessMessage('Producto actualizado correctamente');
        this.close();
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al actualizar el producto: ${error}`);
      },
    });
  }

  close(): void {
    this.router.navigate(['products/catalog']);
  }

  private loadCategories(): void {
    this.productCategoryService.getCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        this.productCategories = categories;
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al obtener las categorías de productos: ${error}`);
      },
    });
  }
}
