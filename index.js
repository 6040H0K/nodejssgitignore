require('dotenv').config()
const { Telegraf } = require('telegraf')
const sqlite3 = require('sqlite3').verbose()

const telegramToken = process.env.TELEGRAM_BOT_TOKEN
const dbName = process.env.DB_NAME

console.log(telegramToken, dbName)