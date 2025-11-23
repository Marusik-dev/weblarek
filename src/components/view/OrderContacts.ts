import { ensureElement } from "../../utils/utils";
import { Order } from "./Order";
import { IEvents } from "../base/Events";

interface IOrderContacts {
  phone: string;
  email: string;
}

export class OrderContacts extends Order<IOrderContacts> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInputElement.addEventListener("change", (e) => {
      const email = (e.target as HTMLInputElement)?.value;
      events.emit("order:email:change", { email });
    });

    this.phoneInputElement.addEventListener("change", (e) => {
      const phone = (e.target as HTMLInputElement)?.value;
      events.emit("order:phone:change", { phone });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      events.emit("order:submit", { step: "contacts" });
    });
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }
}
