process.env.NTBA_FIX_319 = 1

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.appToken
const userID = process.env.userID
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const fs = require('fs')

let logStatus = true

if (process.env.logPath) {
  var { spawn } = require('child_process');
  var tailOut = spawn('tail', ["-f"].concat(process.env.logPath + 'onDutySchedule-out.log'));
  var tailError = spawn('tail', ["-f"].concat(process.env.logPath + 'onDutySchedule-error.log'));
}


// Clear Logs
fs.writeFile(process.env.logPath + 'onDutySchedule-error.log', '', () => {})
fs.writeFile(process.env.logPath + 'onDutySchedule-out.log', '', () => {})

// start
bot.onText(/\/start/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  var chatId = msg.chat.id; //用戶的ID
  var resp =
            '✨ Hi, I am 👊🏻 Puncher. Your chatID is <code>' + chatId + '</code>. \n' +
            '⚡️ Enter <code>/help</code> to list all commands.'
  bot.sendMessage(chatId, resp, {parse_mode: 'HTML'}); //發送訊息的function
});

// help
bot.onText(/\/help/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  var chatId = msg.chat.id;
  var resp = '' +
  '⚡️ <code>/start</code> - Start message.\n' +
  '⚡️ <code>/log</code>: <strong>' + (logStatus ? 'ON' : 'OFF') + '</strong> - Return output log.\n' +
  '⚡️ <code>/help</code> - List all commands.\n' +
  '⚡️ <code>/myid</code> - Echo your chatID.\n' +
  '⚡️ <code>/echo [msg]</code> - Echo your [msg]\n' +
  '⚡️ <code>/status [msg]</code> - Schedule Status\n' +
  '⚡️ <code>/on [msg]</code> - Turn on schedule\n' +
  '⚡️ <code>/off [msg]</code> - Turn off schedule\n' +
  '⚡️ <code>/punch [msg]</code> - Take a single punch.';
  bot.sendMessage(chatId, resp, {parse_mode: 'HTML'}); //發送訊息的function
});

// myid
bot.onText(/\/myid/, (msg, match) => {
  const chatId = msg.chat.id;
  // const resp = match[1]; // the captured "whatever"
  const resp = `✨ Your id is <code>${msg.chat.id}</code>`; // the captured "whatever"

  bot.sendMessage(chatId, resp, {parse_mode: 'HTML'});
});

bot.onText(/\/log (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  var resp = ''
  switch (match[1]) {
    case 'on':
      logStatus = true
      resp = '✨ Log has been turn <code>ON</code>'
      bot.sendMessage(chatId, resp, {parse_mode: 'HTML'})
      break
    case 'off':
      logStatus = false
      resp = '✨ Log has been turn <code>OFF</code>'
      bot.sendMessage(chatId, resp, {parse_mode: 'HTML'})
      break
    case 'clear':
      fs.writeFile(process.env.logPath + 'onDutySchedule-error.log', '', function () {
        resp = '<strong>CLEAR</strong> - onDutySchedule-error.log'
        bot.sendMessage(chatId, resp, {parse_mode: 'HTML'})
      })
      fs.writeFile(process.env.logPath + 'onDutySchedule-out.log', '', function () {
        resp = '<strong>CLEAR</strong> - onDutySchedule-out.log'
        bot.sendMessage(chatId, resp, {parse_mode: 'HTML'})
      })
      break
  }
  // const chatId = msg.chat.id;
  // const resp = '✨ ' + match[1]; // the captured "whatever"
  // bot.sendMessage(chatId, resp, {parse_mode: 'HTML'});
});

bot.onText(/\/log$/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = '' +
    '⚡️ /log [on, off, clear]\n\n' +
    '✨ Log status: <code>' + (logStatus ? 'ON' : 'OFF') + '</code>'
    ''
  bot.sendMessage(chatId, resp, {parse_mode: 'HTML'});
})

if (process.env.logPath) {
  tailOut.stdout.on("data", function (data) {
    const resp = `✨ <strong>onDutySchedule-out.log</strong>\n<pre>${data.toString()}</pre>\n`
    if (logStatus) {
      bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
    }
  });

  tailError.stdout.on("data", function (data) {
    const resp = `🚨 <strong>onDutySchedule-error.log</strong>\n<pre>${data.toString()}</pre>\n`
    if (logStatus) {
      bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
    }
  });
}

// echo [msg]
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = '✨ ' + match[1]; // the captured "whatever"
  bot.sendMessage(chatId, resp, {parse_mode: 'HTML'});
});

function botAlert (text) {
  const resp = '🚨 ' + text
  bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
}

function botSuccess (text) {
  const resp = '🎉 ' + text
  bot.sendMessage(userID, resp, {parse_mode: 'HTML'});
}

module.exports.bot = bot
module.exports.botAlert = botAlert
module.exports.botSuccess = botSuccess