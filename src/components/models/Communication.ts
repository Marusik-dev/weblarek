import { Api } from '../base/Api';
import { IProduct, IOrder, IApiProductsResponse, IApiOrderResponse } from '../../types';

export class Communication {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IApiProductsResponse>('/product/');
      return response.items ?? [];
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      return [];
    }
  }

  async placeOrder(order: IOrder): Promise<IApiOrderResponse> {
    try {
      return await this.api.post<IApiOrderResponse>('/order/', order);
    } catch (error) {
        console.error('Ошибка при отпрвке заказа:', error);
        return { total: 0 };
    }
  }
}