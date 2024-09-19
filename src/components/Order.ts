import { Form } from "./common/Form";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export class Order extends Form {
	private paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.container);
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', this.handlePaymentMethod.bind(this));
		});

		this.validateForm();
	}

	private handlePaymentMethod(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;

		this.paymentButtons.forEach((button) => button.classList.remove('button_alt-active'));

		target.classList.add('button_alt-active');

		this.events.emit('order:payment-method-selected', { method: target.name });

		this.validateForm();
	}

	protected validateForm() {
		let isValid = true;

		this.inputs.forEach((input) => {
			if (input.value.trim() === '') {
				isValid = false;
				this.showInputError();
			}
		});

		const activePaymentButton = this.container.querySelector('.order__buttons .button_alt-active');
		if (!activePaymentButton) {
			isValid = false;
			this.setText(this.errorSpan, 'Выберите способ оплаты');
		} else {
			this.setText(this.errorSpan, '');
		}

		this.valid = isValid;
	}

	set valid(isValid: boolean) {
		super.valid = isValid;
	}
}