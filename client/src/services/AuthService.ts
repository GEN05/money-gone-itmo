import $api from "../http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/login", {email, password});
    }

    static async registration(email: string,
                              password: string,
                              firstName: string,
                              lastName: string,
                              avatar: string,): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/registration", {email, password, firstName, lastName, avatar});
    }

    static async logout(): Promise<void> {
        return $api.post("/logout");
    }

    static async requestPasswordReset(email: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/request-reset-password", {email});
    }

    static async resetPassword(userId: string, resetToken: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>("/reset-password", {userId, resetToken, password});
    }
}

