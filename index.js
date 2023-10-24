require('dotenv').config()
const { Telegraf } = require('telegraf')
const sqlite3 = require('sqlite3').verbose()

const telegramToken = process.env.TELEGRAM_BOT_TOKEN
const dbName = process.env.DB_NAME

const db = new sqlite3.Database(dbName)

const bot = new Telegraf(telegramToken)

function createTableUser(){
    const query = `CREATE TABLE User(
        id INTEGER PRIMARY KEY,
        username varchar(255),
        first_name varchar(255),
        coins int
    );`
    db.run(query);
}

function createTableLinks(){
    const query = `CREATE TABLE Links(
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       url varchar(255),
       user_id int 
    );`
    db.run(query);
}

function createLink(url,userId){
    const query = `INSERT INTO Links(url,user_id) VALUES(?,?);`
    db.run(query,[url,userId])
}

function addUser(id, username, first_name, coins){
    const quary = `INSERT INTO User(id, username, first_name, coins) VALUES(?, ?, ?, ?);`
    db.run(quary,[id, username, first_name, coins])
}

function getLinksByUserId(user_id, callback){
    const query = `SELECT * FROM Links WHERE user_id = ${user_id}`
    db.all(query, (err, res) => {
        callback(res)
    })
}

function getUsersAndLinks(callback){
    const query = `SELECT User.username, Links.url FROM User
    INNER JOIN Links ON User.id = Links.user_id`

    db.all(query, (err, res) => {
        callback(res)
    })
}

bot.start((ctx) => {
    addUser(ctx.from.id, ctx.from.username, ctx.from.first_name, 100)
})

bot.command('links', (ctx) => {
    getLinksByUserId(ctx.from.id, (res) => {
        let out = ''
        for (let i of res){
            out += `${i.url}\n`
        }
        ctx.reply(out)
    })
    
})

bot.command('alllinks', (ctx) => {
    getUsersAndLinks((res) => {
        console.log(res)
        const out = {}

        for (let obj of res){
            if (out[obj.username]){
                out[obj.username].push(obj.url)
            } else{
                out[obj.username] = [obj.url]
            }
        }
        console.log(out)
    })
})

bot.on('text', (ctx) => {
    createLink(ctx.message.text, ctx.from.id)
})


// createTableUser()
// createTableLinks()
bot.launch()