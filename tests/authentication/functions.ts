//  import libraries
import { Protocol, ElementHandle, Page } from "puppeteer";
import { errorEnums } from "../../server/src/enums/index";

// checks existance of both accesToken and refreshToken
export async function doesTokensExist(page: Page): Promise<boolean> {
  try {
    const rawCookies: Protocol.Network.Cookie[] = await page.cookies(
      "http://localhost/"
    );
    const accessToken: string =
      rawCookies[0].name === "accessToken"
        ? rawCookies[0].value
        : rawCookies[1].value;
    const refreshToken: string =
      rawCookies[0].name === "refreshToken"
        ? rawCookies[0].value
        : rawCookies[1].value;
    if (accessToken && refreshToken) return true;
    return false;
  } catch (e: unknown) {
    return false;
  }
}

// fills given inputs with given mock data.
export async function fillFormWithMockData(
  page: Page,
  inputArray: ElementHandle<Element>[],
  mockData: any[]
): Promise<void> {
  for (let i = 0; i < inputArray.length; i++) {
    await inputArray[i].type(mockData[i]);
  }
}
