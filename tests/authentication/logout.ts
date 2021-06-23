// import libraries
import { Collection } from 'mongodb';
import { ElementHandle, HTTPResponse } from 'puppeteer'

// import functions
import { doesTokensExist } from './functions';

// import enums
import { logsEnums } from "../../server/src/enums/index";

// import types
import { beforeAll } from '../types/index';

// import next test
import { FailRegister } from './failRegister'

/*-----------------------------------------------------------------------------------------------------------*/

export const Logout = (collections: Promise<beforeAll>) => describe("Logout" , () => {
    let Refreshtokens: Collection 
    let Accesstokens: Collection 

    beforeAll( async()=>{
        Refreshtokens = (await collections).refreshTokens;
        Accesstokens = (await collections).accessTokens;
        page.waitForSelector('div > button');
    })
/*-----------------------------------------------------------------------------------------------------------*/

    it('Cookies should have Accses & Refresh tokens', async (): Promise<void> => {
        const tokensExist: boolean = await doesTokensExist(page);
        expect(tokensExist).toBe(true);
        
    });
/*-----------------------------------------------------------------------------------------------------------*/
    
    it('After logging out server response should be logged out succesfuly', async (): Promise<void> => {
        const logOutButton: ElementHandle<Element>[]  = await page.$$('div > button'); 
        await logOutButton[1].click();
        await page.waitForResponse('http://localhost:4000/user/logout');  // options 204 response
        const response: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/logout'); // relevant response
        expect(response.status()).toBe(200); 
        expect(response.ok()).toBe(true);
        expect((await response.json()).message).toBe(logsEnums.LOGGED_OUT_SUCCESSFULY); 
        
    });
/*-----------------------------------------------------------------------------------------------------------*/

    it('after logging out no tokens shoul be in cookies', async (): Promise<void> => {
        const tokensExistOnRegister: boolean = await doesTokensExist(page);
        expect(tokensExistOnRegister).toBe(false);
    });
/*-----------------------------------------------------------------------------------------------------------*/

    it('tokens should be deleted from the database', async (): Promise<void> => {
        
        const refreshInDb =  await Refreshtokens.find({}).toArray();
        const accessInDb =  await Accesstokens.find({}).toArray(); 
        expect(refreshInDb.length).toBe(0);
        expect(accessInDb.length).toBe(0);
    });

/*-----------------------------------------------------------------------------------------------------------*/
    FailRegister(collections);
})