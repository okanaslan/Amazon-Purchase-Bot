import { config } from "dotenv";
config();

import { PurchaseController } from "./controllers/purchaseController";

PurchaseController.buyMany()
    .then()
    .catch((error) => {
        console.error(error);
    });
