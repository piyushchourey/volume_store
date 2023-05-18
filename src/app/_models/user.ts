export class User {
    id!: number;
    email!: string;
    password!: string;
    token?: string;
    role?:string;
    first_name?:string;
}