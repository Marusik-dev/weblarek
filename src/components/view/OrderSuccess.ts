import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  orderAmount: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement(
      ".order-success__description",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("order:done");
    });
  }

  set orderAmount(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
