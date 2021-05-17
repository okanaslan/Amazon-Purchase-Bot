import { Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import { Item } from "../models/item";
import { Items } from "../data/items";

export class SeleniumUtils {
    static async buyAll() {
        const items = Items;

        await Promise.all(
            items.map((item) => {
                SeleniumUtils.buy(item);
            })
        );

        // await SeleniumUtils.buy(items[0]!);
    }

    static async buy(item: Item) {
        // const driver = await new Builder()
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        await SeleniumUtils.login(driver);
        let success = false;
        while (!success) {
            success = await SeleniumUtils.buyItem(driver, item);
        }
    }

    static async login(driver: WebDriver) {
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

            // await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
            // await driver.wait(until.titleIs("webdriver - Google Search"), 2000);
        } catch (error) {
            console.log(error);
        }
    }

    static async buyItem(driver: WebDriver, item: Item): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.get(item.url);

                if (await SeleniumUtils.buyNow(driver, item)) {
                    await driver.wait(until.elementLocated(By.xpath('//*[@id="buy-now-button"]')), 2000);
                    const buyNowButton = await driver.findElement(By.xpath('//*[@id="buy-now-button"]'));
                    await buyNowButton.click();

                    await driver.wait(until.elementLocated(By.xpath('//*[@id="turbo-checkout-pyo-button"]')), 2000);
                    // const placeOrderButton = await driver.findElement(By.xpath('//*[@id="turbo-checkout-pyo-button"]'));
                    // await placeOrderButton.click();
                    resolve(true);
                } else if (await SeleniumUtils.seeAllBuyingOptions(driver, item)) {
                    if (await SeleniumUtils.addTopSeller(driver)) {
                        await driver.wait(until.elementLocated(By.xpath(`//*[@id="hlb-ptc-btn-native"]`)), 2000);
                        const proceedToCheckoutButton = await driver.findElement(By.xpath('//*[@id="hlb-ptc-btn-native"]'));
                        await proceedToCheckoutButton.click();

                        // await driver.wait(until.elementLocated(By.xpath('//*[@id="placeYourOrder"]/span/input')));
                        // const placeOrderButton = await driver.findElement(By.xpath('//*[@id="placeYourOrder"]/span/input'));
                        // await placeOrderButton.click();
                        resolve(true);
                    } else if (await SeleniumUtils.addAnySeller(driver)) {
                        await driver.wait(until.elementLocated(By.xpath(`//*[@id="hlb-ptc-btn-native"]`)), 2000);
                        const proceedToCheckoutButton = await driver.findElement(By.xpath('//*[@id="hlb-ptc-btn-native"]'));
                        await proceedToCheckoutButton.click();

                        // await driver.wait(until.elementLocated(By.xpath('//*[@id="placeYourOrder"]/span/input')));
                        // const placeOrderButton = await driver.findElement(By.xpath('//*[@id="placeYourOrder"]/span/input'));
                        // await placeOrderButton.click();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async seeAllBuyingOptions(driver: WebDriver, item: Item): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.wait(until.elementLocated(By.xpath(`//*[@id="buybox-see-all-buying-choices"]/span/a`)), 2000);
                const seeAllBuyingOptionsButton = await driver.findElement(By.xpath('//*[@id="buybox-see-all-buying-choices"]/span/a'));
                await seeAllBuyingOptionsButton.click();

                await driver.wait(until.elementLocated(By.xpath('//*[@id="aod-price-1"]/span/span[2]/span[2]')), 2000);
                const price = await driver.findElement(By.xpath('//*[@id="aod-price-1"]/span/span[2]/span[2]'));
                const priceText = await price.getText();
                const priceInt = parseInt(priceText.split(",").join(""));
                console.log(`price: ${priceInt}`);

                await driver.wait(until.elementLocated(By.xpath('//*[@id="aod-offer-soldBy"]/div/div/div[2]/a')), 2000);
                const soldBy = await driver.findElement(By.xpath('//*[@id="aod-offer-soldBy"]/div/div/div[2]/a'));
                const soldByText = await soldBy.getText();
                console.log(`soldBy: ${soldByText}`);

                resolve(priceInt < item.price && soldByText == "Amazon.com");
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async addTopSeller(driver: WebDriver): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.wait(until.elementLocated(By.xpath(`//*[@id="a-autoid-2"]/span/input`)), 2000);
                const topAddToCartButton = await driver.findElement(By.xpath('//*[@id="a-autoid-2"]/span/input'));
                await topAddToCartButton.click();

                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async addAnySeller(driver: WebDriver): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.wait(until.elementLocated(By.xpath(`//*[@id="a-autoid-2"]/span/input`)), 2000);
                const addToCartButton = await driver.findElement(By.xpath('//*[@id="a-autoid-2"]/span/input'));
                await addToCartButton.click();

                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async buyNow(driver: WebDriver, item: Item): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.wait(until.elementLocated(By.xpath('//*[@id="buy-now-button"]')), 2000);
                const buyNowButton = await driver.findElement(By.xpath('//*[@id="buy-now-button"]'));
                await buyNowButton.click();

                await driver.wait(until.elementLocated(By.xpath('//*[@id="price_inside_buybox"]')), 2000);
                const price = await driver.findElement(By.xpath('//*[@id="price_inside_buybox"]'));
                const priceText = await price.getText();
                const priceInt = parseInt(priceText.slice(1).split(".")[0]!);
                console.log(`price: ${priceInt}`);

                await driver.wait(until.elementLocated(By.xpath('//*[@id="tabular-buybox-truncate-1"]/span[2]/span')), 2000);
                const soldBy = await driver.findElement(By.xpath('//*[@id="tabular-buybox-truncate-1"]/span[2]/span'));
                const soldByText = await soldBy.getText();
                console.log(`soldBy: ${soldByText}`);

                resolve(priceInt < item.price && soldByText == "Amazon.com");
            } catch (error) {
                resolve(false);
            }
        });
    }
}
