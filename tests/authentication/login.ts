import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection } from 'mongodb';
import { doesTokensExist, fillFormWithMockData } from './functions';
import { beforeAll } from '../types/index'
import { logsEnums } from "../../server/src/enums/index";
import { refreshToken } from './refreshToken';




const mockData = {
  loginTest: ['email@email.com', 'myIncrediblePassword'],
}

//startpoint -the user logedout-V
//fil in the login input and submit -V
//check   the  tokens in cookies-V
//check the tokens in db
//mabey cleanup?

let AccessTokens: Collection;
let RefreshTokens: Collection;

export const Login = ( collections: Promise<beforeAll> ): void => describe('Login', () => {
  let User: Collection;
  beforeAll( async () => {
    User = (await collections).users;
    AccessTokens = (await collections).accessTokens;
    RefreshTokens = (await collections).refreshTokens;
  })

/*-----------------------------------------------------------------------------------------------------------*/

  it('server response should be successful', async ():Promise<void> => {
    await page.waitForSelector('.login-container');
    const inputs: ElementHandle<Element>[] = await page.$$('.login-container > input');
    await fillFormWithMockData(page, inputs, mockData.loginTest)
    const loginButton = await page.$('.login-container > button');
    await loginButton?.click();

    await page.waitForResponse('http://localhost:4000/user/login');  // options 204 response
    const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/login'); // relevant 
    expect(rawResponse.status()).toEqual(200);
    
    const response: {accessToken: string, refreshToken: string, message: string} = await rawResponse.json();
    expect(response.accessToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.refreshToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.message).toMatch(logsEnums.LOGGED_IN_SUCCESSFULY);

  });

/*-----------------------------------------------------------------------------------------------------------*/

  it('Cookies should have Accses & Refresh tokens', async (): Promise<void> => {
    await page.waitForTimeout(1000); // wait for tokens to get in the cookies
    
    const tokensExistOnRegister: boolean = await doesTokensExist(page);
    expect(tokensExistOnRegister).toBe(true);
  });
  
/*-----------------------------------------------------------------------------------------------------------*/
  it('Tokens Should be saved to the database', async ():Promise<void> => {
    const accessExist = await AccessTokens.find({}).toArray();
    const refreshExist = await RefreshTokens.find({}).toArray();
    expect(accessExist.length).toEqual(1);
    expect(refreshExist.length).toEqual(1);
  });
  refreshToken(collections)
});





