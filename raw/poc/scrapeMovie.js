let puppeteer = require('puppeteer');
let fs = require('fs');
let url = 'https://www.imdb.com/search/name/?gender=male%2Cfemale&ref_=nv_cel_m';
(async () => {
  try {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
     await page.goto(url);

     let movies = await page.evaluate(() => {
      let titlesList = document.querySelectorAll('h3')
      let movieArr = []
      for (var i = 0; i < titlesList.length; i++) {
        movieArr[i] = {
          title: titlesList[i].outerText.trim(),
          //info: titlesList[i].nextElementSibling.outerText.trim(),
        };
      }
      return movieArr;
     });
     fs.writeFile("./scrape.json", JSON.stringify(movies, null, 3), (err) => {
      if (err) {
      console.error(err);
      return;
      };
      console.log("Great Success");
      });
      browser.close();
  }
  catch(err) {
      console.log(err);
  }
})();