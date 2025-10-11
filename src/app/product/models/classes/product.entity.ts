import { ProductCategory } from 'src/app/product/models/classes/product-category.entity';
import { ProductPrice } from 'src/app/product/models/classes/product-price.entity';
export class Product {
  id: number;
  productCategoryId: number;
  name: string;
  description: string;
  productCategory?: ProductCategory;
  productPrice: ProductPrice;
  }