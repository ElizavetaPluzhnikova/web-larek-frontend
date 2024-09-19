import { IEvents } from "./base/events";
import { IProduct } from "../types";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

export class Product extends Component<IProduct> {
    protected element: HTMLElement;
	protected events: IEvents;
	protected itemButton?: HTMLButtonElement;
	protected itemCategory?: HTMLSpanElement;
	protected itemTitle: HTMLElement;
	protected itemImage?: HTMLImageElement;
	protected itemPrice?: HTMLSpanElement;
	protected itemId: string;
	protected itemDescription?: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.itemCategory = this.container.querySelector('.card__category');
		this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.itemImage = this.container.querySelector('.card__image');
		this.itemPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
		this.itemDescription =
			this.container.querySelector('.card__text') ?? undefined;
		this.itemButton = this.container.querySelector('.card-add-button');
		this.container.addEventListener('click', () => {
			this.events.emit('product:select', { item: this });
		});
	}

    render(data?: Partial<IProduct>): HTMLElement;

	render(itemData: Partial<IProduct> | undefined) {
		if (!itemData) return this.container;
		return super.render(itemData);
	}

    set description(description: string) {
		if (this.itemDescription) {
			this.setText(this.itemDescription, description);
		}
	}

    public static setCategoryStyle(element: HTMLElement, category: string) {
		if (element) {
			element.className = 'card__category';
			switch (category) {
				case 'софт-скил': element.classList.add('card__category_soft');
					break;
				case 'хард-скил': element.classList.add('card__category_hard');
					break;
				case 'другое': element.classList.add('card__category_other');
					break;
				case 'дополнительное': element.classList.add('card__category_additional');
					break;
				case 'кнопка': element.classList.add('card__category_button');
					break;
				default: element.style.backgroundColor = 'blue';
					break;
			}
		}
	}

    set category(category: string) {
		Product.setCategoryStyle(this.itemCategory, category);
		this.setText(this.itemCategory, category);
	}

	set image(image: string) {
		if (this.itemImage) {
			this.itemImage.src =
				'https://larek-api.nomoreparties.co/content/weblarek/' + image;
		}
	}

    set price(price: number | null) {
		if (this.itemPrice) {
			if (price === null) {
				this.setText(this.itemPrice, 'Бесценно');
			} else {
				this.setText(this.itemPrice, price.toString() + ' синапсов');
			}
		}
	}

	set title(title: string) {
		this.setText(this.itemTitle, title);
	}

	set id(id) {
		this.itemId = id;
	}
	get id() {
		return this.itemId;
	}
}