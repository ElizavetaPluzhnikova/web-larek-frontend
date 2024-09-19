import { IApi, IProduct, IOrderResult, IUser } from "../types";

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getItems(): Promise<{ total: number; items: IProduct[] }> {
		return this._baseApi.get<{ total: number; items: IProduct[] }>('/product');
	}

	setOrder(order: IUser): Promise<IOrderResult> {
		return this._baseApi
			.post<IUser>(`/order`, order)
			.then((data: IOrderResult) => data)
			.catch((error: any) => {
				console.error('Order submission failed:', error);
				throw error;
			});
	}
}