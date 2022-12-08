import {IUser, Transaction} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import UserService from "../services/UserService";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setUserTransactions(transactions: [Transaction]) {
        this.user.transactions = transactions;
        // console.log(transactions)
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string,
                       password: string,
                       firstName: string,
                       lastName: string,) {
        try {
            const response = await AuthService.registration(email, password, firstName, lastName);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            // const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async addTransaction(date: number, category: string, value: number) {
        try {
            const response = await UserService.addTransaction(date, category, value);
            this.setUserTransactions(response.data)
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async deleteTransaction(id: string) {
        try {
            const response = await UserService.deleteTransaction(id);
            this.setUserTransactions(response.data)
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }
}
