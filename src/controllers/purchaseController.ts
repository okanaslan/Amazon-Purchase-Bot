import { Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver";

import { SeleniumUtils } from "../utils/seleniumUtils";
import { Item } from "../models/item";
import { items } from "../config";

export class PurchaseController {
    static async buyMany() {
        await Promise.all(
            items.map((item) => {
                PurchaseController.purchaseLoop(item);
            })
        );
    }

    private static async purchaseLoop(item: Item) {
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        let success = false;
        await PurchaseController.login(driver);
        await PurchaseController.waitForApproval(driver);
        await PurchaseController.waitForBotCheck(driver);
        while (!success) {
            success = await PurchaseController.purchase(driver, item);
        }
    }

    private static purchase(driver: WebDriver, item: Item) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await PurchaseController.openItem(driver, item);
                await PurchaseController.waitForBotCheck(driver);
                const price = await PurchaseController.getPrice(driver);
                if (price < item.price) {
                    await PurchaseController.addToCart(driver);
                    await PurchaseController.forceProceedToCheckOut(driver);
                    await PurchaseController.forcePlaceOrder(driver);
                } else {
                    return resolve(false);
                }
                return resolve(true);
            } catch (error) {
                return resolve(false);
            }
        });
    }

    private static async login(driver: WebDriver) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.get("https://www.amazon.com/");
                await driver.wait(until.elementLocated(By.xpath('//*[@id="nav-link-accountList"]')), 2000);
                const loginButton = await driver.findElement(By.xpath('//*[@id="nav-link-accountList"]'));
                await loginButton.click();

                await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_email"]')), 2000);
                const emailTextField = await driver.findElement(By.xpath('//*[@id="ap_email"]'));
                await emailTextField.sendKeys(process.env.EMAIL!, Key.RETURN);

                await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_password"]')), 2000);
                const passwordTextField = await driver.findElement(By.xpath('//*[@id="ap_password"]'));
                await passwordTextField.sendKeys(process.env.PASSWORD!, Key.RETURN);

                await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_email"]')), 2000);
                resolve(true);
            } catch (error) {
                console.log(error);
            }
        });
    }

    private static async openItem(driver: WebDriver, item: Item) {
        await driver.get(item.url);
    }

    private static async getPrice(driver: WebDriver): Promise<number> {
        if (await SeleniumUtils.isElementExists(driver, "/html/body/div[2]/div/div/form/span/table/tbody/tr[2]/td[3]")) {
            const price = await driver.findElement(By.xpath("/html/body/div[2]/div/div/form/span/table/tbody/tr[2]/td[3]"));
            const priceText = await price.getText();
            const priceInt = parseInt(priceText.slice(1).split(",").join(""));
            return priceInt;
        } else {
            throw Error("Price cannot found!");
        }
    }

    private static async waitForApproval(driver: WebDriver) {
        const approvalVisible = await SeleniumUtils.isElementExists(driver, '//*[@id="body"]/div/div/div[2]/span');
        if (approvalVisible) {
            await driver.sleep(60000);
        } else {
            await driver.sleep(100);
        }
    }

    private static async waitForBotCheck(driver: WebDriver) {
        const approvalVisible = await SeleniumUtils.isElementExists(driver, "/html/body/div/div[1]/div[2]/div/h4");
        if (approvalVisible) {
            await driver.sleep(60000);
        } else {
            await driver.sleep(100);
        }
    }

    private static async addToCart(driver: WebDriver) {
        await SeleniumUtils.clickIfExists(driver, "/html/body/div[2]/div/div/form/span/input[3]");
    }

    // private static async proceedToCheckOut(driver: WebDriver) {
    //     await SeleniumUtils.clickIfExists(driver, '//*[@id="sc-buy-box-ptc-button"]/span/input');
    // }

    private static async forceProceedToCheckOut(driver: WebDriver) {
        try {
            const button = await driver.findElement(By.xpath('//*[@id="sc-buy-box-ptc-button"]/span/input'));
            await button.click();
        } catch (e) {
            await driver.sleep(100);
            await this.forceProceedToCheckOut(driver);
        }
    }

    private static async forcePlaceOrder(driver: WebDriver) {
        try {
            const button = await driver.findElement(By.xpath('\'//*[@id="placeYourOrder"]/span/input'));
            await button.click();
        } catch (e) {
            await driver.sleep(100);
            await this.forceProceedToCheckOut(driver);
        }
    }

    // private static async placeOrder(driver: WebDriver) {
    //     await SeleniumUtils.clickIfExists(driver, '//*[@id="placeYourOrder"]/span/input');
    // }
}
