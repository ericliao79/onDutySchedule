require('dotenv').config();
const dateFns = require('date-fns');
const fs = require('fs')
const schedule = require('node-schedule');
const onDutyJs = require('onDutyJs');
const colors = require('colors');
const dateNow = dateFns.format(Date.now(),  'YYYY-MM-DD HH:mm:ss')

const workDay = process.env.workDay ? process.env.workDay : '1-5'
const punchTime = process.env.punchTime ? process.env.punchTime : '10,19'

const randomMax = process.env.randomMax ? process.env.randomMax : 15
const randomMin = process.env.randomMin ? process.env.randomMin : 1
// telegramBot
if (process.env.userID && process.env.userID.length > 0) {
  var bot = require('./telegramBot.js');
  const userID = process.env.userID
  // bot.botAlert('msg')
  // bot.botSuccess('msg')
  bot.botSuccess('OnDutySchedule START. @' +  dateNow)
  // bot.bot.onText(/\/on/, (msg, match) => {
  //   const resp = `🚨 <strong>TEST</strong>\n<pre>on</pre>\n`
  //   bot.bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
  // })
  // bot.bot.onText(/\/off/, (msg, match) => {
  //   const resp = `🚨 <strong>TEST</strong>\n<pre>off</pre>\n`
  //   bot.bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
  // })
  // bot.bot.onText(/\/status/, (msg, match) => {
  //   const resp = `🚨 <strong>TEST</strong>\n<pre>status</pre>\n`
  //   bot.bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
  // })
  bot.bot.onText(/\/punch/, (msg, match) => {
    const resp = `👊🏻 <strong>Punch START.</strong>\n@${dateNow}`
    bot.bot.sendMessage(userID, resp, {parse_mode: 'HTML'})
    punch()
  })
}

if (!process.env.userName) console.log(`\n🚧  Please set your ${colors.green('userName')} in .env first.`)
if (!process.env.password) console.log(`\n🚧  Please set your ${colors.green('password')} in .env first.`)
if (!process.env.loginUrl) console.log(`\n🚧  Please set your ${colors.green('loginUrl')} in .env first.`)
if (!process.env.userName || !process.env.password || !process.env.loginUrl) process.exit()

onDutyJs.config({
  'userName': process.env.userName,
  'password': process.env.password,
  'loginUrl': process.env.loginUrl
})

async function punch () {
  await onDutyJs.start().then(res => {
    if (process.env.userID && process.env.userID.length > 0) {
      if (res.status) {
        bot.botSuccess(res.msg + ' @' + res.time)
      } else {
        bot.botAlert(res.msg + ' @' + res.time)
      }
    }
    fs.appendFile('./onDutyJs.log', res.msg + ' @' + res.time + '\r\n', function (err) {
      if (err) {
        console.log(err)
      }
    })
    console.log(colors.green(res.msg + ' @' + res.time))
  })
}

// var j = schedule.scheduleJob('0 0 ' + punchTime + ' * * ' + workDay, function(){
//   setTimeout(punch(), Math.floor((Math.random() * (randomMax - randomMin)) + randomMin) * 1000 * 60);
// });
