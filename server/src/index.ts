import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to Postgres
import {Pool} from 'pg';
const pgClient = new Pool({
    user: process.env.PG_USER as string,
    host: process.env.PG_HOST as string,
    database: process.env.PG_DATABASE as string,
    password: process.env.PG_PASSWORD as string,
    port: parseInt(process.env.PG_PORT as string)
});

pgClient.on('connect', () => {
    pgClient
      .query('CREATE TABLE IF NOT EXISTS values (number INT)')
      .catch((err) => console.log(err));
});

// Redis Client Setup
import redis from 'redis';
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handler
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index to high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({working: true});
});

app.get('/', (req, res) => {
    res.send({hi: "there"});
});

app.listen(5000, () => {
    console.log("Listening on port 5000!!!");
});

