import {IUser, Transaction} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import UserService from "../services/UserService";
import {TrnsType} from "../components/TransactionForm/TransactionForm";

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

    setUserTransactions(transactions: Transaction[]) {
        this.user.transactions = transactions;
    }

    setUserTransactionsFromBank(transactionsFromBank: Transaction[]) {
        this.user.transactionsFromBank = transactionsFromBank;
        console.log(transactionsFromBank)
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        this.setLoading(true);
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
            alert("Incorrect password or such user exists")
        } finally {
            this.setLoading(false);
        }
    }

    async registration(email: string,
                       password: string,
                       firstName: string,
                       lastName: string,
                       avatar: string,) {
        this.setLoading(true);
        try {
            const response = await AuthService.registration(email, password, firstName, lastName, avatar);
            console.log(response)
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            // const response = await AuthService.logout();
            localStorage.removeItem("token");
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
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }

    async addTransaction(date: number, category: string, value: number) {
        try {
            const response = await UserService.addTransaction(date, category, value);
            this.setUserTransactions(response.data)
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async deleteTransaction(id: string) {
        try {
            const response = await UserService.deleteTransaction(id);
            this.setUserTransactions(response.data)
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async addTransactionsFromBank(trnsList: TrnsType[]) {
        try {
            const response = await UserService.addTransactionsFromBank(trnsList);
            this.setUserTransactionsFromBank(response.data)
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }
}
