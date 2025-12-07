import { Product } from "./product";

export interface Order {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    address: {
        street: string;
        city: string;
        zip: string;
    };
    items: Product[];
    total: number;
    createdAt: string;
}
