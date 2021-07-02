// import libraries
import { ElementHandle } from "puppeteer";
import { Collection } from "mongodb";

// import functions
import { doesTokensExist, fillFormWithMockData } from "./functions";

// import types
import { beforeAll } from "../types/index";

// import enums
import { logsEnums } from "../../server/src/enums/index";

// import next test
import { refreshToken } from "./refreshToken";

const mockData = {
  loginTest: ["email@email.com", "myIncrediblePassword"],
};

/*-----------------------------------------------------------------------------------------------------------*/
export const Login = (collections: Promise<beforeAll>): void =>
  describe("Login", () => {
    let User: Collection;
    let AccessTokens: Collection;
    let RefreshTokens: Collection;
    beforeAll(async () => {
      User = (await collections).users;
      AccessTokens = (await collections).accessTokens;
      RefreshTokens = (await collections).refreshTokens;
    });

    /*-----------------------------------------------------------------------------------------------------------*/

    it("server response should be successful", async (): Promise<void> => {
      const rawResponse: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://192.168.1.111:4000/user/login" &&
            (await response.status()) === 200
          ) {
            resolve(await response.json());
          }
          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });

      await page.waitForSelector(".login-container");
      const inputs: ElementHandle<Element>[] = await page.$$(
        ".login-container > input"
      );
      await fillFormWithMockData(page, inputs, mockData.loginTest);
      const loginButton = await page.$(".login-button");
      await loginButton?.click();

      const response: {
        accessToken: string;
        refreshToken: string;
        message: string;
      } = await rawResponse;
      expect(response.accessToken).toMatch(
        /^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/
      );
      expect(response.refreshToken).toMatch(
        /^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/
      );
      expect(response.message).toMatch(logsEnums.LOGGED_IN_SUCCESSFULY);
    });

    /*-----------------------------------------------------------------------------------------------------------*/

    it("Cookies should have Accses & Refresh tokens", async (): Promise<void> => {
      await page.waitForTimeout(1000); // wait for tokens to get in the cookies

      const tokensExistOnRegister: boolean = await doesTokensExist(page);
      expect(tokensExistOnRegister).toBe(true);
    });

    /*-----------------------------------------------------------------------------------------------------------*/
    it("Tokens Should be saved to the database", async (): Promise<void> => {
      const accessExist = await AccessTokens.find({}).toArray();
      const refreshExist = await RefreshTokens.find({}).toArray();
      expect(accessExist.length).toEqual(1);
      expect(refreshExist.length).toEqual(1);
    });
    /*-----------------------------------------------------------------------------------------------------------*/
    refreshToken(collections);
  });
