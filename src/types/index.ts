export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IProductData {
	items: IProduct[];
	preview: string | null;
	getItem(itemId: string): IProduct;
}

export interface IBasket {
	items: [IProduct];
	total: number;
	getTotal(items: [IProduct]): number;
	add(id: string): void;
	remove(id: string): void;
	checkItem(id: string): boolean;
}

export interface IUser {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
	total?: number;
	items?: string[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderResult {
	id?: string;
	total?: number;
	error?: string;
}






