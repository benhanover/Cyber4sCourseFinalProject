// import libraries
import { ElementHandle } from "puppeteer";
import { Collection } from "mongodb";

// import functions
import { fillFormWithMockData } from "./functions";

// import types
import { beforeAll } from "../types/index";

// import enums
import { errorEnums } from "../../server/src/enums/index";

// import next test
import { FailLogin } from "./failLogin";

const mockData = {
  failRegisterByUsername: [
    "UserName",
    "FirstName",
    "LastName",
    "01021997",
    "otherEmail@email.com",
    "myIncrediblePassword",
  ],
  failRegisterTestByEmail: [
    "otherUserName",
    "FirstName",
    "LastName",
    "01021997",
    "email@email.com",
    "myIncrediblePassword",
  ],
};

/*-----------------------------------------------------------------------------------------------------------*/

export const FailRegister = (collections: Promise<beforeAll>): void =>
  describe("FailRegister", () => {
    let User: Collection;
    beforeAll(async () => {
      User = (await collections).users;
    });

    /*-----------------------------------------------------------------------------------------------------------*/

    it("Cannot register with existing username or existing email", async (): Promise<void> => {
      const testResponse1: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://localhost:4000/user/register" &&
            (await response.status()) === 409 &&
            (await response.json()).message ===
              errorEnums.REGISTER_FAILED + errorEnums.USERNAME_TAKEN
          ) {
            resolve(true);
          }

          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });

      const RegisterButton: ElementHandle<Element> | null = await page.$(
        ".register-button"
      );
      if (RegisterButton) await RegisterButton.click();
      await page.waitForSelector("form");
      const inputs: ElementHandle<Element>[] = await page.$$("form > input");
      // sending it without the button
      await fillFormWithMockData(
        page,
        inputs.slice(0, 6),
        mockData.failRegisterByUsername
      );
      await inputs[6].click();
      expect(await testResponse1).toBe(true);
      /*-----------------------------------------------------------------------------------------------------------*/

      const testResponse2: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://localhost:4000/user/register" &&
            (await response.status()) === 409 &&
            (await response.json()).message ===
              errorEnums.REGISTER_FAILED + errorEnums.EMAIL_TAKEN
          ) {
            resolve(true);
          }
          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });

      await fillFormWithMockData(
        page,
        inputs.slice(0, 6),
        mockData.failRegisterTestByEmail
      );
      await inputs[6].click();

      expect(await testResponse2).toBe(true);
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    FailLogin(collections);
  });
