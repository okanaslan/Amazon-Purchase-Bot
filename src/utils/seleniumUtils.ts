import { By, until, WebDriver } from "selenium-webdriver";

export class SeleniumUtils {
    static isElementExists(driver: WebDriver, xpath: string, timeout = 2000): Promise<boolean> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<boolean>(async (resolve) => {
            try {
                await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
                await driver.findElement(By.xpath(xpath));
                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async clickIfExists(driver: WebDriver, xpath: string, identifier?: string, timeout = 2000) {
        try {
            if (await SeleniumUtils.isElementExists(driver, xpath, timeout)) {
                const button = await driver.findElement(By.xpath(xpath));
                await button.click();
            } else {
                console.log(`${identifier} doesn't exits.`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
