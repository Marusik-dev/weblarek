import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.contentElement = ensureElement(".modal__content", this.container);

    this.closeButton.addEventListener("click", () =>
      events.emit("modal:close")
    );
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        events.emit("modal:close");
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren();
    this.contentElement.appendChild(value);
  }

  open() {
    this.container.classList.toggle("modal_active", true);
  }

  close() {
    this.container.classList.toggle("modal_active", false);
  }
}
