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

    if (this.productForm.invalid) {
      this.showValidationErrors();
      return;
    }

    this.productId ? this.update() : this.create();
  }

  private showValidationErrors(): void {
    const controls = this.productForm.controls;

    // Verificar cada campo y mostrar mensaje específico
    if (controls['name'].errors?.['required']) {
      this.messageService.showErrorMessage('El nombre del producto es obligatorio');
      return;
    }

    if (controls['productCategoryId'].errors?.['required']) {
      this.messageService.showErrorMessage('La categoría del producto es obligatoria');
      return;
    }

    if (controls['price'].errors?.['required']) {
      this.messageService.showErrorMessage('El precio del producto es obligatorio');
      return;
    }

    if (controls['price'].errors?.['min']) {
      this.messageService.showErrorMessage('El precio debe ser mayor a 0');
      return;
    }

    if (controls['currency'].errors?.['required']) {
      this.messageService.showErrorMessage('La moneda es obligatoria');
      return;
    }

    // Validaciones de longitud para nombre
    if (controls['name'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El nombre del producto debe tener al menos 4 caracteres');
      return;
    }

    if (controls['name'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('El nombre del producto no puede exceder los 50 caracteres');
      return;
    }

    // Validaciones de longitud para descripción (solo si se ingresó algo)
    if (controls['description'].errors?.['minlength']) {
      this.messageService.showErrorMessage('La descripción debe tener al menos 4 caracteres');
      return;
    }

    if (controls['description'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('La descripción no puede exceder los 255 caracteres');
      return;
    }

    // Mensaje genérico si hay otros errores
    this.messageService.showErrorMessage('Por favor, complete todos los campos obligatorios');
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
