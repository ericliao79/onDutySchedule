require('dotenv').config();
const dateFns = require('date-fns');
const fs = require('fs')
const schedule = require('node-schedule');
const onDutyJs = require('onDutyJs');
const colors = require('colors');
const dateNow = dateFns.format(Date.now(),  'YYYY-MM-DD HH:mm:ss')

const workDay = process.env.workDay ? process.env.workDay : '1-5'
const punchTime = process.env.punchTime ? process.env.punchTime : '10,19'

onDutyJs.config({
  'userName': process.env.userName,
  'password': process.env.password,
  'loginUrl': process.env.loginUrl
})

var j = schedule.scheduleJob('0 0 ' + punchTime + ' * * ' + workDay, function(){
  setTimeout(async () => {
    await onDutyJs.start()
    await fs.appendFile('./onDutyJs.log', dateNow + '\r\n', function (err) {
      if (err) {
        console.log(err)
      }
    })
    console.log(colors.green(dateNow))
  }, Math.round(Math.random() * (30 - 1) + 1) * 1000 * 60);
});
