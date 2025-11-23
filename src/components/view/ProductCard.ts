import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IProductCard {
  title: string;
  price: number | null;
}

export class ProductCard<T> extends Component<IProductCard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageAlt: string;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.priceElement = ensureElement<HTMLButtonElement>(
      ".card__price",
      this.container
    );
    this.imageAlt = "";
  }

  set title(value: string) {
    this.titleElement.textContent = value;
    this.imageAlt = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value ? `${value} синапсов` : "Бесценно";
  }
}
