import { User, UserDocument } from "../src/models/user";

type Document = UserDocument;

export class Factory {
    static generate<M, D extends Document, K extends keyof D>(object: M, args?: { field: K; value: D[K] }[]): D {
        let temp: D;
        if (object instanceof User) {
            temp = this.generateUser<D>();
        } else {
            throw Error(`${object} is not a valid model!`);
        }

        if (args) {
            for (const arg of args) {
                temp[arg.field] = arg.value;
            }
        }
        return temp;
    }

    static generateMany<D extends Document, K extends keyof D>(object: D, args: { field: K; value: D[K] }[], size: number): D[] {
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(Factory.generate(object, args));
        }
        return array;
    }

    private static generateUser<D extends Document>(): D {
        const user = new User();
        user.username = "user";

        return user as D;
    }
}
