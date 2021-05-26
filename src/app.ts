import { config } from "dotenv";
import { PurchaseController } from "./controllers/purchaseController";

config();

PurchaseController.buyMany()
    .then()
    .catch((error) => {
        console.error(error);
    });
