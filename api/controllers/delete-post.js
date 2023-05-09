const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const { promisify } = require('util');

module.exports = {


  friendlyName: 'Delete post',


  description:
  `Delete a post`,


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
      description: 'Post deleted successfully'
    },

    invalidFields: {
      responseType: 'invalid',
      description: 'The provided post has incomplete fields',
    },

    failure: {
      description: 'Post not deleted!'
    }

  },


  fn: async function (inputs, exits) {
    if(!inputs) {
      return exits.invalidFields();
    }

    const postId = this.req.params.id;
    const client = redis.createClient();

    const delAsync = promisify(client.hdel).bind(client);

    await delAsync('posts',`${postId}`);
    return exits.success();
  }
};
