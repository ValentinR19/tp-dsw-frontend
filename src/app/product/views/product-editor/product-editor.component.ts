import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { Product } from '../../models/classes/product.entity';
import { ProductService } from '../../services/product.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom, take } from 'rxjs';
import { ProductCategory } from '@main-module/app/product/models/classes/product-category.entity';
import { ProductCategoryService } from '@main-module/app/product/services/product-category.service';
import { ProductPrice } from '@main-module/app/product/models/classes/product-price.entity';
import { SelectModule } from 'primeng/select';
import { Currency } from 'src/app/shared/enums/currency.enum';

@Component({
  selector: 'app-product-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DividerModule, IftaLabelModule, ToggleSwitchModule, SelectModule],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
})
export class ProductEditorComponent implements OnInit {
  product: Product;
  productForm: FormGroup;
  productId: number;
  productCategories: ProductCategory[] = [];
  currencies = Object.values(Currency);

  private readonly productService: ProductService = inject(ProductService);
  private readonly porductCategoryService: ProductCategoryService = inject(ProductCategoryService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly messageService: MessageService = inject(MessageService);

  async ngOnInit(): Promise<void> {
    this.loadCategories();
    this.buildForm();
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.productId = Number(params['id']);
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product: Product) => {
          this.product = product;
          this.productForm.patchValue({ ...product, price: product.price.price, currency: product.price.currency });
        },
        error: (error) => {
          this.messageService.showErrorFromDTO(`Error al obtener el producto ${error}`);
        },
      });
    }
  }

  buildForm() {
    this.productForm = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      description: new FormControl<string | null>(null, [Validators.minLength(4), Validators.maxLength(255)]),
      productCategoryId: new FormControl<number | null>(null, [Validators.required]),
      price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
      currency: new FormControl<string | null>(null, [Validators.required]),
      isActive: new FormControl<boolean>(true),
    });
  }

  submit(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;

    this.productId ? this.update() : this.create();
  }

  create() {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (product: Product) => {
        this.messageService.showSuccessMessage('Producto creado correctamente');
        this.close();
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al crear el producto${error}`);
      },
    });
  }

  update() {
    this.productService.updateProduct({ id: this.productId, ...this.productForm.value }).subscribe({
      next: (product: Product) => {
        this.messageService.showSuccessMessage('Producto actualizado correctamente');
        this.close();
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al actualizar el producto ${error}`);
      },
    });
  }

  close(): void {
    this.router.navigate(['products/catalog']);
  }

  loadCategories(): void {
    this.porductCategoryService.getCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        this.productCategories = categories;
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al obtener las categorias de productos ${error}`);
      },
    });
  }
}
