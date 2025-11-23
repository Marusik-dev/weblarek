import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Communication } from "./components/models/Communication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { Catalog } from "./components/view/Catalog";
import { IProduct, TPayment, IOrder } from "./types";
import { CatalogProductCard } from "./components/view/CatalogProductCard";
import { PreviewProductCard } from "./components/view/PreviewProductCard";
import { BasketProductCard } from "./components/view/BasketProductCard";
import { Basket } from "./components/view/Basket";
import { OrderAddress } from './components/view/OrderAddress';
import { OrderContacts } from './components/view/OrderContacts';
import { OrderSuccess } from './components/view/OrderSuccess';

// EventEmitter
const events = new EventEmitter();

// Модели
const products = new Products(events);
const buyer = new Buyer();
const cart = new Cart(events);
const api = new Api(API_URL);
const communication = new Communication(api);

// View компоненты
let header: Header;
let modal: Modal;
let basket: Basket;
let orderContacts: OrderContacts;
let orderAddress: OrderAddress;
let orderSuccess: OrderSuccess;
let previewProductCard: PreviewProductCard;

// Состояние приложения
let isBasketOpen = false;

// Presenter
const initApp = async (): Promise<void> => {
  initViews();
  initEventHandlers();
  
  await fetchProducts();
};

const initViews = (): void => {
  header = new Header(ensureElement(".header__container"), events);
  modal = new Modal(ensureElement("#modal-container"), events);
  basket = new Basket(cloneTemplate("#basket"), events);
  orderContacts = new OrderContacts(cloneTemplate('#contacts'), events);
  orderAddress = new OrderAddress(cloneTemplate('#order'), events);
  orderSuccess = new OrderSuccess(cloneTemplate('#success'), events);
  
  const previewContainer = cloneTemplate("#card-preview");
  const previewActions = {
    onClick: () => events.emit("product:preview:button:click", {} as IProduct),
  };
  previewProductCard = new PreviewProductCard(previewContainer, previewActions);
};

const initEventHandlers = (): void => {
  // Каталог
  events.on("catalog:change", handleCatalogChange);
  events.on("catalog:product:click", handleProductClick);
  
  // Модальное окно
  events.on("modal:close", handleModalClose);
  
  // Товары
  events.on("product:preview:button:click", handleProductButtonClick);
  
  // Корзина
  events.on("basket:change", handleBasketChange);
  events.on("basket:product:remove", handleBasketProductRemove);
  events.on("basket:create:order", handleBasketCreateOrder);
  events.on("basket:open", handleBasketOpen);
  
  // Заказ
  events.on("order:payment:change", handleOrderPaymentChange);
  events.on("order:address:change", handleOrderAddressChange);
  events.on("order:email:change", handleOrderEmailChange);
  events.on("order:phone:change", handleOrderPhoneChange);
  events.on("order:submit", handleOrderSubmit);
  events.on("order:done", handleOrderDone);
};

// Обработчики событий
const handleCatalogChange = (): void => {  
  const cards = products.getProducts().map((product) => {
    const container = cloneTemplate("#card-catalog");
    const actions = {
      onProductClick: () => events.emit("catalog:product:click", product),
    };

    const card = new CatalogProductCard(container, actions);
    return card.render(product);
  });

  const container = ensureElement(".gallery");
  container.replaceChildren();

  const catalog = new Catalog(container);
  catalog.render({ cards });
};

const handleProductClick = (product: IProduct): void => {
  const actions = {
    onClick: () => events.emit("product:preview:button:click", product),
  };
  
  previewProductCard.updateActions(actions);

  const isProductInCart = cart.hasItem(product.id);
  const buttonLabel = product.price
    ? isProductInCart
      ? "Удалить из корзины"
      : "Купить"
    : "Недоступно";
  const isButtonDisabled = !product.price;
  
  const content = previewProductCard.render({
    ...product,
    buttonLabel,
    isButtonDisabled,
  });

  modal.render({ content });
  modal.open();
};

const handleModalClose = (): void => {
  isBasketOpen = false;
  modal.close();
};

const handleProductButtonClick = (product: IProduct): void => {
  modal.close();

  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }
};

const getBasketContent = (): HTMLElement => {
  const items = cart.getItems().map((product, index) => {
    const container = cloneTemplate("#card-basket");
    const actions = {
      onRemoveItem: () => events.emit("basket:product:remove", product),
    };
    const card = new BasketProductCard(container, actions);
    return card.render({ ...product, index: index + 1 });
  });

  const orderAmount = cart.getTotalPrice();
  return basket.render({ items, orderAmount });
};

const handleBasketChange = (): void => {
  const counter = cart.getCount();
  header.render({ counter });

  const content = getBasketContent();

  if (isBasketOpen) {
    modal.render({ content });
  }
};

const handleBasketProductRemove = (product: IProduct): void => {
  cart.removeItem(product.id);
};

const handleBasketCreateOrder = (): void => {
  isBasketOpen = false;
  const content = getOrderAddressContent();
  modal.render({ content });
};

const handleBasketOpen = (): void => {
  const content = getBasketContent();
  modal.render({ content });
  modal.open();
  isBasketOpen = true;
};

const getOrderContactsContent = (): HTMLElement => {
  const data = buyer.getData();
  const { error = "", isValid } = buyer.validateContactsForm();
  return orderContacts.render({ ...data, error, isSubmitEnabled: isValid });
};

const getOrderAddressContent = (): HTMLElement => {
  const data = buyer.getData();
  const { error = "", isValid } = buyer.validateAddressForm();
  return orderAddress.render({ ...data, error, isSubmitEnabled: isValid });
};

// Обработчики заказа с мгновенной валидацией
const handleOrderPaymentChange = ({ payment }: { payment: TPayment }): void => {
  buyer.setPayment(payment);
  const { error = "", isValid } = buyer.validateAddressForm();
  orderAddress.setValidation(error, isValid);
  orderAddress.payment = payment;
};

const handleOrderAddressChange = ({ address }: { address: string }): void => {
  buyer.setAddress(address);
  const { error = "", isValid } = buyer.validateAddressForm();
  orderAddress.setValidation(error, isValid);
};

const handleOrderEmailChange = ({ email }: { email: string }): void => {
  buyer.setEmail(email);
  const { error = "", isValid } = buyer.validateContactsForm();
  orderContacts.setValidation(error, isValid);
};

const handleOrderPhoneChange = ({ phone }: { phone: string }): void => {
  buyer.setPhone(phone);
  const { error = "", isValid } = buyer.validateContactsForm();
  orderContacts.setValidation(error, isValid);
};

const createOrder = async (): Promise<void> => {
  try {
    // Подготавливаем данные для заказа
    const orderData: IOrder = {
      ...buyer.getData(),
      items: cart.getItems().map(item => item.id),
      total: cart.getTotalPrice()
    };

    // Отправляем заказ на сервер
    const orderResponse = await communication.createOrder(orderData);
    
    // Если заказ успешно создан
    const orderAmount = cart.getTotalPrice();
    cart.clear();
    buyer.removeData();

    const content = orderSuccess.render({ orderAmount });
    modal.render({ content });
    
    console.log('Заказ успешно создан:', orderResponse);   
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
  }
};

const handleOrderSubmit = ({ step }: { step: "address" | "contacts" }): void => {
  if (step === "address") {
    const content = getOrderContactsContent();
    modal.render({ content });
  } else if (step === "contacts") {
    createOrder();
  }
};

const handleOrderDone = (): void => {
  modal.close();
};

const fetchProducts = async (): Promise<void> => {
    const productsList = await communication.getProducts();
    products.setProducts(productsList);
};

// Инициализация приложения
document.addEventListener("DOMContentLoaded", async () => {
  await initApp();
});