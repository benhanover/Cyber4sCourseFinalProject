// import libraies
import {  Protocol } from 'puppeteer'
import { Collection } from 'mongodb';

// import types
import { beforeAll } from '../types/index'

/*-----------------------------------------------------------------------------------------------------------*/

export const refreshToken = ( collections: Promise<beforeAll> ): void => describe('refreshToken', () => {
  let User: Collection;
  let AccessTokens: Collection;
  let RefreshTokens: Collection;

  beforeAll( async () => {
    User = (await collections).users;
    AccessTokens = (await collections).accessTokens;
    RefreshTokens = (await collections).refreshTokens;
  });
/*-----------------------------------------------------------------------------------------------------------*/

  it('test that request failed and a new token is requested, and the new token is saved', async ():Promise<void> => {
    const rawResponse1: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        if(await response.url() === 'http://192.168.1.111:4000/user/validator'
          && await response.status() === 401){
            // console.log('resolved');
            
            resolve(true);
        } 
        // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
      });
    });
    
    const rawResponse2: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        if(await response.url() === 'http://192.168.1.111:4000/user/refreshToken'
        && await response.status() === 200){
            // console.log('resolved');
            
            resolve(true);
        } 
        // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
      });
    });
    
    // delete from the DB
    const oldAccessToken = (await AccessTokens.find({}).toArray())[0].accessToken;
    await AccessTokens.drop();
    
    // delete from the browser
    await page.deleteCookie({name: 'accessToken'});

    // refresh page
    await page.goto('http://192.168.1.111:3000');

    // test that we failed to request without accestoken
    expect(await rawResponse1).toBe(true)
    // test that we recived a new token
    expect(await rawResponse2).toBe(true)
  
    
    const rawCookies: Protocol.Network.Cookie[] = await page.cookies('http://192.168.1.111/');
    const isAccessTokenExist = Boolean(rawCookies.find(cookie => cookie.name === 'accessToken'));
    // test that we succesfully saved a new token in the browser
    expect(isAccessTokenExist).toBe(true);

    const newAcessToken = (await AccessTokens.find({}).toArray())[0].accessToken;
    // test that this access token is not the same as before
    expect(newAcessToken).not.toBe(oldAccessToken);
  });
});