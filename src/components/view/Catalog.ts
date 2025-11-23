import { Component } from "../base/Component";

interface ICatalog {
  cards: HTMLElement[]
}

export class Catalog extends Component<ICatalog> {

  constructor(container: HTMLElement) {
    super(container)
  }

  set cards(elements: HTMLElement[]) {
    elements.forEach(element => {
      this.container.appendChild(element)
    })
  }
}