const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const { promisify } = require('util');

module.exports = {


  friendlyName: 'Create post',


  description:
  `Create a new post`,


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
      description: 'Post created successfully'
    },

    invalidFields: {
      responseType: 'invalid',
      description: 'The provided post has incomplete fields',
    },

    failure: {
      description: 'Post not created!'
    }

  },


  fn: async function (inputs, exits) {
    if(!inputs) {
      return exits.invalidFields();
    }

    const postId = uuidv4();
    const client = redis.createClient();

    const setAsync = promisify(client.hset).bind(client);
    const getAsync = promisify(client.hget).bind(client);

    await setAsync(`posts`, `${postId}`, JSON.stringify(inputs.post));
    const fooValue = JSON.parse(await getAsync('posts',`${postId}`));
    return fooValue;
  }
};
