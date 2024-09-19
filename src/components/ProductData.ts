import { IProduct, IProductData } from "../types";
import { IEvents } from "./base/events";

export class ProductData implements IProductData {
	protected _itemsResponse: { total: number; items: IProduct[] };
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set itemsResponse(response: { total: number; items: IProduct[] }) {
		this._itemsResponse = response;
		this.events.emit('product:changed');
	}

	get items(): IProduct[] {
		return this._itemsResponse.items;
	}

	getItem(itemId: string) {
		return this.items.find((item) => item.id === itemId);
	}

	get preview() {
		return this._preview;
	}
}