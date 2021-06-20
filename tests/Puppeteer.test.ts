// import puppeteer from 'puppeteer'


// describe('Google', async () => {
//   // const browser = await puppeteer.launch({headless:false}) 
//   // const page =  await  browser.newPage();
//   beforeAll(() => {
//       page.goto('https://google.com')
//   })

//   it('should display "google" text on page', async () => {
//       await expect(page).toMatch('google')
//   })

// })


describe('Google', () => {
    
    beforeAll(async () => {
        await page.goto('https://google.com')
  })

  it('should display "google" text on page', async () => {
      await expect(page).toMatch('google')
  })

})