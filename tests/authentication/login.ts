

import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection, Db, MongoClient } from 'mongodb';
import { doesTokensExist, fillFormWithMockData } from './functions';



const mockData = {
  loginTest: ['testuser@email', '8787password'],
}

//startpoint -the user logedout
//fil in the login input and submit
//check   the  tokens in cookies
//check the tokens in db
//mabey cleanup?
 
export const login = ( collection: MongoClient) => describe("Login" , () => {
 
  it('', async (): Promise<void> => {

    
  
  });

})