import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Modal } from "./common/Modal";
import { Product } from "./Product";

export interface IModalWithProduct {
	addButton: HTMLButtonElement;
	item: IProduct;
}

export class ModalWithProduct extends Modal<IModalWithProduct> {
    private addButton: HTMLButtonElement;
	private itemCategory: HTMLSpanElement;
	private itemTitle: HTMLElement;
	private itemImage: HTMLImageElement;
	private itemPrice: HTMLSpanElement;
	private itemDescription: HTMLElement;
	private currentItem: IProduct | null = null;
	private handleAddButtonClick: () => void;

    constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.addButton = ensureElement<HTMLButtonElement>('.button',this.container);
		this.itemCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
		this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.itemPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
		this.itemDescription = ensureElement<HTMLElement>('.card__text', this.container) ?? undefined;

		this.handleAddButtonClick = () => {
			if (this.currentItem) {
				events.emit('basket:add-item', this.currentItem);
				this.updateButtonState();
				this.close();
			}
		};

		if (this.addButton) {
			this.addButton.addEventListener('click', this.handleAddButtonClick);
		}
	}

    set itemData(item: IProduct) {
		this.currentItem = item;
		this.updateButtonState();

		if (this.itemCategory) {
			Product.setCategoryStyle(this.itemCategory, item.category);
			this.setText(this.itemCategory, item.category);
		}
		if (this.itemTitle) {
			this.setText(this.itemTitle, item.title);
		}
		if (this.itemImage) {
			this.itemImage.src =
				'https://larek-api.nomoreparties.co/content/weblarek/' + item.image;
		}
		if (this.itemPrice) {
			this.setText(
				this.itemPrice,
				item.price !== null ? `${item.price} синапсов` : 'Бесценно'
			);
		}
		if (this.itemDescription) {
			this.setText(this.itemDescription, item.description ?? '');
		}

		super.open();
	}

    private updateButtonState() {
		if (this.currentItem) {
			this.events.emit('product:check-button', { id: this.currentItem.id });
		}
	}

	public setButtonState(isInBasket: boolean, price: number | null) {
		if (isInBasket) {
			this.addButton.disabled = true;
			this.setText(this.addButton, 'В корзине');
	    } 
        else {
			this.addButton.disabled = false;
			this.setText(this.addButton, 'В корзину');
		}
	}
}