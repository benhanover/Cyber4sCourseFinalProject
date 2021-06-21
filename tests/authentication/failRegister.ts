import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection, Db, MongoClient } from 'mongodb';
import { doesTokensExist, fillFormWithMockData } from './functions';
import {beforeAll} from '../types/index'
import {FailLogin} from './failLogin'
import {errorEnums} from "../../server/src/enums/index";

const mockData = {
    failRegisterByUsername: ['UserName', 'FirstName', 'LastName', '01021997', 'otherEmail@email.com', 'myIncrediblePassword'],
    failRegisterTestByEmail: ['otherUserName', 'FirstName', 'LastName', '01021997', 'email@email.com', 'myIncrediblePassword']
  }


let AccessTokens: Collection;
let RefreshTokens: Collection;

export const FailRegister = ( collections: Promise<beforeAll> ): void => describe('FailRegister', () => {
  let User: Collection;
  beforeAll( async () => {
    User = (await collections).users;
    AccessTokens = (await collections).accessTokens;
    RefreshTokens = (await collections).refreshTokens;
  })

/*-----------------------------------------------------------------------------------------------------------*/

  it('Cannot register with existing username', async ():Promise<void> => {
      await page.waitForSelector("form");
      await page.waitForTimeout(1000)
      const inputs: ElementHandle<Element>[] = await page.$$('form > input');
      // sending it without the button
      const inputs2: ElementHandle<Element>[] = inputs.slice(0,6);
      await fillFormWithMockData(page, inputs2, mockData.failRegisterByUsername)
      await inputs[6].click();
      
      // checks response has expected structure
      await page.waitForResponse('http://localhost:4000/user/register');  // options 204 response
      const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/register'); // relevant response
      expect(rawResponse.status()).toEqual(409);
      const response: { message: string } = await rawResponse.json();
      
      expect(response.message).toMatch(errorEnums.REGISTER_FAILED + errorEnums.USERNAME_TAKEN);
  });

/*-----------------------------------------------------------------------------------------------------------*/

    it('Cannot register with existing email', async (): Promise<void> => {
        await page.waitForTimeout(1000)
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');
    // sending it without the button
    const inputs2: ElementHandle<Element>[] = inputs.slice(0,6);
    await fillFormWithMockData(page, inputs2, mockData.failRegisterTestByEmail)
    await inputs[6].click();
    
    // checks response has expected structure
    await page.waitForResponse('http://localhost:4000/user/register');  // options 204 response
    const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/register'); // relevant response
    expect(rawResponse.status()).toEqual(409);
    const response: { message: string } = await rawResponse.json();
    
    expect(response.message).toMatch(errorEnums.REGISTER_FAILED + errorEnums.EMAIL_TAKEN);
  });
  FailLogin(collections)
});





