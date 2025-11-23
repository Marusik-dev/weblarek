import { IProduct } from "../../types";

export class Products {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(products: IProduct[] = []) {
    this.products = products;
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
