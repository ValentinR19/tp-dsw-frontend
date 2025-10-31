import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@main-module/app/product/services/product.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-budget-product-search',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TableModule, FormsModule, DividerModule],
  templateUrl: './budget-product-search.component.html',
})
export class BudgetProductSearchComponent {
  searchTerm = '';
  products: any[] = [];
  selectedProducts: any[] = [];
  loading = false;

  private tempIdCounter = 0;
  private readonly productService = inject(ProductService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  ngOnInit() {
    this.search();
  }

  search() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  addProduct(product: any) {
    const uniqueProduct = { ...product, tempId: ++this.tempIdCounter };
    this.selectedProducts.push(uniqueProduct);
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter((p) => p.tempId !== product.tempId);
  }

  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  close() {
    this.ref.close(null);
  }

  trackByTempId(index: number, item: any) {
    return item.tempId;
  }
}
