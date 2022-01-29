require('dotenv').config();
const express = require('express');
var secured = require('../services/secured');
const router = express.Router();

const ds = require('../services/datastore');
const datastore = ds.datastore;
const USER = 'User';

const post_user = async (user_id, email) => {
  const query = datastore.createQuery(USER).filter('name', '=', user_id);
  const users = await datastore.runQuery(query);
  if (users[0].length === 0) {
    const user_key = datastore.key([USER, user_id]);
    const new_user = { email: email };
    await datastore.save({ key: user_key, data: new_user });
    const user = await datastore.get(user_key);
    return user.map(ds.userFromDatastore);
  }
  return users[0].map(ds.userFromDatastore);
};

// DISPLAY EMAIL, USER_ID, & JWT
router.get('/', secured(), async (req, res, next) => {
  const { email, user_id, jwt } = req.user;
  const user = await post_user(user_id, email);
  res.render('userinfo', {
    email: email,
    user_id: user_id,
    jwt: jwt,
    link: `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.APP_URL}`
  });
});

module.exports = router;
