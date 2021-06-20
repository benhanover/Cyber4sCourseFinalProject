
//import from libraries
import { Protocol, ElementHandle, Page, HTTPResponse } from 'puppeteer'

/*
  - tokens   V
  - db
  - network
*/

//  mockData for tests
const mockData = {
  registerTest: ['3', '3', '3', '', 'q@q', '3'],
}

jest.setTimeout(8000);
describe('Register', () => {
 
  let testPage: Page;
  beforeAll(async () => {
    await page.goto('http://localhost:3000/')
  })
  // afterEach (async () => {
  //   await page.close();
  // })
  it('Cookies shouldn\'t have Accses & Refresh tokens on open', async (): Promise<void> => {
    // checks tokens does not exist on load
    const tokensExistOnLoad: boolean = await doesTokensExist(page);
    expect(tokensExistOnLoad).toBe(false);
  });

  it('Response should have expected stucture', async (): Promise<void> => {
    // fill register form
    await page.waitForSelector("input");
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');
    await fillFormWithMockData(page, inputs, mockData.registerTest)
    await inputs[6].click();
    
    // checks response has expected structure
    await page.waitForResponse('http://localhost:4000/user/register');
    const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/register');
    expect(rawResponse.status()).toEqual(200);
    const response: {accessToken: string, refreshToken: string, message: string} = await rawResponse.json();
  
    expect(response.accessToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.refreshToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.message).toMatch(/^Successfuly Registered$/);
      
  });

  it('Cookies should have Accses & Refresh tokens', async (): Promise<void> => {
    await page.waitForTimeout(1000);
    const tokensExistOnRegister: boolean = await doesTokensExist(page);
    expect(tokensExistOnRegister).toBe(true);
      })      
  
    })




















// checks existance of both accesToken and refreshToken
async function doesTokensExist(page: Page): Promise<boolean> {
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
async function fillFormWithMockData(page: Page, inputArray: ElementHandle<Element>[], mockData: any[]): Promise<void> {
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