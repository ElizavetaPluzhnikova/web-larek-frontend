import './scss/styles.scss';
import { Form } from './components/common/Form';
import { Product } from './components/Product';
import { ProductData } from './components/ProductData';
import { ProductContainer } from './components/ProductContainer';
import { ModalWithProduct } from './components/ModalWithProduct';
import { Basket } from './components/Basket';
import { ModalWithBasket } from './components/ModalWithBasket';
import { Order } from './components/Order';
import { User } from './components/User';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { IApi, IProduct } from './types';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalWithSucess } from './components/ModalWithSucess'; 

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const productTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productData =  new ProductData(events);
const basketData = new Basket(events);
const userData = new User();
const productModal = new ModalWithProduct(ensureElement<HTMLElement>('#info-modal'), events);
const basketModal = new ModalWithBasket(ensureElement<HTMLElement>('#basket-modal'),events);
const successModal = new ModalWithSucess(ensureElement<HTMLElement>('.success-modal'), events);
const order = new Order(ensureElement<HTMLElement>('#order-modal'),events);
const contactForm = new Form(ensureElement<HTMLElement>('#contact-modal'),events);
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
basketButton.addEventListener('click', () => {
	events.emit('basket:open', {
		items: basketData.getItems(),
		totalPrice: basketData.getTotalPrice(),
	});
});
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const productContainer = new ProductContainer(ensureElement<HTMLElement>('.gallery'));
events.on('basket:open', (data: { items: IProduct[]; totalPrice: number }) => {
	basketModal.render(data);
	basketModal.open();
});

Promise.all([api.getItems()])
	.then(([initialItems]) => {
		productData.itemsResponse = initialItems;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('initialData:loaded', () => {
	const itemsArray = productData.items.map((item) => {
		const itemInstant = new Product(cloneTemplate(productTemplate), events);
		return itemInstant.render(item);
	});

	productContainer.render({ catalog: itemsArray });
});

events.on('product:select', (data: { item: Product }) => {
	const { item } = data;
	const itemData = productData.getItem(item.id);
	if (itemData) {
		events.emit('product:check-button', { id: itemData.id });
		productModal.render({ item: itemData });
		productModal.itemData = itemData;
	}
});

events.on('basket:add-item', (item: IProduct) => {
	basketData.addItem(item);
	events.emit('product:check-button', { id: item.id });
});

events.on('basket:remove-item', ({ id }: { id: string }) => {
	basketData.removeItem(id);
	events.emit('product:check-button', { id });
});

events.on('product:check-button', (data: { id: string }) => {
	const itemId = data.id;
	const isInBasket = basketData.isProductInBasket(itemId);
	const item = productData.getItem(itemId); 
	const price = item ? item.price : null;
	if (item) {
		productModal.setButtonState(isInBasket, price);
	}
});

events.on('basket:update', (data: { items: IProduct[]; totalPrice: number }) => {
	basketCounter.textContent = basketData.getTotalItems().toString();
});

events.on('basket:order', (basketData: { data: { items: IProduct[]; totalPrice: number } }) => {
		const itemIds = basketData.data.items.map((item) => item.id);
		userData.updateData({
			items: itemIds,
			total: basketData.data.totalPrice,
		});
		basketModal.close();
		order.open();
	}
);

events.on('order:payment-method-selected', (paymentData: { method: string }) => {
		const paymentMethod = paymentData.method === 'card' ? 'online' : 'offline';
		userData.updateData({ payment: paymentMethod });
	}
);

events.on('order:submit', (orderData: { address: string }) => {
	userData.updateData({ address: orderData.address });
	order.close();
	contactForm.open();
});

events.on('contact:submit', (contactData: { email: string; phone: string }) => {
	userData.updateData({ email: contactData.email, phone: contactData.phone });
	contactForm.close();
	const total = basketData.getTotalPrice();
	api
		.setOrder(userData.getData())
		.then(() => {
			successModal.render({ total });
			successModal.open();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('success:submit', () => {
	basketData.clearBasket();
});
