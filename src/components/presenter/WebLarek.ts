import { Products } from "../models/Products";
import { Buyer } from "../models/Buyer";
import { Cart } from "../models/Cart";
import { Communication } from "../models/Communication";
import { Api } from "../base/Api";
import { API_URL } from "../../utils/constants";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { Header } from "../view/Header";
import { Modal } from "../view/Modal";
import { Catalog } from "../view/Catalog";
import { IProduct, TPayment } from "../../types";
import { CatalogProductCard } from "../view/CatalogProductCard";
import { PreviewProductCard } from "../view/PreviewProductCard";
import { BasketProductCard } from "../view/BasketProductCard";
import { Basket } from "../view/Basket";
import { OrderAddress } from "../view/OrderAddress";
import { OrderContacts } from "../view/OrderContacts";
import { OrderSuccess } from "../view/OrderSuccess";

export class WebLarek {
  private products: Products;
  private buyer: Buyer;
  private cart: Cart;
  private communication: Communication;
  private events: EventEmitter;

  private header!: Header;
  private modal!: Modal;
  private basket!: Basket;
  private orderContacts!: OrderContacts;
  private orderAddress!: OrderAddress;
  private orderSuccess!: OrderSuccess;

  private isBasketOpen: boolean = false;

  constructor() {
    this.events = new EventEmitter();
    this.products = new Products();
    this.buyer = new Buyer();
    this.cart = new Cart();

    const api = new Api(API_URL);
    this.communication = new Communication(api);

    this.initViews();
    this.initEventHandlers();
  }

  private initViews(): void {
    // view компоненты
    this.header = new Header(ensureElement(".header__container"), this.events);
    this.modal = new Modal(ensureElement("#modal-container"), this.events);
    this.basket = new Basket(cloneTemplate("#basket"), this.events);
    this.orderContacts = new OrderContacts(
      cloneTemplate("#contacts"),
      this.events
    );
    this.orderAddress = new OrderAddress(cloneTemplate("#order"), this.events);
    this.orderSuccess = new OrderSuccess(
      cloneTemplate("#success"),
      this.events
    );
  }

  private initEventHandlers(): void {
    // Каталог
    this.events.on("catalog:change", this.handleCatalogChange.bind(this));
    this.events.on("catalog:product:click", this.handleProductClick.bind(this));

    // Модальное окно
    this.events.on("modal:close", this.handleModalClose.bind(this));

    // Товары
    this.events.on(
      "product:details:button:click",
      this.handleProductButtonClick.bind(this)
    );

    // Корзина
    this.events.on("basket:change", this.handleBasketChange.bind(this));
    this.events.on(
      "basket:product:remove",
      this.handleBasketProductRemove.bind(this)
    );
    this.events.on(
      "basket:create:order",
      this.handleBasketCreateOrder.bind(this)
    );
    this.events.on("basket:open", this.handleBasketOpen.bind(this));

    // Заказ
    this.events.on(
      "order:payment:change",
      this.handleOrderPaymentChange.bind(this)
    );
    this.events.on(
      "order:address:change",
      this.handleOrderAddressChange.bind(this)
    );
    this.events.on(
      "order:email:change",
      this.handleOrderEmailChange.bind(this)
    );
    this.events.on(
      "order:phone:change",
      this.handleOrderPhoneChange.bind(this)
    );
    this.events.on("order:submit", this.handleOrderSubmit.bind(this));
    this.events.on("order:done", this.handleOrderDone.bind(this));
  }

  private handleCatalogChange(): void {
    const cards = this.products.getProducts().map((product) => {
      const container = cloneTemplate("#card-catalog");
      const actions = {
        onProductClick: () =>
          this.events.emit("catalog:product:click", product),
      };

      const card = new CatalogProductCard(container, actions);
      return card.render(product);
    });

    const container = ensureElement(".gallery");
    container.replaceChildren();

    const catalog = new Catalog(container);
    catalog.render({ cards });
  }

  private handleProductClick(product: IProduct): void {
    const container = cloneTemplate("#card-preview");
    const actions = {
      onClick: () => this.events.emit("product:details:button:click", product),
    };

    const details = new PreviewProductCard(container, actions);
    const isProductInCart = this.cart.hasItem(product.id);
    const buttonLabel = product.price
      ? isProductInCart
        ? "Удалить из корзины"
        : "Купить"
      : "Недоступно";
    const isButtonDisabled = !product.price;
    const content = details.render({
      ...product,
      buttonLabel,
      isButtonDisabled,
    });

    this.modal.render({ content });
    this.modal.open();
  }

  private handleModalClose(): void {
    this.isBasketOpen = false;
    this.modal.close();
  }

  private handleProductButtonClick(product: IProduct): void {
    this.modal.close();

    if (this.cart.hasItem(product.id)) {
      this.cart.removeItem(product.id);
    } else {
      this.cart.addItem(product);
    }

    this.events.emit("basket:change");
  }

  private getBasketContent(): HTMLElement {
    const items = this.cart.getItems().map((product, index) => {
      const container = cloneTemplate("#card-basket");
      const actions = {
        onRemoveItem: () => this.events.emit("basket:product:remove", product),
      };
      const card = new BasketProductCard(container, actions);
      return card.render({ ...product, index: index + 1 });
    });

    const orderAmount = this.cart.getTotalPrice();
    return this.basket.render({ items, orderAmount });
  }

  private handleBasketChange(): void {
    const counter = this.cart.getCount();
    this.header.render({ counter });

    if (this.isBasketOpen) {
      const content = this.getBasketContent();
      this.modal.render({ content });
    }
  }

  private handleBasketProductRemove(product: IProduct): void {
    this.cart.removeItem(product.id);
    this.events.emit("basket:change");
  }

  private handleBasketCreateOrder(): void {
    this.isBasketOpen = false;
    const content = this.getOrderAddressContent();
    this.modal.render({ content });
  }

  private handleBasketOpen(): void {
    const content = this.getBasketContent();
    this.modal.render({ content });
    this.modal.open();
    this.isBasketOpen = true;
  }

  private getOrderContactsContent(): HTMLElement {
    const data = this.buyer.getData();
    const { error = "", isValid } = this.buyer.validateContactsForm();
    return this.orderContacts.render({
      ...data,
      error,
      isSubmitEnabled: isValid,
    });
  }

  private getOrderAddressContent(): HTMLElement {
    const data = this.buyer.getData();
    const { error = "", isValid } = this.buyer.validateAddressForm();
    return this.orderAddress.render({
      ...data,
      error,
      isSubmitEnabled: isValid,
    });
  }

  private handleOrderPaymentChange({ payment }: { payment: TPayment }): void {
    this.buyer.setPayment(payment);
    const content = this.getOrderAddressContent();
    this.modal.render({ content });
  }

  private handleOrderAddressChange({ address }: { address: string }): void {
    this.buyer.setAddress(address);
    const content = this.getOrderAddressContent();
    this.modal.render({ content });
  }

  private handleOrderEmailChange({ email }: { email: string }): void {
    this.buyer.setEmail(email);
    const content = this.getOrderContactsContent();
    this.modal.render({ content });
  }

  private handleOrderPhoneChange({ phone }: { phone: string }): void {
    this.buyer.setPhone(phone);
    const content = this.getOrderContactsContent();
    this.modal.render({ content });
  }

  private createOrder(): void {
    const orderAmount = this.cart.getTotalPrice();
    this.cart.clear();
    this.buyer.removeData();

    const content = this.orderSuccess.render({ orderAmount });
    this.modal.render({ content });
  }

  private handleOrderSubmit({ step }: { step: "address" | "contacts" }): void {
    if (step === "address") {
      const content = this.getOrderContactsContent();
      this.modal.render({ content });
    } else if (step === "contacts") {
      this.createOrder();
    }
  }

  private handleOrderDone(): void {
    this.modal.close();
  }

  // Публичные методы
  public async init(): Promise<void> {
    await this.fetchProducts();
  }

  private async fetchProducts(): Promise<void> {
    try {
      const productsList = await this.communication.getProducts();
      this.products.setProducts(productsList);
      this.events.emit("catalog:change");
      console.log("Данные каталога успешно получены с сервера");
    } catch (e) {
      console.log("Ошибка получения каталога с сервера " + e);
    }
  }
}
