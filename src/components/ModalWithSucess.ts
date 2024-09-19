import { Modal } from "./common/Modal";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export interface IModalWithSucess {
	total: number;
}

export class ModalWithSucess extends Modal<IModalWithSucess> {
	protected basketTotal: HTMLElement;
	protected sucessButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.basketTotal = ensureElement<HTMLElement>('.order-success__description', container);
		this.sucessButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
		this.sucessButton.addEventListener('click', () => {
			this.close();
		});
	}

	render(data: Partial<IModalWithSucess>): HTMLElement {
		super.render(data);
		this.setText(this.basketTotal, `Списано ${data.total} синапсов`);
		this.events.emit(`success:submit`);

		return this.container;
	}
}