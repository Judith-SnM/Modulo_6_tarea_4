import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

async function fetchRandomUserData() {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        return response.data.results[0];
    } catch (error) {
        console.error('Error al obtener datos de la API Random User:', error);
        throw error;
    }
}

function generateUniqueId() {
    return uuidv4();
}

function addTimestamp(user) {
    user.timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
    return user;
}

function splitUsersByGender(users) {
    return _.partition(users, (user) => user.gender === 'female');
}

function logUsers(users) {
    console.log(chalk.bgWhite.blue(JSON.stringify({ females: users[0], males: users[1] }, null, 2)));
}

app.get('/register', async (req, res) => {
    try {

        const randomUser = await fetchRandomUserData();

        randomUser.id = generateUniqueId();

        addTimestamp(randomUser);

        res.json(randomUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export default app;