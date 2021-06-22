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
  let firstResponse;
  let secondResponse;
  console.log("in statusCheck");
  try{

     firstResponse = await page.waitForResponse(url)
    console.log("between the responses" );
    
     secondResponse = await page.waitForResponse(url)
  }catch(e){
    console.log(e);
    
  }
  console.log("after both statusCheck");
  const status1 = firstResponse?.status()
  console.log(status1 ,"status1" ,);
  
  const status2 = secondResponse?.status()
  console.log(status2 ,"status2");
  if (status1 === expectedStatus) {
    relevantResponse = firstResponse;
  }
  else if (status2 === expectedStatus) {
    relevantResponse = secondResponse;
  }
  console.log("relevantResponse", relevantResponse);

  if (!relevantResponse) return false;
  if (!expectedMessage) return true;
  const response = await relevantResponse.json()
  console.log("messages", response.message, expectedMessage);
  if (response.message === expectedMessage) return true;
  return false;
}
// await expect(page).toFillForm('form[name="myForm"]', {
//   firstName: 'James',
//   lastName: 'Bond',
// })
