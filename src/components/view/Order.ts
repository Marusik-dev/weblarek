import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrder {
  error: string;
  isSubmitEnabled: boolean;
}

export class Order<T> extends Component<IOrder & T> {
  protected formErrorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.formErrorElement = ensureElement(".form__errors", this.container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
  }

  set error(value: string) {
    this.formErrorElement.textContent = value;
  }

  set isSubmitEnabled(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
