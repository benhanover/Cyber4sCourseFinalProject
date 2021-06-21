import { HTTPResponse, Protocol } from 'puppeteer'
import { Collection } from 'mongodb';
import { beforeAll } from '../types/index'


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
    // delete from the DB
    const oldAccessToken = (await AccessTokens.find({}).toArray())[0].accessToken;
    await AccessTokens.drop();
    
    // delete from the browser
    await page.deleteCookie({name: 'accessToken'});

    // refresh page
    await page.goto('http://localhost:3000');
    
    const createRoomRawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/room/all'); 
    expect(createRoomRawResponse.status()).toBe(401);
    
    await page.waitForResponse('http://localhost:4000/user/refreshToken');
    const refreshRawResponse: HTTPResponse = await page.waitForResponse('http://localhost:4000/user/refreshToken');
    expect(refreshRawResponse.status()).toBe(200);
    
    const rawCookies: Protocol.Network.Cookie[] = await page.cookies('http://localhost/');
    console.log('222222222222222222222222222222222222222222222222222222');
    console.log(rawCookies);
    
    const isAccessTokenExist = Boolean(rawCookies.find(cookie => cookie.name === 'accessToken'));
    expect(isAccessTokenExist).toBe(true);

    const newAcessToken = (await AccessTokens.find({}).toArray())[0].accessToken;
    expect(newAcessToken).not.toBe(oldAccessToken);
  });
});