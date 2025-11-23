import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";
import { setCategoryElement, setImageElement } from "../../utils/ProductUtils";

interface IProductCard {
  category: string;
  image: string;
}

interface IActions {
  onProductClick: () => void;
}

export class CatalogProductCard extends ProductCard<IProductCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    this.categoryElement = ensureElement(".card__category", this.container);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.container.addEventListener("click", actions.onProductClick);
  }

  set category(value: string) {
    setCategoryElement(this.categoryElement, value);
  }

  set image(value: string) {
    setImageElement({ element: this.imageElement, value, alt: this.imageAlt });
  }
}
