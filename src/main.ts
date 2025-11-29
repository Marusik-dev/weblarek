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
const views: {
  header?: Header;
  modal?: Modal;
  basket?: Basket;
  orderContacts?: OrderContacts;
  orderAddress?: OrderAddress;
  orderSuccess?: OrderSuccess;
  previewProductCard?: PreviewProductCard;
} = {};

// Presenter
const initApp = async (): Promise<void> => {
  initViews();
  initEventHandlers();
  
  await fetchProducts();
};

const initViews = (): void => {
  views.header = new Header(ensureElement(".header__container"), events);
  views.modal = new Modal(ensureElement("#modal-container"), events);
  views.basket = new Basket(cloneTemplate("#basket"), events);
  views.orderContacts = new OrderContacts(cloneTemplate('#contacts'), events);
  views.orderAddress = new OrderAddress(cloneTemplate('#order'), events);
  views.orderSuccess = new OrderSuccess(cloneTemplate('#success'), events);
  
  const previewContainer = cloneTemplate("#card-preview");
  const previewActions = {
    onClick: () => {
      const product = products.getSelectedProduct();
      if (product) {
        events.emit("product:preview:button:click", product);
      }
    },
  };
  views.previewProductCard = new PreviewProductCard(previewContainer, previewActions);
};

const initEventHandlers = (): void => {
  // Каталог
  events.on("catalog:change", handleCatalogChange);
  events.on("catalog:product:click", handleProductClick);
  
  // Модальное окно
  events.on("modal:close", handleModalClose);
  
  // Товары
  events.on("product:preview:render", handleProductPreviewRender);
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
      onProductClick: () => {
        events.emit("catalog:product:click", product);
      },
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
  products.setSelectedProduct(product);
};

const handleProductPreviewRender = (): void => {
  const product = products.getSelectedProduct();
  
  if (!product) return;

  const actions = {
    onClick: () => {
      events.emit("product:preview:button:click", product);
    },
  };
  
  views.previewProductCard!.updateActions(actions);

  const isProductInCart = cart.hasItem(product.id);
  const buttonLabel = product.price
    ? isProductInCart
      ? "Удалить из корзины"
      : "Купить"
    : "Недоступно";
  const isButtonDisabled = !product.price;
  
  const content = views.previewProductCard!.render({
    ...product,
    buttonLabel,
    isButtonDisabled,
  });

  views.modal!.render({ content });
  views.modal!.open();
};

const handleModalClose = (): void => {
  views.modal!.close();
};

const handleProductButtonClick = (product: IProduct): void => {
  views.modal!.close();

  if (cart.hasItem(product.id)) {
    cart.removeItem(product.id);
  } else {
    cart.addItem(product);
  }
};

const handleBasketChange = (): void => {
  const counter = cart.getCount();
  views.header!.render({ counter });

  const items = cart.getItems().map((product, index) => {
    const container = cloneTemplate("#card-basket");
    const actions = {
      onRemoveItem: () => {
        events.emit("basket:product:remove", product);
      },
    };
    const card = new BasketProductCard(container, actions);
    return card.render({ ...product, index: index + 1 });
  });

  const orderAmount = cart.getTotalPrice();
  views.basket!.render({ items, orderAmount });
};

const handleBasketProductRemove = (product: IProduct): void => {
  cart.removeItem(product.id);
};

const handleBasketCreateOrder = (): void => {
  const content = getOrderAddressContent();
  views.modal!.render({ content });
};

const handleBasketOpen = (): void => {
  views.modal!.render({ content: views.basket!.render() });
  views.modal!.open();
};

const getOrderContactsContent = (): HTMLElement => {
  const data = buyer.getData();
  const { error = "", isValid } = buyer.validateContactsForm();
  return views.orderContacts!.render({ ...data, error, isSubmitEnabled: isValid });
};

const getOrderAddressContent = (): HTMLElement => {
  const data = buyer.getData();
  const { error = "", isValid } = buyer.validateAddressForm();
  return views.orderAddress!.render({ ...data, error, isSubmitEnabled: isValid });
};

const handleOrderPaymentChange = ({ payment }: { payment: TPayment }): void => {
  buyer.setPayment(payment);
  const { error = "", isValid } = buyer.validateAddressForm();
  views.orderAddress!.setValidation(error, isValid);
  views.orderAddress!.payment = payment;
};

const handleOrderAddressChange = ({ address }: { address: string }): void => {
  buyer.setAddress(address);
  const { error = "", isValid } = buyer.validateAddressForm();
  views.orderAddress!.setValidation(error, isValid);
};

const handleOrderEmailChange = ({ email }: { email: string }): void => {
  buyer.setEmail(email);
  const { error = "", isValid } = buyer.validateContactsForm();
  views.orderContacts!.setValidation(error, isValid);
};

const handleOrderPhoneChange = ({ phone }: { phone: string }): void => {
  buyer.setPhone(phone);
  const { error = "", isValid } = buyer.validateContactsForm();
  views.orderContacts!.setValidation(error, isValid);
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
    const orderAmount = orderResponse.total;
    cart.clear();
    buyer.removeData();

    const content = views.orderSuccess!.render({ orderAmount });
    views.modal!.render({ content });
    
    console.log('Заказ успешно создан:', orderResponse);   
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
  }
};

const handleOrderSubmit = ({ step }: { step: "address" | "contacts" }): void => {
  if (step === "address") {
    const content = getOrderContactsContent();
    views.modal!.render({ content });
  } else if (step === "contacts") {
    createOrder();
  }
};

const handleOrderDone = (): void => {
  views.modal!.close();
};

const fetchProducts = async (): Promise<void> => {
  try {
    const productsList = await communication.getProducts();
    products.setProducts(productsList);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
};

// Инициализация приложения 
document.addEventListener("DOMContentLoaded", async () => { 
  await initApp();
});