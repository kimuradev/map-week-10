const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket')

// index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();
    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const responseApi = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = responseApi.data;

      const techArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location
      });

      //filtrar as conexoes que estao a no maximo
      //10 km de distancia e que o novo dev tenha
      //pelo menos uma das techs filtradas

      const sendSocketMessageTo = findConnections({
        latitude, longitude
      }, techArray)

      //console.log(sendSocketMessageTo)
      sendMessage(sendSocketMessageTo, 'new-dev', dev)
    }

    return response.json(dev);
  },

  //TODO
  async update() { },
  //TODO
  async destroy() { }
};
