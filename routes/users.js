const express = require('express');
const router = express.Router();
router.use(express.json());

const ds = require('../services/datastore');
const datastore = ds.datastore;
const USER = 'User';


const get_users = async () => {
    const query = datastore.createQuery(USER);
    const users = await datastore.runQuery(query);
    return users[0].map(ds.userFromDatastore);
};

router.get('/', async (req, res) => {
    const users = await get_users();
    res.status(200).json(users);
    return;
})

module.exports = router;