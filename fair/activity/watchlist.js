let puppeteer = require("puppeteer");
let cFile = process.argv[2];
let fs = require("fs");
(async function () {
  try {
    let data = await fs.promises.readFile(cFile);
    let { url, pwd, user } = JSON.parse(data);
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"]
    });
     let tabs = await browser.pages();
     let tab = tabs[0];
     await tab.goto(url, { waitUntil: "networkidle0" });
    await tab.waitForSelector("#ap_email", { visible: true });
    await tab.type("#ap_email", user, { delay: 100 });
    await tab.type("#ap_password", pwd, { delay: 100 });
    await Promise.all([tab.click("#signInSubmit[aria-labelledby=a-autoid-0-announce]"), tab.waitForNavigation({ waitUntil: "networkidle0" })]);

    await tab.setDefaultNavigationTimeout(0);
    //watchlist opens
    await tab.waitForSelector("#imdbHeader > div.ipc-page-content-container.ipc-page-content-container--center.navbar__inner > div.sc-kpOJdX.gBwnwt.imdb-header__watchlist-button > a > div", { visible: true });
    await tab.click("#imdbHeader > div.ipc-page-content-container.ipc-page-content-container--center.navbar__inner > div.sc-kpOJdX.gBwnwt.imdb-header__watchlist-button > a > div");
    await tab.goto('https://www.imdb.com/user/ur118181572/watchlist?ref_=nv_usr_wl_all_0');
    
    let movies = await tab.evaluate(() => {
        let titlesList = document.querySelectorAll('h3')
        let movieArr = [];
        for (var i = 0; i < titlesList.length; i++) {
          movieArr[i] = {
            title: titlesList[i].innerText,
            info: titlesList[i].nextSibling.innerText,
          };
        }
        return movieArr;
    });
    fs.writeFile("./watch.json", JSON.stringify(movies, null, 3), (err) => {
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