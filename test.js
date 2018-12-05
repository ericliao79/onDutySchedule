const bot = require('./telegramBot.js');
const onDutyJs = require('onDutyJs');

onDutyJs.start().then(res => {
  console.log(res)
  bot.botSuccess(res.msg + ' @' + res.time)
})