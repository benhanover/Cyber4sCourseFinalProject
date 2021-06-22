import { Collection } from 'mongodb';
import { ElementHandle, HTTPResponse } from 'puppeteer'
import { doesTokensExist , fillFormWithMockData, statusCheck} from './functions';

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

    beforeEach(async ()=>{
        await page.goto('http://localhost:3000');
        await page.waitForSelector('.login-container');
    })

    it("try to login with good email , bad password", async()=>{
        const inputs: ElementHandle<Element>[] = await page.$$('.login-container > input');
        await fillFormWithMockData(page, inputs,[ mockData.loginTest[0] , "1234"])
        const loginButton: ElementHandle<Element> |null = await page.$('.login-container > button');
        await loginButton?.click();
        console.log("login after submitting");
        
        expect(await statusCheck('http://localhost:4000/user/login', 409, errorEnums.WRONG_CREDENTIALS)).toBe(true)

        // const res204 = await page.waitForResponse('http://localhost:4000/user/login');  // options 204 response
        // console.log("login after 204", res204.status());
        // const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/login'); // relevant 
        // console.log("login after 409", rawResponse.status());
        // const response = await rawResponse.json();
        
        // expect(rawResponse.status()).toBe(409);
        // expect(response.message).toBe(errorEnums.WRONG_CREDENTIALS);
        
        const tokensExist: boolean = await doesTokensExist(page);
        expect(tokensExist).toBe(false);


    })
    it("try to login with bad email , good password", async()=>{
        const inputs: ElementHandle<Element>[] = await page.$$('.login-container > input');
        await fillFormWithMockData(page, inputs,["1234@56"  , mockData.loginTest[1]])
        const loginButton: ElementHandle<Element> |null = await page.$('.login-container > button');
        await loginButton?.click();
        console.log("login after submitting");

        expect(await statusCheck('http://localhost:4000/user/login', 409, errorEnums.NO_SUCH_USER)).toBe(true)

        // const res204 = await page.waitForResponse('http://localhost:4000/user/login');  // options 204 response
        // console.log("login after 204", res204.status());
        // const rawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/login'); // relevant 
        // const response = await rawResponse.json();
        // console.log("login after 409", rawResponse.status());

        // console.log(rawResponse.status(), response ,"fffffffffffffffff")
        // expect(rawResponse.status()).toBe(409);
        // expect(response.message).toBe(errorEnums.NO_SUCH_USER); 
        
        const tokensExist: boolean = await doesTokensExist(page);
        expect(tokensExist).toBe(false);
    })
    Login(collections)
})