const _ = require('lodash'),
  bunyan = require('bunyan'),
  Promise = require('bluebird'),
  eventListenerModel = require('../../models/eventListenerModel'),
  log = bunyan.createLogger({name: 'plugins.rest.services.eventEmitter.eventEmitterService'});
/**
 * @module scheduleService
 * @description ping ipfs by specified time in config
 * @see {@link ../../../config.json}
 */

module.exports = (ev, ctx, data) => {

  eventListenerModel.find({event: ev.toLowerCase()})
    .then(listeners =>
      Promise.all(
        _.chain(listeners)
          .filter(listener =>
            _.isEqual(listener.filter, _.pick(data, _.keys(listener.filter)))
          )
          .map(listener =>
            ctx.amqpEmitter.emit(`events:${listener.controlIndexHash}`, data)
          )
          .value()
      )
    )
    .catch(err => {
      log.error(err);
    });

};