// import libraries
import { Collection } from "mongodb";
import { ElementHandle } from "puppeteer";

// import functions
import { doesTokensExist, fillFormWithMockData } from "./functions";

// import types
import { beforeAll } from "../types/index";

// import enums
import { errorEnums } from "../../server/src/enums/index";

// import next test
import { Login } from "./login";

const mockData = {
  loginTest: ["email@email.com", "myIncrediblePassword"],
};

/*-----------------------------------------------------------------------------------------------------------*/

export const FailLogin = (collections: Promise<beforeAll>) =>
  describe("failLogin", () => {
    let Users: Collection;

    beforeAll(async () => {
      Users = (await collections).users;
    });

    /*-----------------------------------------------------------------------------------------------------------*/

    it("Cannot login with wrong password or unknown user", async () => {
      const testResponse1: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://192.168.1.111:4000/user/login" &&
            (await response.status()) === 409 &&
            (await response.json()).message === errorEnums.WRONG_CREDENTIALS
          ) {
            resolve(true);
          }

          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });

      // rediret to login page
      const loginButtonFromRegPage: ElementHandle<Element> | null =
        await page.$(".login-btn");
      if (loginButtonFromRegPage) await loginButtonFromRegPage.click();

      await page.waitForSelector(".login-container");
      const inputs: ElementHandle<Element>[] = await page.$$(
        ".login-container > input"
      );

      await fillFormWithMockData(page, inputs, [mockData.loginTest[0], "1234"]);
      const loginButton: ElementHandle<Element> | null = await page.$(
        ".login-button"
      );
      await loginButton?.click();
      expect(await testResponse1).toBe(true);
      const tokensExist1: boolean = await doesTokensExist(page);
      expect(tokensExist1).toBe(false);
      /*-----------------------------------------------------------------------------------------------------------*/

      const testResponse2: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://192.168.1.111:4000/user/login" &&
            (await response.status()) === 409 &&
            (await response.json()).message === errorEnums.NO_SUCH_USER
          ) {
            resolve(true);
          }

          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });

      //   next IT need FIX
      await fillFormWithMockData(page, inputs, [
        "1234@56",
        mockData.loginTest[1],
      ]);
      await loginButton?.click();
      expect(await testResponse2).toBe(true);
      const tokensExist2: boolean = await doesTokensExist(page);
      expect(tokensExist2).toBe(false);
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    Login(collections);
  });
