import { HTTPResponse, Protocol } from 'puppeteer'
import { Collection } from 'mongodb';
import { beforeAll } from '../types/index'

//401
export const refreshToken = ( collections: Promise<beforeAll> ): void => describe('refreshToken', () => {
  let User: Collection;
  let AccessTokens: Collection;
  let RefreshTokens: Collection;

  beforeAll( async () => {
    User = (await collections).users;
    AccessTokens = (await collections).accessTokens;
    RefreshTokens = (await collections).refreshTokens;
  });

  it('test that request failed and a new token is requested, and the new token is saved', async ():Promise<void> => {
    const rawResponse1: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        if(await response.url() === 'http://localhost:4000/room/all'
          && await response.status() === 401){
            console.log('resolved');
            
            resolve(true);
        } 
        // console.log(response.url(), 'status: ', response.status(), (await response.json()).message);
      });
    });
    
    const rawResponse2: any = new Promise((resolve) => {
      page.on('response', async (response) => {
        if(await response.url() === 'http://localhost:4000/user/refreshToken'
        && await response.status() === 200){
            console.log('resolved');
            
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
    await page.goto('http://localhost:3000');

    expect(await rawResponse1).toBe(true)
    expect(await rawResponse2).toBe(true)
  
    
    const rawCookies: Protocol.Network.Cookie[] = await page.cookies('http://localhost/');
    const isAccessTokenExist = Boolean(rawCookies.find(cookie => cookie.name === 'accessToken'));
    expect(isAccessTokenExist).toBe(true);

    const newAcessToken = (await AccessTokens.find({}).toArray())[0].accessToken;
    expect(newAcessToken).not.toBe(oldAccessToken);
  });
});