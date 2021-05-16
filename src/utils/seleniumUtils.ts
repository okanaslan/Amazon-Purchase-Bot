import { Browser, Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import { Item } from "../models/item";
import { Items } from "../data/items";

export class SeleniumUtils {
    static async open() {
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        try {
            await driver.get("http://www.google.com/ncr");
            await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
            await driver.wait(until.titleIs("webdriver - Google Search"), 2000);
        } finally {
            await driver.quit();
        }
    }

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
            const loginButton = await driver.findElement(By.xpath('//*[@id="nav-link-accountList"]'));
            await loginButton.click();

            await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_email"]')));
            const emailTextField = await driver.findElement(By.xpath('//*[@id="ap_email"]'));
            await emailTextField.sendKeys(process.env.EMAIL!, Key.RETURN);

            await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_password"]')));
            const passwordTextField = await driver.findElement(By.xpath('//*[@id="ap_password"]'));
            await passwordTextField.sendKeys(process.env.PASSWORD!, Key.RETURN);

            await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_email"]')));

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

                await driver.wait(until.elementLocated(By.xpath('//*[@id="buybox-see-all-buying-choices"]/span/a')), 2000);
                const seeBuyingOptions = await driver.findElement(By.xpath('//*[@id="buybox-see-all-buying-choices"]/span/a'));
                await seeBuyingOptions.click();

                await driver.wait(until.elementLocated(By.name("submit.addToCart")), 2000);
                const price = await driver.findElement(By.xpath('//*[@id="aod-price-1"]/span/span[2]/span[2]'));
                const priceText = await price.getText();
                const priceInt = parseInt(priceText.split(",").join(""));
                // console.log(`price: ${priceInt}`);

                await driver.wait(until.elementLocated(By.name("submit.addToCart")), 2000);
                const soldBy = await driver.findElement(By.xpath('//*[@id="aod-offer-soldBy"]/div/div/div[2]/a'));
                const soldByText = await soldBy.getText();
                // console.log(`soldBy: ${soldByText}`);

                if (priceInt < item.price && soldByText == "Amazon") {
                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="buy-now-button"]')), 2000);
                    // const buyNowButton = await driver.findElement(By.xpath('//*[@id="buy-now-button"]'));
                    // await buyNowButton.click();

                    await driver.wait(until.elementLocated(By.name("submit.addToCart")), 2000);
                    const addtoCartButton = await driver.findElement(By.name("submit.addToCart"));
                    await addtoCartButton.click();

                    await driver.wait(until.elementLocated(By.xpath('//*[@id="hlb-ptc-btn-native"]')), 2000);
                    const proceedToCheckoutButton = await driver.findElement(By.xpath('//*[@id="hlb-ptc-btn-native"]'));
                    await proceedToCheckoutButton.click();

                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="ap_password"]')));
                    // const passwordTextField = await driver.findElement(By.xpath('//*[@id="ap_password"]'));
                    // await passwordTextField.sendKeys(process.env.PASSWORD!, Key.RETURN);

                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="address-book-entry-0"]/div[2]/span/a')));
                    // const addressButton = await driver.findElement(By.xpath('//*[@id="address-book-entry-0"]/div[2]/span/a'));
                    // await addressButton.click();

                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="shippingOptionFormId"]/div[1]/div[2]/div/span[1]/span/input')));
                    // const continueButton = await driver.findElement(By.xpath('//*[@id="shippingOptionFormId"]/div[1]/div[2]/div/span[1]/span/input'));
                    // await continueButton.click();

                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="pp-2hKQiX-71"]')));
                    // const creditCardButton = await driver.findElement(By.xpath('//*[@id="pp-2hKQiX-71"]'));
                    // await creditCardButton.click();
                    //
                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="pp-2hKQiX-114"]/div/label/span/span')));
                    // const currencyButton = await driver.findElement(By.xpath('//*[@id="pp-2hKQiX-114"]/div/label/span/span'));
                    // await currencyButton.click();
                    //
                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="pp-2hKQiX-121"]/span/input')));
                    // const continueButton2 = await driver.findElement(By.xpath('//*[@id="pp-2hKQiX-121"]/span/input'));
                    // await continueButton2.click();

                    // await driver.wait(until.elementLocated(By.xpath('//*[@id="placeYourOrder"]/span/input')));
                    // const placeOrderButton = await driver.findElement(By.xpath('//*[@id="placeYourOrder"]/span/input'));
                    // await placeOrderButton.click();

                    // await driver.wait(until.elementLocated(By.xpath("/html/body/div[2]/div/div/form/span/input[17]")));
                    // const continueButton = await driver.findElement(By.xpath("/html/body/div[2]/div/div/form/span/input[17]"));
                    // await continueButton.click();
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }
}
