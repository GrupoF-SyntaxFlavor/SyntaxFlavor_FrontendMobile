export interface User {
    name: string;
    email: string;
    password: string;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
}