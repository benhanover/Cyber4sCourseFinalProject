// import libraries
import { Collection } from "mongodb";
import { ElementHandle, HTTPResponse } from "puppeteer";

// import functions
import { doesTokensExist } from "./functions";

// import enums
import { logsEnums } from "../../server/src/enums/index";

// import types
import { beforeAll } from "../types/index";

// import next test
import { FailRegister } from "./failRegister";

/*-----------------------------------------------------------------------------------------------------------*/

export const Logout = (collections: Promise<beforeAll>) =>
  describe("Logout", () => {
    let Refreshtokens: Collection;
    let Accesstokens: Collection;

    beforeAll(async () => {
      Refreshtokens = (await collections).refreshTokens;
      Accesstokens = (await collections).accessTokens;
      page.waitForSelector(".profile-menu-button");
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    it("Cookies should have Accses & Refresh tokens", async (): Promise<void> => {
      const tokensExist: boolean = await doesTokensExist(page);
      expect(tokensExist).toBe(true);
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    it("After logging out server response should be logged out succesfuly", async (): Promise<void> => {
      const rawResponse: any = new Promise((resolve) => {
        page.on("response", async (response) => {
          if (
            (await response.url()) === "http://192.168.1.111:4000/user/logout" &&
            (await response.status()) === 200 &&
            response.ok() === true
          ) {
            resolve(await response.json());
          }
          // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
        });
      });
      await page.click(".profile-menu-button");
      const logOutButton: ElementHandle<Element> | null = await page.$(
        ".logout-button"
      );
      if (logOutButton) await logOutButton.click();
      // expect(response.ok()).toBe(true);
      expect((await rawResponse).message).toBe(
        logsEnums.LOGGED_OUT_SUCCESSFULY
      );
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    it("after logging out no tokens should be in cookies", async (): Promise<void> => {
      const tokensExistOnRegister: boolean = await doesTokensExist(page);
      expect(tokensExistOnRegister).toBe(false);
    });
    /*-----------------------------------------------------------------------------------------------------------*/

    it("tokens should be deleted from the database", async (): Promise<void> => {
      const refreshInDb = await Refreshtokens.find({}).toArray();
      const accessInDb = await Accesstokens.find({}).toArray();
      expect(refreshInDb.length).toBe(0);
      expect(accessInDb.length).toBe(0);
    });

    /*-----------------------------------------------------------------------------------------------------------*/
    FailRegister(collections);
  });
