# onDutySchedulle.js
onDutySchedulle is a cronJob wrap for [onDutyJs](https://github.com/PhantasWeng/onDuty.js), base on pm2.


### Install
1. Install dependencies package
`npm install` or `yarn install`

2. Set login info
  - Copy **.env.example** to **.env**
  - Set your **username** and **password** in `.env`
  - You can also set timer option
    - default workDay: 1-5
    - default punchTime: 10,19


### Run
For NPM:
Command: `npm run start` `npm run stop` or enter command `npm run` to list all options.

For Yarn:
use Command: `yarn start` to start, `yarn stop` to stop.
