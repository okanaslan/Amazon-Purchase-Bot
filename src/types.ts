export interface Item {
    url: string;
    price: number;
}

export type Config = {
    items: Item[];
    seller: string;
};
