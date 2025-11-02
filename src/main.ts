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

//тестирование моделей
//Products
console.log('Тестирование модели Products');
products.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', products.getProducts());
const productId = '854cef69-976d-4c2a-a18c-2aa45046c390';
const product = products.getProductById(productId);
console.log('Выбор товара по id: товар с id=' + productId + ':', product);
if (product) {
    products.setSelectedProduct(product);
    console.log('Товар ' + productId + ' установлен как выбранный');
}
const selectedProduct = products.getSelectedProduct();
console.log('Выбранный товар:', selectedProduct);
console.log('Тест модели Products завершен');

//Buyer
console.log('Тестирование модели Buyer');
console.log('Получение данных покупателя: ', buyer.getData());
console.log('Обновление данных покупателя');
buyer.setData({
    "payment": "",
    "email": "new@email.com",
    "phone": "2223322",
    "address": "крыша в Стокгольме"
});
console.log('Получение обновленных данных покупателя: ', buyer.getData());
console.log('Очищение данных покупателя');
buyer.clear();
console.log('Получение данных покупателя после очищения: ', buyer.getData());
console.log('Тестирование валидации');
buyer.setData({
    "payment": "card",
    "email": "new@email.com",
    "phone": "2223322",
    "address": "крыша в Стокгольме"
});
const validValidation = buyer.validate();
console.log('Результат validate():', validValidation);
console.log('Результат isValid:', buyer.isValid);
console.log('Тест модели Buyer завершен');

//Cart
console.log('Тестирование модели Cart');
console.log('Пустая корзина:', cart.getItems());
console.log('Количество товаров:', cart.getCount());
console.log('Общая стоимость:', cart.getTotalPrice());
console.log('Добавление 1го товара в корзину');
cart.addItem(products.getProducts()[0]);
console.log('После добавления 1го товара:', cart.getItems());
console.log('Количество:', cart.getCount());
console.log('Цена:', cart.getTotalPrice());
console.log('Добавление 2го товара в корзину');
cart.addItem(products.getProducts()[1]);
console.log('После добавления 2го товара:', cart.getItems());
console.log('Количество:', cart.getCount());
console.log('Цена:', cart.getTotalPrice());
console.log('Удаления 1 товара');
cart.removeItem(products.getProducts()[1]);
console.log('После удаления товара:', cart.getItems());
console.log('Количество:', cart.getCount());
console.log('Цена:', cart.getTotalPrice());
console.log('Наличие товара товара');
console.log('Товар в корзине:', cart.hasItem("854cef69-976d-4c2a-a18c-2aa45046c390"));
console.log('Очищение корзины');
cart.clear();
console.log('После очищения корзины', cart.getItems());
console.log('Количество:', cart.getCount());
console.log('Цена:', cart.getTotalPrice());
console.log('Тест модели Cart завершен');

//Тестирование api

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