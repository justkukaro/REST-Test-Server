var express = require('express');
const axios = require('axios');
const fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/read-pdf', async function (req, res, next) {
    await downloadFile('https://press.knou.ac.kr/epub/pdf/0000000000000003161900001.pdf', 'result.pdf')
    res.render('index', {title: 'Express'});
});

async function downloadFile(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);

    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
        headers: {
            "host": "press.knou.ac.kr",
            "connection": "keep-alive",
            "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"`,
            "sec-ch-ua-mobile": "?0",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
            "sec-ch-ua-platform": `"macOS"`,
            "Accept": "*/*",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://press.knou.ac.kr/common/supportPdfViewer.do?k=&cnnc=9907667&cmdt=9788920023002&s=0",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": "JSESSIONID=aaa-MexfDQhYWfrwtF72x9rmhkUaHys-pgGI2ahaypcqTvFf3sGspbsvWMo3",
        },
    }).then(response => {

        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                //no need to call the reject here, as it will have been called in the
                //'error' stream;
            });
        });
    });
}

module.exports = router;
