# Amazon Purchase Bot

## Configuration

-   Please download the latest version of the ChromeDriver from https://chromedriver.chromium.org/downloads and ensure it can be found on your PATH.
-   Use `.env.example` to generate a new .env file
-   Use `./src/config.ts` to specify
    -   url and maximum price of the product,
    -   seller of the product.

### Start Server

```
npm start
```

## Testing

-   To start tests run: `npm test`
-   To start tests with coverage run: `npm run test:coverage`
