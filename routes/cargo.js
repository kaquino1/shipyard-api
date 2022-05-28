const express = require('express');
const router = express.Router();
router.use(express.json());

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const ds = require('../services/datastore');
const datastore = ds.datastore;
const CARGO = 'Cargo';
const BOAT = 'Boat';

// USE ON ALL /cargo ROUTES
router.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }),
  (err, req, res, next) => {
    // MISSING OR INVALID JWT
    if (err.name === 'UnauthorizedError') {
      req.user = undefined;
      return next();
    }
    return next(err);
  }
);

// START MODEL FUNCTIONS

const postCargo = async req => {
  const owner = req.user.sub;
  const { content, volume } = req.body;

  const cargoKey = datastore.key(CARGO);
  const creationDate = new Date().toISOString().slice(0, 10);
  const newCargo = { content: content, volume: volume, creationDate: creationDate, carrier: null, owner: owner };
  await datastore.save({ key: cargoKey, data: newCargo });
  const cargo = await datastore.get(cargoKey);
  cargo.map(ds.fromDatastore);
  cargo[0].self = `${req.protocol}://${req.get('Host')}/cargo/${cargo[0].id}`;
  return cargo;
};

const expandBoat = async (cargoObj, req) => {
  if (cargoObj.carrier === null) {
    return cargoObj;
  }
  const boatKey = datastore.key([BOAT, cargoObj.carrier]);
  const boat = await datastore.get(boatKey);
  cargoObj.carrier = {
    id: cargoObj.carrier,
    name: boat[0].name,
    self: `${req.protocol}://${req.get('Host')}/boats/${cargoObj.carrier}`
  };
  return cargoObj;
};

const getAllCargo = async req => {
  const owner = req.user.sub;
  const all = await datastore.runQuery(datastore.createQuery(CARGO).select('__key__').filter('owner', '=', owner));
  let query = datastore.createQuery(CARGO).filter('owner', '=', owner).limit(5);
  const results = {};
  if (Object.keys(req.query).includes('cursor')) {
    query = query.start(req.query.cursor);
  }
  const cargo = await datastore.runQuery(query);
  cargo[0].map(ds.fromDatastore);
  for (let oneCargo of cargo[0]) {
    oneCargo.self = `${req.protocol}://${req.get('Host')}/cargo/${oneCargo.id}`;
    oneCargo = await expandBoat(oneCargo, req);
  }
  results.cargo = cargo[0];
  if (cargo[1].moreResults != ds.Datastore.NO_MORE_RESULTS) {
    results.next = `${req.protocol}://${req.get('Host')}/cargo/?cursor=${encodeURIComponent(cargo[1].endCursor)}`;
  }
  results.total = all[0].length;
  return results;
};

const getOneCargo = async req => {
  const cargoID = parseInt(req.params.cargoID);
  const owner = req.user.sub;

  const cargoKey = datastore.key([CARGO, cargoID]);
  const cargo = await datastore.get(cargoKey);
  if (!cargo[0]) {
    return Promise.resolve('empty');
  }
  if (cargo[0].owner !== owner) {
    return Promise.resolve('unauthorized');
  } else {
    cargo[0] = await expandBoat(cargo[0], req);
    cargo[0].self = `${req.protocol}://${req.get('Host')}/cargo/${cargoID}`;
    return cargo.map(ds.fromDatastore);
  }
};

const putCargo = async req => {
  const cargoID = parseInt(req.params.cargoID);
  const { content, volume } = req.body;
  const owner = req.user.sub;

  const cargoKey = datastore.key([CARGO, cargoID]);
  const cargo = await datastore.get(cargoKey);
  if (!cargo[0]) {
    return Promise.resolve('empty');
  }
  if (cargo[0].owner !== owner) {
    return Promise.resolve('unauthorized');
  } else {
    const newCargo = {
      content: content,
      volume: volume,
      creationDate: cargo[0].creationDate,
      carrier: cargo[0].carrier,
      owner: cargo[0].owner
    };
    await datastore.update({ key: cargoKey, data: newCargo });
    const updatedCargo = await datastore.get(cargoKey);

    updatedCargo[0] = await expandBoat(updatedCargo[0], req);
    updatedCargo[0].self = `${req.protocol}://${req.get('Host')}/cargo/${cargoID}`;
    return updatedCargo.map(ds.fromDatastore);
  }
};

const patchCargo = async req => {
  const cargoID = parseInt(req.params.cargoID);
  const owner = req.user.sub;

  const cargoKey = datastore.key([CARGO, cargoID]);
  const cargo = await datastore.get(cargoKey);
  if (!cargo[0]) {
    return Promise.resolve('empty');
  }
  if (cargo[0].owner !== owner) {
    return Promise.resolve('unauthorized');
  } else {
    const newCargo = { ...req.body };
    if (!newCargo.content) {
      newCargo.content = cargo[0].content;
    }
    if (!newCargo.volume) {
      newCargo.volume = cargo[0].volume;
    }
    newCargo.creationDate = cargo[0].creationDate;
    newCargo.carrier = cargo[0].carrier;
    newCargo.owner = cargo[0].owner;
    await datastore.update({ key: cargoKey, data: newCargo });
    const updatedCargo = await datastore.get(cargoKey);

    updatedCargo[0] = await expandBoat(updatedCargo[0], req);
    updatedCargo[0].self = `${req.protocol}://${req.get('Host')}/cargo/${cargoID}`;
    return updatedCargo.map(ds.fromDatastore);
  }
};

const deleteCargo = async (cargoID, owner) => {
  const cargoKey = datastore.key([CARGO, cargoID]);
  const cargo = await datastore.get(cargoKey);
  if (!cargo[0]) {
    return Promise.resolve('empty');
  }
  if (cargo[0].owner !== owner) {
    return Promise.resolve('unauthorized');
  } else {
    if (cargo[0].carrier !== null) {
      const boatKey = datastore.key([BOAT, cargo[0].carrier]);
      const boat = await datastore.get(boatKey);
      const newBoat = { ...boat[0] };
      newBoat.cargo = boat[0].cargo.filter(item => item !== cargoID);
      await datastore.update({ key: boatKey, data: newBoat });
    }
    await datastore.delete(cargoKey);
    return Promise.resolve('deleted');
  }
};

// END MODEL FUNCTIONS

// START VALIDATION FUNCTIONS

const hasAttrs = (method, body) => {
  return (
    (['POST', 'PUT'].includes(method) && 'content' in body && 'volume' in body) ||
    (method === 'PATCH' && ('content' in body || ' volume' in body))
  );
};

const extraAttrs = body => {
  return !Object.keys(body).every(attr => ['content', 'volume'].includes(attr));
};

const invalidTypes = body => {
  return (
    ('content' in body && typeof body.content !== 'string') || ('volume' in body && !Number.isInteger(body.volume))
  );
};

const attrParams = body => {
  if ('volume' in body && body.volume <= 0) return false;
  if ('content' in body && !/^[a-zA-Z0-9 ]+$/.test(body.content)) return false;
  return true;
};

// END VALIDATION FUNCTIONS

// START CONTROLLER FUNCTIONS

router.post('/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.get('Accept') !== 'application/json') {
    res.status(406).json({ Error: 'server only returns application/json data' });
    return;
  }
  if (req.user === undefined) {
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  if (!hasAttrs(req.method, req.body)) {
    res.status(400).json({ Error: 'request object missing at least one required attribute' });
    return;
  }
  if (extraAttrs(req.body)) {
    res.status(400).json({ Error: 'request object contains extraneous attributes' });
    return;
  }
  if (invalidTypes(req.body)) {
    res.status(400).json({ Error: 'one or more request object attributes are the wrong type' });
    return;
  }
  if (!attrParams(req.body)) {
    res.status(400).json({
      Error: 'cargo volume is not positive and/or cargo content contains forbidden characters'
    });
    return;
  } else {
    req.body.content = req.body.content.trim();
    const cargo = await postCargo(req);
    res.status(201).json(cargo[0]);
  }
});

router.get('/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.get('Accept') !== 'application/json') {
    res.status(406).json({ Error: 'server only returns application/json data' });
    return;
  }
  if (req.user === undefined) {
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  const cargo = await getAllCargo(req);
  res.status(200).json(cargo);
  return;
});

router.get('/:cargoID', async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.get('Accept') !== 'application/json') {
    res.status(406).json({ Error: 'server only returns application/json data' });
    return;
  }
  if (req.user === undefined) {
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  const cargo = await getOneCargo(req);
  if (cargo === 'empty' || cargo === 'unauthorized') {
    res.status(403).json({ error: 'cargo owned by another user or does not exist' });
    return;
  } else {
    res.status(200).json(cargo[0]);
  }
});

router.put('/:cargoID', async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.get('Accept') !== 'application/json') {
    res.status(406).json({ Error: 'server only returns application/json data' });
    return;
  }
  if (req.user === undefined) {
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  if (!hasAttrs(req.method, req.body)) {
    res.status(400).json({ Error: 'request object missing at least one required attribute' });
    return;
  }
  if (extraAttrs(req.body)) {
    res.status(400).json({ Error: 'request object contains extraneous attributes' });
    return;
  }
  if (invalidTypes(req.body)) {
    res.status(400).json({ Error: 'one or more request object attributes are the wrong type' });
    return;
  }
  if (!attrParams(req.body)) {
    res.status(400).json({
      Error: 'cargo volume is not positive and/or cargo content contains forbidden characters'
    });
    return;
  } else {
    req.body.content = req.body.content.trim();
    const cargo = await putCargo(req);
    if (cargo === 'empty' || cargo === 'unauthorized') {
      res.status(403).json({ error: 'cargo owned by another user or does not exist' });
      return;
    } else {
      res.status(200).json(cargo[0]);
    }
  }
});

router.patch('/:cargoID', async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.get('Accept') !== 'application/json') {
    res.status(406).json({ Error: 'server only returns application/json data' });
    return;
  }
  if (req.user === undefined) {
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  if (!hasAttrs(req.method, req.body)) {
    res.status(400).json({ Error: 'request object is empty' });
    return;
  }
  if (extraAttrs(req.body)) {
    res.status(400).json({ Error: 'request object contains extraneous attributes' });
    return;
  }
  if (invalidTypes(req.body)) {
    res.status(400).json({ Error: 'one or more request object attributes are the wrong type' });
    return;
  }
  if (!attrParams(req.body)) {
    res.status(400).json({
      Error: 'cargo volume is not positive and/or cargo content contains forbidden characters'
    });
    return;
  } else {
    req.body.content = req.body.content.trim();
    const cargo = await patchCargo(req);
    if (cargo === 'empty' || cargo === 'unauthorized') {
      res.status(403).json({ error: 'cargo owned by another user or does not exist' });
      return;
    } else {
      res.status(200).json(cargo[0]);
    }
  }
});

router.delete('/:cargoID', async (req, res) => {
  if (req.user === undefined) {
    res.set('Content-Type', 'application/json');
    res.status(401).json({ Error: 'missing or invalid token' });
    return;
  }
  const cargoID = parseInt(req.params.cargoID);
  const owner = req.user.sub;
  const response = await deleteCargo(cargoID, owner);
  if (response === 'empty' || response === 'unauthorized') {
    res.set('Content-Type', 'application/json');
    res.status(403).json({ error: 'cargo owned by another user or does not exist' });
    return;
  } else {
    res.status(204).end();
  }
});

router.put('/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Allow', 'GET, POST');
  res.status(405).json({ Error: 'method not allowed for requested URL' });
});

router.patch('/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Allow', 'GET, POST');
  res.status(405).json({ Error: 'method not allowed for requested URL' });
});

router.delete('/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Allow', 'GET, POST');
  res.status(405).json({ Error: 'method not allowed for requested URL' });
});

// END CONTROLLER FUNCTIONS

module.exports = router;
