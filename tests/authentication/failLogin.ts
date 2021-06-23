import { Collection } from 'mongodb';
import { ElementHandle, HTTPResponse } from 'puppeteer'
import { doesTokensExist , fillFormWithMockData} from './functions';

import { beforeAll } from '../types/index';
import {Login} from './login'

import {logsEnums , errorEnums} from "../../server/src/enums/index";

  const mockData = {
    loginTest: ['email@email.com', 'myIncrediblePassword'],
  }

//try to login with good email , bad password , check the response, no tokens
//try to login with good password bad email , check the response, no token

export const FailLogin = (collections: Promise<beforeAll>) => describe("failLogin" , () => {
    let Refreshtokens: Collection 
    let Accesstokens: Collection 
    let Users: Collection
    beforeAll( async()=>{
        Refreshtokens = (await collections).refreshTokens;
        Accesstokens = (await collections).accessTokens;
        Users =  (await collections).users;
       await page.waitForSelector('.login-container');
    })

    // beforeEach(async ()=>{
    //     await page.goto('http://localhost:3000');
    //     await page.waitForSelector('.login-container');
    // })

    it("Cannot login with wrong password or unknown user", async()=>{
        const testResponse1: any = new Promise((resolve) => {
            page.on('response', async (response) => {
              
              if(await response.url() === 'http://localhost:4000/user/login'
              && await response.status() === 409
              && (await response.json()).message === errorEnums.WRONG_CREDENTIALS) {
                resolve(true);
              }
              
              // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
            });
          });

        const testResponse2: any = new Promise((resolve) => {
            page.on('response', async (response) => {
              
              if(await response.url() === 'http://localhost:4000/user/login'
              && await response.status() === 409
              && (await response.json()).message === errorEnums.NO_SUCH_USER) {
                resolve(true);
              }
              
              // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
            });
          });
        await page.waitForSelector('.login-container');  
        const inputs: ElementHandle<Element>[] = await page.$$('.login-container > input');

        await fillFormWithMockData(page, inputs,[ mockData.loginTest[0] , "1234"])
        const loginButton: ElementHandle<Element> |null = await page.$('.login-container > button');
        await loginButton?.click();
        expect(await testResponse1).toBe(true);
        const tokensExist1: boolean = await doesTokensExist(page); 
        expect(tokensExist1).toBe(false)
        
        //   next IT need FIX
        await fillFormWithMockData(page, inputs,["1234@56"  , mockData.loginTest[1]])
        await loginButton?.click();
        expect(await testResponse2).toBe(true);
        const tokensExist2: boolean = await doesTokensExist(page); 
        expect(tokensExist2).toBe(false)
    })
     Login(collections)
});

