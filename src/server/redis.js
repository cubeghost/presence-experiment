const _ = require('lodash');
const redis = require('redis');
const promisifyAll = require('util-promisifyall');
const serialize = require('serialize-javascript');
const debug = require('debug')('presence:redis');
const { promisify } = require('util');

promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

const USER_EXPIRY = 60 * 60 * 24;
const MESSAGE_EXPIRY = 60 * 60;

const redisClient = redis.createClient(process.env.REDIS_URL);

/*
  normally doing json in redis this way (stringifying and parsing
  on the client, as opposed to ReJSON) isn't ideal, but it's ok 
  for now because we only expect to have one server connecting 
  to redis
*/

export class MessageClient {
  constructor() {
    this.key = 'messages';
    this.client = redisClient;
  }
  
  async list() {
    const list = await this.client.lrangeAsync(this.key, 0, 100) || [];
    return list.map(JSON.parse);
  }
  
  async push(message) {
    return await this.client.rpushAsync(
      this.key,
      serialize(message)
    );
  }
};

export class UserClient {
  constructor() {
    this.prefix = 'user';
    this.client = redisClient;
  }
  
  getKey(id) {
    return `${this.prefix}:${id}`;
  }
  
  async scan(cursor = '0', accumulator = []) {
    const response = await this.client.scanAsync(
      cursor, 'MATCH', `${this.prefix}:*`, 'COUNT', '10'
    );
    
    cursor = response[0];
    accumulator = accumulator.concat(response[1]);
    
    if (cursor == '0') {
      if (accumulator.length > 0) {
        return await this.client.mgetAsync(accumulator);
      } else {
        return accumulator;
      }
    } else {
      return await this.scan(cursor, accumulator);
    }
  }
  
  async list() {
    const list = await this.scan();
    return list.map(JSON.parse)
  }
  
  async set(user) {
    return await this.client.setAsync(
      this.getKey(user.id),
      serialize(user)
    );
  }
  
  async get(id) {
    const string = await this.client.getAsync(this.getKey(id));
    if (string) {
      return JSON.parse(string);
    } else {
      return null;
    }
  }
  
  async remove(id) {
    return await this.client.delAsync(this.getKey(id));
  }
}