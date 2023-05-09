const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const { promisify } = require('util');

module.exports = {


  friendlyName: 'Update post',


  description:
  `Update a post`,


  inputs: {

    post: {
      description: 'The confirmation token from the email.',
      example: {
        title: '',
        text: '',
        createdBy: '',
        time: '',
        votes: ''
      }
    }

  },


  exits: {

    success: {
      description: 'Post updated successfully'
    },

    invalidFields: {
      responseType: 'invalid',
      description: 'The provided post has incomplete fields',
    },

    failure: {
      description: 'Post not updated!'
    }

  },


  fn: async function (inputs, exits) {
    if(!inputs) {
      return exits.invalidFields();
    }

    const postId = this.req.params.id;
    const client = redis.createClient();

    const setAsync = promisify(client.hset).bind(client);
    const getAsync = promisify(client.hget).bind(client);

    const original = JSON.parse(await getAsync('posts',`${postId}`));
    const updated = Object.assign(original, inputs);
    await setAsync(`posts`, `${postId}`, JSON.stringify(updated));

    const fooValue = JSON.parse(await getAsync('posts',`${postId}`));
    return exits.success(fooValue);
  }
};
