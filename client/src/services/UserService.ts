import $api from "../http";
import {AxiosResponse} from "axios";
import {Transaction} from "../models/IUser";

export default class UserService {
    static async addTransaction(date: number, category: string, value: number): Promise<AxiosResponse<Transaction[]>>{
        return $api.post<Transaction[]>("/add-transaction", {date, category, value})
    }

    static async deleteTransaction(id: string): Promise<AxiosResponse<Transaction[]>>{
        return $api.post<Transaction[]>("/delete-transaction", {id})
    }
}

