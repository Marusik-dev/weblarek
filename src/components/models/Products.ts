import { IProduct } from "../../types";
import { EventEmitter } from '../base/Events';

export class Products {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: EventEmitter;

  constructor(events: EventEmitter, products: IProduct[] = []) {
    this.events = events;
    this.products = products;
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:change");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:preview:render");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}