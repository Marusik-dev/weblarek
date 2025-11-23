import { IProduct } from '../../types'
import { EventEmitter } from '../base/Events';

export class Cart {
    private items: IProduct[];
    private events: EventEmitter;

    constructor(events: EventEmitter, items: IProduct[] = []) {
        this.items = items;
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('basket:change'); // ← событие здесь
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:change'); // ← событие здесь
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:change');
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}