import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection, Db, MongoClient } from 'mongodb';
// import { doesTokensExist, fillFormWithMockData, statusCheck } from './functions';
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

  it('Cannot register with existing username or existing email', async ():Promise<void> => {
    const testResponse1: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        
        if(await response.url() === 'http://localhost:4000/user/register'
        && await response.status() === 409
        && (await response.json()).message === errorEnums.REGISTER_FAILED + errorEnums.USERNAME_TAKEN) {
          resolve(true);
        }
        
        // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
      });
    });

    const testResponse2: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        if(await response.url() === 'http://localhost:4000/user/register'
        && await response.status() === 409
        && (await response.json()).message === errorEnums.REGISTER_FAILED + errorEnums.EMAIL_TAKEN) {
            console.log('resolved');
            
            resolve(true);
        } 
        // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
      });
    });
    
    await page.waitForSelector("form");
    await page.waitForTimeout(1000)
    const inputs: ElementHandle<Element>[] = await page.$$('form > input');    
    // sending it without the button
    await fillFormWithMockData(page, inputs.slice(0,6), mockData.failRegisterByUsername)
    await inputs[6].click();
    expect(await testResponse1).toBe(true);
    
    
    await fillFormWithMockData(page, inputs.slice(0,6), mockData.failRegisterTestByEmail)
    await inputs[6].click();
    
    expect(await testResponse2).toBe(true);

    
  });
  FailLogin(collections)
});

  





