
//import from libraries
import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection, Db, MongoClient } from 'mongodb';
import { doesTokensExist, fillFormWithMockData } from './functions';
import { beforeAll } from '../types/index';
import { Logout } from './logout';

//  mockData for tests
const mockData = {
  registerTest: ['UserName', 'FirstName', 'LastName', '01021997', 'email@email.com', 'myIncrediblePassword'],
}

//  Register test
export const Register = (collections: Promise<beforeAll>): void => describe('Register', () => {
  let User: Collection;
  let AccessTokens: Collection;
  let RefreshTokens: Collection;

  beforeAll( async () => {
    
    User = (await collections).users;
    AccessTokens = (await collections).accessTokens;
    RefreshTokens = (await collections).refreshTokens;
    
  })

  
  /*-----------------------------------------------------------------------------------------------------------*/
  
  it('Cookies shouldn\'t have Accses & Refresh tokens on open', async (): Promise<void> => {
    await page.waitForSelector('form')
    // checks tokens does not exist on load
    const tokensExistOnLoad: boolean = await doesTokensExist(page);
    expect(tokensExistOnLoad).toBe(false);
  });
/*-----------------------------------------------------------------------------------------------------------*/
  it('Database has no users on open', async (): Promise<void> => {
    const usersExist = await User.find({}).toArray();
    expect(usersExist.length).toEqual(0);
})
/*-----------------------------------------------------------------------------------------------------------*/
  it('Response should have expected stucture', async (): Promise<void> => {
    page.on('response', async (response) => {
        
      // if(await response.url() === 'http://localhost:4000/user/register'
      // && await response.status() === 409
      // && (await response.json()).message === errorEnums.REGISTER_FAILED + errorEnums.USERNAME_TAKEN) {
      //   resolve(true);
      // }
      
      console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
    });
    
    
    // fill register form
    await page.waitForSelector("form");
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');
    // sending it without the button
    const inputs2 = inputs.slice(0,6);
    await fillFormWithMockData(page, inputs2, mockData.registerTest)
    await inputs[6].click();
    
    console.log("before");
    
    // checks response has expected structure
    await page.waitForResponse('http://localhost:4000/user/register');  // options 204 response
    console.log("between");
    const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/register'); // relevant response
    console.log("after");
    expect(rawResponse.status()).toEqual(200);
    const response: {accessToken: string, refreshToken: string, message: string} = await rawResponse.json();
    
    expect(response.accessToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.refreshToken).toMatch(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/);
    expect(response.message).toMatch(/^Successfuly Registered$/);
    
      
  });
/*-----------------------------------------------------------------------------------------------------*/
  it('Cookies should have Accses & Refresh tokens', async (): Promise<void> => {
    await page.waitForTimeout(1000); // wait for tokens to get in the cookies
    
    const tokensExistOnRegister: boolean = await doesTokensExist(page);
    expect(tokensExistOnRegister).toBe(true);
  });
  
  /*-----------------------------------------------------------------------------------------------------*/
  it("User should appear in the database", async (): Promise<void> => {
    const usersExist = await User.find({}).toArray();
    expect(usersExist.length).toEqual(1);
    expect(usersExist[0].username).toBe(mockData.registerTest[0]);
  })

  it('Tokens Should be saved to the database', async ():Promise<void> => {
    const accessExist = await AccessTokens.find({}).toArray();
    const refreshExist = await RefreshTokens.find({}).toArray();
    expect(accessExist.length).toEqual(1);
    expect(refreshExist.length).toEqual(1);
  });

  Logout(collections);
})



 /*-----------------------------------------------------------------------------------------------------*/  
 