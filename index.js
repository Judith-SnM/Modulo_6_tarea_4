import 'dotenv/config'
import axios from 'axios'
import express from 'express'
import Jimp from 'jimp'
import _ from 'lodash'
import moment from 'moment'
import { nanoid } from 'nanoid'
import nodemailer from 'nodemailer'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()
app.use(express.static(__dirname + '/public'))

const users = []

app.get('/', async (req, res) => {

    const response = await axios.get('https://randomuser.me/api/')
    const gender = response.data.results[0].gender
    const first = response.data.results[0].name.first
    const last = response.data.results[0].name.last

    const user = {
        gender,
        first,
        last,
        id: nanoid(),
        timestamp: moment().format('LLL')
    }

    users.push(user)
    const newUsers = _.partition(users, (item) => item.gender === 'female')
    const females = newUsers[0];
    const males = newUsers[1];

    console.log(chalk.bgWhite.blue(JSON.stringify({ females, males }, null, 2)));

    res.json({
        females, male
    })
})


app.get('/image', async (req, res) => {
    const image = await Jimp.read('https://picsum.photos/1000')
    const buffer = await image
        .resize(500, 500)
        .grayscale()
        .quality(60)
        .getBufferAsync(Jimp.MIME_JPEG)

    const dirname = __dirname + `/public/img/image-${nanoid()}.jpeg`
    await image.writeAsync(dirname)

    res.set("Content-Type", "image/jpeg")
    return res.send(buffer)
})

app.get('/mail', async (req, res) => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔", 
        text: "Hello world?", 
        html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);

    return res.json({ ok: true })

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
    console.log(process.pid)
})