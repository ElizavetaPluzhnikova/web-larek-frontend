import { IUser } from "../types";

export class User {
	private data: IUser = {};

	updateData(newData: Partial<IUser>) {
		this.data = { ...this.data, ...newData };
	}

	getData(): IUser {
		return this.data;
	}
}