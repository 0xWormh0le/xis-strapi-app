'use strict';

/**
 * Lifecycle callbacks for the `ticket` model.
 */

module.exports = {
  beforeUpdate: async (model, attrs, options) => {
  //   const ticket =  await strapi.query("ticket").findOne({
  //     id: model.attributes.id
  //   })
  //   console.log("ticket", ticket)
    if (model._previousAttributes.id && model.attributes.status !== model._previousAttributes.status) {
      strapi.query("signal-registry").create({
        action: 'TicketStatusUpdated',
        processedState: 0,
        entryId: model.attributes.id,
      });
    }
  }
};
