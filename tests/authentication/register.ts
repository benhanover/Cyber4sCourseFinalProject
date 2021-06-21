
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
  beforeAll( async () => {
    User = (await collections).users;
  })

  
  /*-----------------------------------------------------------------------------------------------------------*/
  
  it('Cookies shouldn\'t have Accses & Refresh tokens on open', async (): Promise<void> => {
    await page.waitForSelector('input')
    // checks tokens does not exist on load
    const tokensExistOnLoad: boolean = await doesTokensExist(page);
    expect(tokensExistOnLoad).toBe(false);
  });
/*-----------------------------------------------------------------------------------------------------------*/
  it('Database has no users on open', async (): Promise<void> => {
    const usersExist = await User.find({}).toArray();
    console.log(usersExist.length);
    expect(usersExist.length).toEqual(0);
})
/*-----------------------------------------------------------------------------------------------------------*/
  it('Response should have expected stucture', async (): Promise<void> => {
    // fill register form
    await page.waitForSelector("input");
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');
    await fillFormWithMockData(page, inputs, mockData.registerTest)
    await inputs[6].click();
    
    // checks response has expected structure
    await page.waitForResponse('http://localhost:4000/user/register');  // options 204 response
    const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/register'); // relevant response
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
  Logout(collections);
})



 /*-----------------------------------------------------------------------------------------------------*/  
 