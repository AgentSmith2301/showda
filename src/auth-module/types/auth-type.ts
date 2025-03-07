import {Request} from 'express'

export interface LoginInputModel {
    loginOrEmail: string,
    password: string
}

export interface LoginSuccessViewModel {
    accessToken: string
}

export interface MeViewModel {
    email: string,
    login: string,
    userId: string
}

