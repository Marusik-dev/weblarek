import { ensureElement } from "../../utils/utils";
import { Order } from "./Order";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderAddress {
  payment: TPayment;
  address: string;
}

export class OrderAddress extends Order<IOrderAddress> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInputElement: HTMLInputElement;
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container
    );
    this.addressInputElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );
    this.errorElement = ensureElement('.form__errors', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);

    this.cardButton.addEventListener("click", () => {
      events.emit("order:payment:change", { payment: "card" });
    });

    this.cashButton.addEventListener("click", () => {
      events.emit("order:payment:change", { payment: "cash" });
    });

    this.addressInputElement.addEventListener("input", (e) => {
      const address = (e.target as HTMLInputElement)?.value;
      events.emit("order:address:change", { address });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      events.emit("order:submit", { step: "address" });
    });
  }

  set payment(value: TPayment) {   
    if (value === "card") {
      this.cardButton.classList.toggle("button_alt-active", true);
      this.cashButton.classList.toggle("button_alt-active", false);
    }

    if (value === "cash") {
      this.cashButton.classList.toggle("button_alt-active", true);
      this.cardButton.classList.toggle("button_alt-active", false);
    }
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  }

  setValidation(error: string, isSubmitEnabled: boolean): void {
    this.errorElement.textContent = error;
    this.submitButton.disabled = !isSubmitEnabled;
  }
}