# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run dev
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
Интерфейсы данных

#### Товар IProduct:
interface IProduct {
  id: string; // уникальный идентификатор товара
  description: string; //описание товара
  image: string; // изображение товара
  title: string; //наименование товара 
  category: string; // категория, к которой относится товар
  price: number | null; // цена товара (null - цена не указана)
}

#### Покупатель IBuyer:
interface IBuyer {
  payment: TPayment; // способ оплаты
  email: string; // email покупателя
  phone: string; // телефон покупателя
  address: string; // адрес доставки
}

#### Объект для отправки заказа IOrder
interface IOrder {
  items: string[]; // массив ид покупаемых товаров;
  total: number; //сумма приобретаемых товаров;
}

### Модели данных

#### Класс Products
Хранит массив всех товаров; хранит товар, выбранный для подробного отображения

Конструктор:
constructor(products: IProduct[] = [], events: EventEmitter, )

Поля:
products: IProduct[] — массив всех доступных товаров
selectedProduct: IProduct | null — выбранный товар
events: EventEmitter - брокер событий для уведомления об изменениях

Методы:
setProducts(products: IProduct[]): void — сохранение массива товаров и отправка события catalog:change
getProducts(): IProduct[] — получение массива всех товаров
getProductById(id: string): IProduct | undefined — получение товара по его ID (или undefined если не найден)
setSelectedProduct(product: IProduct): void — сохранение товара для подробного отображения
getSelectedProduct(): IProduct | null — получение товара для подробного отображения

#### Класс Cart
Хранит массив товаров, выбранных покупателем для покупки

Конструктор:
constructor(items: IProduct[] = [], events: EventEmitter)

Поля:
items: IProduct[] — массив товаров, добавленных в корзину
events: EventEmitter — брокер событий для уведомления об изменениях корзины

Методы:
getItems(): IProduct[] — получение массива товаров, которые находятся в корзине
addItem(item: IProduct): void — добавление товара, который был получен в параметре, в массив корзины
removeItem(id: string): void — удаление товара, полученного в параметре из массива корзины
clear(): void — очистка корзины
getTotalPrice(): number — получение стоимости всех товаров в корзине
getCount(): number — получение количества товаров в корзине
hasItem(id: string): boolean — проверка наличия товара в корзине по его id, полученного в параметр метода

#### Класс Buyer
Хранит следующие данные:
- вид оплаты;
- адрес;
- телефон;
- email.

Конструктор:
constructor(data?: IBuyer)` - создает экземпляр покупателя с начальными данными (опционально)

Поля:
payment: TPayment — вид оплаты
address: string — адрес  
phone: string — телефон
email: string — email

Методы:
setData(data: IBuyer): void — сохранение или обновление всех данных покупателя
getData(): IBuyer — получение всех данных покупателя в виде объекта
clear(): void — полная очистка всех данных покупателя
removeData(): void — альтернативный метод очистки данных (синоним clear)

Сеттеры:
setPayment(payment: TPayment): void — установка способа оплаты
setEmail(email: string): void — установка email
setPhone(phone: string): void — установка телефона  
setAddress(address: string): void` — установка адреса

Валидация:
validate(): { payment: boolean; email: boolean; phone: boolean; address: boolean } — комплексная валидация всех полей, возвращает объект с результатами проверки каждого поля
validateContactsForm(): { error: string; isValid: boolean } — валидация данных для формы контактов (email и телефон), возвращает объект с текстом ошибки и флагом валидности
validateAddressForm(): { error: string; isValid: boolean } — валидация данных для формы адреса (способ оплаты и адрес), возвращает объект с текстом ошибки и флагом валидности

Свойства:
isValid: boolean — вычисляемое свойство, возвращает true если все данные валидны

### Слой коммуникации
#### Класс Communication
Отвечает за коммуникацию с сервером

Конструктор: constructor(api: Api)

Поля:
api: Api - экземпляр класса Api.

Методы:
getProducts(): Promise<IProduct[]> - получение списка товаров
createOrder(order: IOrder): Promise<IApiOrderResponse> - размещение заказа

### Классы слоя Представления (View)
#### Header
-Содержит кнопку открытия модального окна корзины.
-Отображает количество товаров в корзине.

Конструктор: constructor(container: HTMLElement, events: IEvents) 

Поля: 
basketButton: HTMLButtonElement - кнопка открытия корзины 
counterElement: HTMLElement - счетчик товаров в корзине

Методы: 
set counter(value: number) - устанавливает количество товаров в корзине

### Catalog
Отображает список карточек товаров.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля: 
catalogElement: HTMLElement - каталог карточек товаров

Методы:
set catalog(cards: HTMLElement[]) - устанавливает список карточек товаров

### Modal
Отображает модальное окно

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
closeButton: HTMLButtonElement - кнопка закрытия модального окна 
contentElement: HTMLElement - контейнер для содержимого модального окна

Методы:
set content(value: HTMLElement) - устанавливает содержимое модального окна

### ProductCard
Родительский класс для всех карточек товаров (содержит общие для всех карточек поля)

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
titleElement: HTMLElement - название товара
priceElement: HTMLElement - цена товара

Методы:
set title(value: string) - устанавливает название товара
set price(value: number | null) - устанавливает цену товара

### CatalogProductCard
Отображает карточку товара в каталоге товаров

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля: 
categoryElement: HTMLElement - категория товара
imageElement: HTMLImageElement - изображение товара

Методы: 
set category(value: string) - устанавливает категорию товара
set image(value: string) - устанавливает изображение товара

### PreviewProductCard
Отображает превью карточки товара

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
categoryElement: HTMLElement - категория товара
imageElement: HTMLElement - изображение товара
textElement: HTMLElement - описание товара
basketButton: HTMLButtonElement - кнопка добавления / удаления товара из корзины.

Методы:
set category(value: string) - устанавливает категорию товара
set image(value: string) - устанавливает изображение товара
set text(value: string) - устанавливает описание товара
set buttonLabel(value: string) - устанавливает текст кнопки ("Купить"/"Удалить из корзины")
set isButtonDisabled(value: boolean) - устанавливает состояние disabled для кнопки
updateActions(actions: IActions): void - обновляет обработчики событий для кнопки (используется при повторном использовании экземпляра карточки)

### BasketProductCard
Отображает карточку товара в корзине

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
indexElement: HTMLElement - индекс товара в корзине
deleteButton: HTMLButtonElement - кнопка удаления товара из корзины

Методы: 
set index(value: number) - устанавливает индекс товара в корзине

### Basket
Корзина товаров

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля: 
listElement: HTMLElement - список карточек товаров в корзине
orderButton: HTMLButtonElement - кнопка оформления заказа
orderAmountElement: HTMLElement - сумма заказа

Методы: 
set items(value: HTMLElement[]) - устанавливает список товаров в корзине
set orderAmount(value: number) - устанавливает сумму заказа

### Order
Родительский класс заказа (содержит общие поля и методы для всех заказов)

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
formErrorsElement: HTMLElement - ошибки формы
submitButton: HTMLButtonElement - кнопка отправки формы

Методы: 
set errors:(value: string) - устанавливаем ошибки формы

### OrderAddress
Заказ: способ оплаты и адрес доставки

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
cardButton: HTMLButtonElement - кнопка оплата онлайн
cashButton: HTMLButtonElement - кнопка оплата при получении
addressInput: HTMLElement - адрес доставки

### OrderContacts
Заказ: email и телефон

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля:
emailInput: HTMLElement - email
phoneInput: HTMLElement - телефон

### OrderSuccess
Заказ успешно оформлен

Конструктор: constructor(container: HTMLElement, events: IEvents)

Поля: 
descriptionElement: HTMLElement - описание заказа
closeButton: HTMLButtonElement - кнопка закрытия

Методы:
set orderAmount(value: number) - устанавливает сумму заказа

### События
catalog:change - изменены данные о списке товаров
catalog:product:click - нажатие на карточку товара в каталоге
product:preview:button:click - возникает при нажатии на кнопку в превью карточки товара ("Купить"/"Удалить из корзины")

modal:open - открыть модвльное окно
modal:close - закрыть модальное окно

basket:open - открыть корзину
basket:change - обновить данные в корзине 
basket:product:remove - удалить товар из корзины
basket:create:order - оформить заказ

order:payment:change - изменился способ оплаты в заказе
order:address:change - изменился адрес доставки в заказе
order:phone:change - изменился телефон в заказе
order:email:change - изменился email в заказе
order:submit - создать заказ
order:done - заказ успешно оформлен, закрыть форму

### Презентер
- Получает данные о товарах с сервера
- Инициализирует классы моделей и предствлений
- Обрабатывает события от моделей и представлений










