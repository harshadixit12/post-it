const { v4: uuidv4 } = require('uuid');
const redis = require('redis');
const { promisify } = require('util');

module.exports = {


  friendlyName: 'Get all posts',


  description:
  `Get all posts`,


  inputs: {

    post: {
      description: 'Get all posts',
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
      description: 'Fetched successfully'
    },

    failure: {
      description: 'Failed to fetch!'
    }

  },


  fn: async function (inputs, exits) {
    if(!inputs) {
      return exits.invalidFields();
    }

    const client = redis.createClient();

    const getAll = promisify(client.hgetall).bind(client);

    const raw = await getAll('posts');

    return exits.success(raw);
  }
};
