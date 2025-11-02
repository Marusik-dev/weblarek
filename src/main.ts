import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Communication } from './components/models/Communication';
import { apiProducts, apiBuyer } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const products = new Products();
const buyer = new Buyer();
const cart = new Cart();
const api = new Api(API_URL);
const communication = new Communication(api);

class TestProduct {
  constructor() {
    console.log('Тестирование модели Products');
    this.testProductsModel();
  }

  private testProductsModel(): void {
    const productsModel = new Products();
    productsModel.setProducts(apiProducts.items); 
    console.log('Массив товаров из каталога: ', productsModel.getProducts());

    const productId = '854cef69-976d-4c2a-a18c-2aa45046c390';
    const product = productsModel.getProductById(productId);
    console.log('Выбор товара по id: товар с id=' + productId + ':', product);

    if (product) {
        productsModel.setSelectedProduct(product);
        console.log('Товар ' + productId + ' установлен как выбранный');
    }

    const selectedProduct = productsModel.getSelectedProduct();
    console.log('Выбранный товар:', selectedProduct);

    console.log('Тест модели Products завершен');
  }
}

class TestBuyer {
  constructor() {
    console.log('Тестирование модели Buyer');
    this.testBuyerModel();
  }

  private testBuyerModel(): void {
    const buyerModel = new Buyer();
    console.log('Получение данных покупателя: ', buyerModel.getData());
    console.log('Обновление данных покупателя');
    buyerModel.setData({
      "payment": "",
      "email": "new@email.com",
      "phone": "2223322",
      "address": "крыша в Стокгольме"
    });
    console.log('Получение обновленных данных покупателя: ', buyerModel.getData());
    console.log('Очищение данных покупателя');
    buyerModel.clear();
    console.log('Получение данных покупателя после очищения: ', buyerModel.getData());

    console.log('Тестирование валидации');
    buyerModel.setData({
      "payment": "card",
      "email": "new@email.com",
      "phone": "2223322",
      "address": "крыша в Стокгольме"
    });
    const validValidation = buyerModel.validate();
    console.log('Результат validate():', validValidation);
    console.log('Результат isValid:', buyerModel.isValid);
  }
}

class TestCart {
  constructor() {
    console.log('Тестирование модели Cart');
    this.testCartModel();
  }

  private testCartModel(): void {
    const testProducts = apiProducts.items;
    const cartModel = new Cart();

    console.log('Пустая корзина:', cartModel.getItems());
    console.log('Количество товаров:', cartModel.getCount());
    console.log('Общая стоимость:', cartModel.getTotalPrice());

    console.log('Добавление 1го товара в корзину');
    cartModel.addItem(testProducts[0]);
    console.log('После добавления 1го товара:', cartModel.getItems());
    console.log('Количество:', cartModel.getCount());
    console.log('Цена:', cartModel.getTotalPrice());

    console.log('Добавление 2го товара в корзину');
    cartModel.addItem(testProducts[1]);
    console.log('После добавления 2го товара:', cartModel.getItems());
    console.log('Количество:', cartModel.getCount());
    console.log('Цена:', cartModel.getTotalPrice());

    console.log('Удаления 1 товара');
    cartModel.removeItem(testProducts[1]);
    console.log('После удаления товара:', cart.getItems());
    console.log('Количество:', cartModel.getCount());
    console.log('Цена:', cartModel.getTotalPrice());

    console.log('Наличие товара товара');
    console.log('Товар в корзине:', cartModel.hasItem("854cef69-976d-4c2a-a18c-2aa45046c390"));

    console.log('Очищение корзины');
    cartModel.clear();
    console.log('После очищения корзины', cart.getItems());
    console.log('Количество:', cartModel.getCount());
    console.log('Цена:', cartModel.getTotalPrice());

    console.log('Тест модели Cart завершен');
  }
}

// Запуск тестов
new TestProduct();
new TestBuyer();
new TestCart();

async function fetchProducts() {
    try {
        const productsList = await communication.getProducts();
        products.setProducts(productsList);
        console.log("Данные каталога успешно получены с сервера");
        console.log('Все товары:', products.getProducts());
    } catch(e) {
        console.log('Ошибка получения каталога с сервера ' + e)
    }
}

fetchProducts();