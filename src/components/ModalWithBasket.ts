import { IProduct } from "../types";
import { Product } from "./Product";
import { Modal } from "./common/Modal";
import { IEvents } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";

export interface IModalWithBasket {
	items: IProduct[];
	totalPrice: number;
}

export class ModalWithBasket extends Modal<IModalWithBasket> {
    private basketList: HTMLUListElement;
	private basketTotalPrice: HTMLElement;
	private checkoutButton: HTMLButtonElement; 

    constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.basketList = ensureElement<HTMLUListElement>('.basket__list', this.container);
		this.basketTotalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket-confirm-button', this.container);
        this.events.on('basket:update', this.render.bind(this));
	}

    render(data?: { items: IProduct[]; totalPrice: number }): HTMLElement {
        if (!data) return this.container;

		this.basketList.innerHTML = '';

		if (data.items.length === 0) {
			if (this.checkoutButton) {
				this.checkoutButton.disabled = true;
			}
		} else {
			if (this.checkoutButton) {
				this.checkoutButton.disabled = false;
			}
		}
		data.items.forEach((item, index) => {
			const basketProductElement = this.createBasketProductElement(item, index);
			this.basketList.appendChild(basketProductElement);
		});

		this.checkoutButton.addEventListener('click', () => {
				this.events.emit('basket:order', { data });
			},
			{ once: true }
		);

		if (data?.totalPrice !== undefined) {
			this.setText(this.basketTotalPrice, `${data.totalPrice} синапсов`);
		}
		return super.render(data);
    }

    private createBasketProductElement(itemData: IProduct, index: number): HTMLElement {
		const basketProductTemplate = cloneTemplate<HTMLElement>('#card-basket');
		const itemInstance = new Product(basketProductTemplate, this.events);
		itemInstance.render(itemData);

		const indexElement = ensureElement<HTMLElement>('.basket__item-index', basketProductTemplate);
		if (indexElement) {
			indexElement.textContent = (index + 1).toString();
		}

		const removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete',basketProductTemplate);
		if (removeButton) {
			removeButton.addEventListener('click', () => {
				this.events.emit('basket:remove-item', { id: itemData.id });
				event.stopPropagation();
			});
		}

		return basketProductTemplate;
	}
}