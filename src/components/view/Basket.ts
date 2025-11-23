import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ICart {
  items: HTMLElement[];
  orderAmount: number;
}

export class Basket extends Component<ICart> {
  protected listElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected orderAmountElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement(".basket__list", this.container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.orderAmountElement = ensureElement(".basket__price", this.container);

    this.orderButton.addEventListener("click", () =>
      events.emit("basket:create:order")
    );
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren();

    if (value?.length) {
      this.listElement.append(...value);
      this.orderButton.disabled = false;
    } else {
      this.listElement.textContent = "Корзина пуста";
      this.orderButton.disabled = true;
    }
  }

  set orderAmount(value: number) {
    this.orderAmountElement.textContent = `${value} синапсов`;
  }
}
