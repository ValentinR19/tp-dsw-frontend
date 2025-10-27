import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ProductService } from '@main-module/app/product/services/product.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-budget-product-search',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, TableModule],
  templateUrl: './budget-product-search.component.html',
})
export class BudgetProductSearchComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() productSelected = new EventEmitter<any>();

  searchTerm = '';
  products: any[] = [];

  private readonly productService = inject(ProductService);

  search() {
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
    });
  }

  selectProduct(product: any) {
    this.productSelected.emit(product);
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
