//  import libraries
import { Protocol, ElementHandle, Page } from 'puppeteer'
import {errorEnums} from "../../server/src/enums/index";


// checks existance of both accesToken and refreshToken
export async function doesTokensExist(page: Page): Promise<boolean> {
    try {
      const rawCookies: Protocol.Network.Cookie[] = await page.cookies('http://localhost/');
      const accessToken: string = rawCookies[0].name === 'accessToken' ? rawCookies[0].value : rawCookies[1].value;
      const refreshToken: string = rawCookies[0].name === 'refreshToken' ? rawCookies[0].value : rawCookies[1].value;
      if (accessToken && refreshToken) return true;
      return false;
    }
    catch (e: unknown) {
      return false;
    }
}
    
// fills given inputs with given mock data.
export async function fillFormWithMockData(page: Page, inputArray: ElementHandle<Element>[], mockData: any[]): Promise<void> {
    for (let i = 0; i < inputArray.length; i++){
        await inputArray[i].type(mockData[i]); 
    }
}


// checks response statuses are as expected
export async function statusCheck(url: string, expectedStatus: number, expectedMessage?: string): Promise<boolean> {
  let relevantResponse;
  const firstResponse = await page.waitForResponse(url)
  const secondResponse = await page.waitForResponse(url)
  const status1 = firstResponse.status()
  const status2 = secondResponse.status()
  if (status1 === expectedStatus) {
    relevantResponse = firstResponse;
  }
  else if (status2 === expectedStatus) {
    relevantResponse = secondResponse;
  }

  if (!relevantResponse) return false;
  if (!expectedMessage) return true;
  const response = await relevantResponse.json()
  expect(response.message).toMatch(expectedMessage);
  
  return true;
}
// await expect(page).toFillForm('form[name="myForm"]', {
//   firstName: 'James',
//   lastName: 'Bond',
// })
