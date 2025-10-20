import { ProductCategory } from 'src/app/product/models/classes/product-category.entity';
import { ProductPrice } from 'src/app/product/models/classes/product-price.entity';
export class Product {
  id: number;
  productCategoryId: number;
  name: string;
  description: string;
  productCategory?: ProductCategory;
<<<<<<< HEAD
  //price: ProductPrice;
}
=======
  productPrice: ProductPrice;
  }
>>>>>>> 17380f2c40f12f407c6ed8e9dfe8c7f62153be11
