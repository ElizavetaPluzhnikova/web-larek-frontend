import { Component } from "./base/Component";

interface IProductContainer {
	catalog: HTMLElement[];
}

export class ProductContainer extends Component<IProductContainer> {
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}