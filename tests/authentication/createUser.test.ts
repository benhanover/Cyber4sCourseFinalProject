
//import from libraries
import Cookies from 'js-cookie';


/*
  - tokens
  - db
  - network
*/

describe('Register', () => {
    
  beforeAll(async () => {
    await page.goto('http://localhost:3000/')
  })
        
      it('Check existence of Accses & Refresh tokens in the cookies', async () => {
        await page.waitForSelector("input"); 
           const inputs = await page.$$('form > input');
        for(let i =0; i< 6;i++){
            await inputs[i].click()
            await page.keyboard.type('3');
            // jest.setTimeout(11000);
        }
        await inputs[6].click();
      })      
    })



      // const inputs = await page.$$('form > input');
        // for (let i = 0; i < 7; i ++) {
        //   inputs[i].click();
        //   inputs[i].type('1234')
        // }
        
        // const input: any = await page.$('form > input');
        // await input.click()
        // await input.type('testing')

      //    const inputs = await page.$$('form > input');
      //   for(let i =0; i< 6;i++){
      //       await inputs[i].click()
      //       await page.keyboard.type('3');
      //   }
      //   await inputs[6].click();
      // })


// const accessToken = Cookies.get('accessToken');
// const refreshToken = Cookies.get('refreshToken');

// const dimensions = await page.evaluate(() => {
//   return {
//     width: document.documentElement.clientWidth,
//     height: document.documentElement.clientHeight,
//     deviceScaleFactor: window.devicePixelRatio,
//   };
// });