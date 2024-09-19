import { IProduct } from "../types";
import { IEvents } from "./base/events";

export class Basket {
	private items: IProduct[] = []; 
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this.events.on('basket:add-item', this.addItem.bind(this));
		this.events.on('basket:remove-item', this.removeItem.bind(this));
	}

	addItem(item: IProduct): void {
		if (!this.isProductInBasket(item.id)) {
			this.items.push(item);
			this.updateBasket();
		}
	}

	isProductInBasket(itemId: string): boolean {
		return this.items.some((item) => item.id === itemId);
	}

	removeItem(itemId: string): void {
		this.items = this.items.filter((item) => item.id !== itemId);
		this.updateBasket();
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getTotalItems(): number {
		return this.items.length;
	}

	getTotalPrice(): number {
		return this.items.reduce((total, item) => total + (item.price || 0), 0);
	}

	clearBasket(): void {
		this.items = [];
		this.updateBasket();
	}

	private updateBasket(): void {
		this.events.emit('basket:update', {
			items: this.getItems(),
			totalPrice: this.getTotalPrice(),
		});
	}
}