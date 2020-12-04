import redis from 'redis';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

const fib = (index: number): number => {
    if (index < 2) {
        return 1;
    }

    return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)).toString());
});
sub.subscribe('insert');