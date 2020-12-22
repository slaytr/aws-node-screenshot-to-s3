# serverless-screenshot-to-s3

This stack sets up a Lambda and a S3 bucket. The Lambda when invoked will navigate to the url, take a screenshot and upload 
the screenshot to the S3 bucket. 

The lambda optionally takes in an event object with a specified url to navigate to
```json
{
    "url" : "https://www.google.com"
}
```

This lambda uses <strong>chrome-aws-lambda</strong> and <strong>puppeteer-core</strong> to take the screenshots.

## Installation

### Setup
Go into the `serverless.yml` file and specify a bucket name
```yaml
# Specify your bucket name here
custom:
  bucketName: "your-bucket-name"
```

### Run

Then in this directory run:

* `npm i`
* `sls deploy`

## How to Use
Once this stack is deployed, you can either invoke the lambda through the management console or through the command line.

If by the command line, ensure that you have your aws credentials set - 
<a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html">configure aws credentials</a>

You can either invoke the function on it's own using:

`sls invoke --function screenshotToS3`

or provide a path to an event object that contains an url

`sls invoke --function screenshotToS3 --path example-event.json`

The lambda will return the entity tag and url of the object if successful in json format.
```json
{
    "screenshotUrl": "https://<your-bucket-name>.s3.amazonaws.com/<uuid-4>.png",
    "ETag": "\"5b8ca437b8eb3c9d102b53cf07bc242a\""
}
```

