const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const { promisify } = require('util');

module.exports = {


  friendlyName: 'Get a post',


  description:
  `Get a post`,


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
      description: 'Post fetched successfully'
    },

    invalidFields: {
      responseType: 'invalid',
      description: 'The provided post has incomplete fields',
    },

    failure: {
      description: 'Post not fetched!'
    }

  },


  fn: async function (inputs, exits) {

    const postId = this.req.params.id;
    const client = redis.createClient();

    const getAsync = promisify(client.hget).bind(client);

    const original = JSON.parse(await getAsync('posts',`${postId}`));

    return exits.success(original);
  }
};
