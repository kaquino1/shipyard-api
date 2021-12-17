const { Datastore } = require('@google-cloud/datastore');

module.exports.Datastore = Datastore;
module.exports.datastore = new Datastore();

const fromDatastore = (item) => {
    item.id = parseInt(item[Datastore.KEY].id);
    return item;
};

const userFromDatastore = (item) => {
    item.name = item[Datastore.KEY].name;
    return item;
};

module.exports.fromDatastore = fromDatastore;
module.exports.userFromDatastore = userFromDatastore;