
//import from libraries
import { Protocol, ElementHandle } from 'puppeteer'

/*
  - tokens   V
  - db
  - network
*/

//  mockData for tests
const mockData = {
  tokensOnRegisterTest: ['3', '3', '3', '', 'q@q', '3']
}


describe('Register', () => {
    
  beforeAll(async () => {
    await page.goto('http://localhost:3000/')
  })
        
  it('Check existence of Accses & Refresh tokens in the cookies', async (): Promise<void> => {
    // checks tokens does not exist on load
    const tokensExistOnLoad: boolean = await doesTokensExist();
    expect(tokensExistOnLoad).toBe(false);

    // fill register form
    await page.waitForSelector("input");
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');
    await fillFormWithMockData(inputs, mockData.tokensOnRegisterTest)
    await inputs[6].click();

    // checks tokens exist after submitting register form
    await page.waitForResponse('http://localhost:4000/user/register');
    await page.waitForTimeout(1000);
    const tokensExistOnRegister: boolean = await doesTokensExist();
    expect(tokensExistOnRegister).toBe(true);
      })      
    })

// checks existance of both accesToken and refreshToken
async function doesTokensExist(): Promise<boolean> {
  try {
    const rawCookies: Protocol.Network.Cookie[] = await page.cookies('http://localhost/');
    const accessToken: string  = rawCookies[0].name === 'accessToken' ? rawCookies[0].value : rawCookies[1].value;
    const refreshToken: string = rawCookies[0].name === 'refreshToken' ? rawCookies[0].value : rawCookies[1].value;
    if (accessToken && refreshToken) return true;
    return false;
  }
  catch (e: unknown) {
    return false;
  }
}
  
// fills given inputs with given mock data.
async function fillFormWithMockData(inputArray: ElementHandle<Element>[], mockData: any[]): Promise<void> {
  for (let i = 0; i < inputArray.length-1; i++){
      await inputArray[i].click()
      await page.keyboard.type(mockData[i]);
    }
}

// const dimensions = await page.evaluate(() => {
//   return {
//     width: document.documentElement.clientWidth,
//     height: document.documentElement.clientHeight,
//     deviceScaleFactor: window.devicePixelRatio,
//   };
// });