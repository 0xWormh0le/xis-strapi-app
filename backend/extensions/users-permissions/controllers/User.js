'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const { username, password, role } = ctx.request.body;

    if (!username) return ctx.badRequest('missing.username');
    if (!password) return ctx.badRequest('missing.password');

    const userWithSameUsername = await strapi
      .query('user', 'users-permissions')
      .findOne({ username });

    if (userWithSameUsername) {
      return ctx.badRequest(
        null,
        formatError({
          id: 'Auth.form.error.username.taken',
          message: 'Username already taken.',
          field: ['username'],
        })
      );
    }

    const user = {
      ...ctx.request.body,
      provider: 'local',
    };

    if (!role) {
      const defaultRole = await strapi
        .query('role', 'users-permissions')
        .findOne({ type: advanced.default_role }, []);

      user.role = defaultRole.id;
    }

    try {
      const data = await strapi.plugins['users-permissions'].services.user.add(
        user
      );

      ctx.created(data);
    } catch (error) {
      ctx.badRequest(null, formatError(error));
    }
  }
};
