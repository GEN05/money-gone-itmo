import { IUser, Transaction } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import { AuthResponse } from "../models/response/AuthResponse";
import $api, { API_URL } from "../http";
import UserService from "../services/UserService";
import { TrnsType } from "../components/TransactionForm/TransactionForm";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = true;

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
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      alert("Incorrect password or such user exists");
    } finally {
      this.setLoading(false);
    }
  }

  async registration(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar: string
  ) {
    this.setLoading(true);
    try {
      const response = await AuthService.registration(
        email,
        password,
        firstName,
        lastName,
        avatar
      );
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      alert("Such user exists");
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await $api.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async requestPasswordReset(email: string) {
    return await AuthService.requestPasswordReset(email);
  }

  async resetPassword(userId: string, resetToken: string, password: string) {
    return await AuthService.resetPassword(userId, resetToken, password);
  }

  async addTransaction(date: number, category: string, value: number) {
    try {
      const response = await UserService.addTransaction(date, category, value);
      this.setUserTransactions(response.data);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async deleteTransaction(id: string) {
    try {
      const response = await UserService.deleteTransaction(id);
      this.setUserTransactions(response.data);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async addTransactionsFromBank(trnsList: TrnsType[]) {
    try {
      const response = await UserService.addTransactionsFromBank(trnsList);
      this.setUserTransactionsFromBank(response.data);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }
}
