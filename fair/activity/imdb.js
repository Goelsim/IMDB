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

    await tab.waitForSelector("#imdbHeader-navDrawerOpen--desktop", { visible : true});
    await tab.click("#imdbHeader-navDrawerOpen--desktop");

    await tab.goto("https://www.imdb.com/chart/top/?ref_=nv_mv_250", {waitUntil: "networkidle0"});

    for(let i = 1; i <= 15; i++) {
        await tab.waitForSelector("#main > div > span > div > div > div.lister > table > tbody > tr:nth-child(" + i + ") > td.watchlistColumn > div", { visible : true});
        await tab.click("#main > div > span > div > div > div.lister > table > tbody > tr:nth-child(" + i + ") > td.watchlistColumn > div");
    }

    //watchlist opens
    await tab.waitForSelector("#imdbHeader > div.ipc-page-content-container.ipc-page-content-container--center.navbar__inner > div.sc-kpOJdX.gBwnwt.imdb-header__watchlist-button > a > div", { visible: true });
    await tab.click("#imdbHeader > div.ipc-page-content-container.ipc-page-content-container--center.navbar__inner > div.sc-kpOJdX.gBwnwt.imdb-header__watchlist-button > a > div");
    
}
catch(err) {
    console.log(err);
}
})();