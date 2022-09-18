"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  signalRegistry: async ({ request }, next) => {
    const { model, event, entry } = request.body;
    // console.log('model', model)
    // console.log('event', event)
    // console.log('entry', entry)

    try {
      //Function to create an item to the signal registry table
      const register = (action, entryId) =>
        strapi.query("signal-registry").create({
          action,
          processedState: 0,
          entryId,
        });

      //Function to create an item to the notifications table
      const notification = (title, description, ticket, contractor, read) =>
        strapi.query("notifications").create({
          title,
          description,
          ticket,
          contractor,
          read,
        });

      switch (event) {
        //Create
        case "entry.create":
          //Quote
          if (model === "quote") {
            await register("QuoteCreated", entry.id);
            await notification(
              `Your quote has been Submitted`,
              `Your quote has been Submitted`,
              entry.ticket.id,
              entry.contractor.id,
              false
            );
          }

          //Message
          if (model === "message") {
            await register("TicketCommentCreated", entry.id);
          }

          //documents
          if (model === "document") {
            if (entry.from === "ticket") {
              await register("TicketAttachmentAdded", entry.id);
            } else {
              await register("QuoteAttachmentAdded", entry.id);
            }
          }

          //Ticket
          if (model === "ticket") {
            await notification(
              "A new ticket has been assigned to you",
              entry.status.content,
              entry.ticket.id,
              entry.contractor.id,
              false
            );
          }
          break;
        //Update
        case "entry.update":
          //Quote
          if (model === "quote") {
            await register("QuoteChanged", entry.id);
            if (entry.status === "Pending") {
              await notification(
                `Your quote is ${entry.status}`,
                `Your quote is ${entry.status}`,
                entry.ticket.id,
                entry.contractor.id,
                false
              );
            } else {
              await notification(
                `Your quote has been ${entry.status}`,
                `Your quote has been ${entry.status}`,
                entry.ticket.id,
                entry.contractor.id,
                false
              );
            }
          }
          break;
        //Delete
        case "entry.delete":
          //Quote
          if (model === "quote") {
            await register("QuoteDeleted", entry.id);
            await notification(
              `Your quote has been Cancelled`,
              `Your quote has been Cancelled`,
              entry.ticket.id,
              entry.contractor.id,
              false
            );
          }
          break;
        default:
          break;
      }

      return true;
    } catch (err) {
      console.log(err);
    }
  },
};
