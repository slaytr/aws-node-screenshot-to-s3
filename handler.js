'use strict';
const { v4: uuidv4 } = require('uuid');
const chromium       = require('chrome-aws-lambda');
const AWS            = require('aws-sdk');
const S3             = new AWS.S3({
    signatureVersion: 'v4',
});

const bucketName = process.env.BUCKET_NAME;

module.exports.screenshotToS3 = async (event, context, callback) => {

    let result = null;
    let browser = null;

    try {
        // launch the browser
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        // navigate to the url and take a screenshot
        let page = await browser.newPage();
        await page.goto(event.url || 'https://www.serverless.com');
        const buffer = await page.title().then(() => {
                return page.screenshot({type: 'png'});
            }
        );

        // upload the screenshot in s3
        const bucketParams = {
            Body: buffer,
            Bucket: bucketName,
            ContentType: 'image/png',
            CacheControl: 'max-age=31536000',
            Key: uuidv4() + '.png',
            StorageClass: 'STANDARD'
        };
        result = await S3.putObject(bucketParams).promise().then((data) => {
            console.log('Successfully PUT object');
            console.log(data);
            return {
                screenshotUrl: `https://${bucketName}.s3.amazonaws.com/${bucketParams.Key}`,
                ...data
            };
        }).catch((error) => {
            console.log('Failed to PUT object');
            console.log(error);
            return error;
        });
    } catch (error) {
        return callback(null, error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return callback(null, result);
};
