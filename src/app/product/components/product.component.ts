import { Component, OnInit } from '@angular/core';
import { Product } from '@main-module/app/product/models/classes/product.entity';
import { ProductService } from 'src/app/product/services/product.service';
@Component({
  selector: 'app-products',
  templateUrl: './product.component.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productservice: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productservice.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addProduct() {
    const nuevo: Product = {
      name: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
    };

    this.productservice.createProduct(nuevo).subscribe((res) => {
      this.products.push(res);
    });
  }
}
