import { ProductCategory } from 'src/app/product/models/classes/product-category.entity';
export class Product {
  id: number;
  productCategoryId: number;
  name: string;
  description: string;
  productCategory?: ProductCategory;
  //price: ProductPrice;
  }