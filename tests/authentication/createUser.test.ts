
//import from libraries
import { ElementHandle, HTTPResponse } from 'puppeteer'
import { Collection, Db, MongoClient } from 'mongodb';
require("dotenv").config();
import { doesTokensExist, fillFormWithMockData } from './functions';

/*
  - tokens   V
  - db
  - network   V
*/

//  mockData for tests
const mockData = {
  registerTest: ['testUsername', 'testuserfirstname', 'testuserlastname', '01021997', 'testuser@email', '8787password'],
}

// Tests time configuration - for each 'describe'
jest.setTimeout(15000);


//  Register test
describe('Register', () => {
  
  /*settings-------------------------------------------------------------------------------------------------*/
  //  test's global vars
  let connection: MongoClient;
  let db: Db;
  let User: Collection;
  
  // actions to do before all tests.
  beforeAll(async () => {
    await page.goto('http://localhost:3000/')
    connection = new MongoClient (`mongodb://localhost:27017/${process.env.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await connection.connect()
    db = await connection.db(process.env.DB);
    User = db.collection("users" );
  });
 
 
  // actions to do after all tests.
  afterAll(async () => {
    await db.dropDatabase();
    connection.close();

  })    
  
 /*-----------------------------------------------------------------------------------------------------------*/

  it('Cookies shouldn\'t have Accses & Refresh tokens on open', async (): Promise<void> => {
    await page.waitForSelector('input')
    // await page.waitForResponse('http://localhost:4/')
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
  })  
  
})

   
    
