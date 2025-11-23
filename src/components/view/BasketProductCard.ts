import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";

interface IProductCart {
  index: number;
}

interface IActions {
  onRemoveItem: () => void;
}

export class BasketProductCard extends ProductCard<IProductCart> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions: IActions) {
    super(container);

    this.indexElement = ensureElement(".basket__item-index", this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.deleteButton.addEventListener("click", actions.onRemoveItem);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
