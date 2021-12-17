const express = require('express');
const router = express.Router();
router.use(express.json());

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const ds = require('../services/datastore');
const datastore = ds.datastore;
const BOAT = 'Boat';
const CARGO = 'Cargo';
const SLIP = 'Slip';

// USE ON ALL /boats ROUTES
router.use(jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
}), (err, req, res, next) => {
    // MISSING OR INVALID JWT
    if (err.name === 'UnauthorizedError') {
        req.user = undefined
        return next()
    };
    return next(err);
});

// START MODEL FUNCTIONS

const postBoat = async (name, type, length, owner) => {
    const boatKey = datastore.key(BOAT);
    const newBoat = { 'name': name, 'type': type, 'length': length, 'cargo': [], 'slip': null, 'owner': owner};
    await datastore.save({ 'key': boatKey, 'data': newBoat });
    const boat = await datastore.get(boatKey);
    return boat.map(ds.fromDatastore);
};

const expandCargo = async (boatObj, req) => {
    if (boatObj.cargo.length === 0) { return boatObj }
    const cargoInfo = [];
    for (const cargoID of boatObj.cargo) {
        const cargoKey = datastore.key([CARGO, cargoID]);
        const cargo = await datastore.get(cargoKey);
        const newItem = { 'id': cargoID, 'content': cargo[0].content, 'self': `${req.protocol}://${req.get('Host')}/cargo/${cargoID}` }
        cargoInfo.push(newItem)
    }
    boatObj.cargo = cargoInfo;
    return boatObj;
}

const expandSlip = async (boatObj, req) => {
    if (boatObj.slip === null) { return boatObj }
    const slipKey = datastore.key([SLIP, boatObj.slip]);
    const slip = await datastore.get(slipKey);
    boatObj.slip = { 'id': boatObj.slip, 'number': slip[0].number, 'self': `${req.protocol}://${req.get('Host')}/slips/${boatObj.slip}`}
    return boatObj
}

const getAllBoats = async (req) => {
    const owner = req.user.sub;
    const all = await datastore.runQuery(datastore.createQuery(BOAT).select('__key__').filter('owner', '=', owner));
    let query = datastore.createQuery(BOAT).filter('owner', '=', owner).limit(5);
    const results = {};
    if (Object.keys(req.query).includes('cursor')) {
        query = query.start(req.query.cursor);
    }
    const boats = await datastore.runQuery(query);
    boats[0].map(ds.fromDatastore);
    for (let oneBoat of boats[0]) {
        oneBoat.self = `${req.protocol}://${req.get('Host')}/boats/${oneBoat.id}`
        oneBoat = await expandCargo(oneBoat, req);
        oneBoat = await expandSlip(oneBoat, req);
    }
    results.boats = boats[0]
    if (boats[1].moreResults != ds.Datastore.NO_MORE_RESULTS) {
        results.next = `${req.protocol}://${req.get('Host')}/boats/?cursor=${encodeURIComponent(boats[1].endCursor)}`
    }
    results.total = all[0].length
    return results;
};

const getOneBoat = async (req) => {
    const boatID = parseInt(req.params.boatID);
    const owner = req.user.sub;

    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        boat[0] = await expandCargo(boat[0], req);
        boat[0] = await expandSlip(boat[0], req);
        boat[0].self = `${req.protocol}://${req.get('Host')}/boats/${boatID}`;
        return boat.map(ds.fromDatastore);
    }
};

const putBoat = async (req) => {
    const boatID = parseInt(req.params.boatID);
    const { name, type, length } = req.body;
    const owner = req.user.sub;

    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        const newBoat = { 'name': name, 'type': type, 'length': length, 'cargo': boat[0].cargo, 'slip': boat[0].slip, 'owner': boat[0].owner };
        await datastore.update({ 'key': boatKey, 'data': newBoat });
        const updatedBoat = await datastore.get(boatKey);

        updatedBoat[0] = await expandCargo(updatedBoat[0], req);
        updatedBoat[0] = await expandSlip(updatedBoat[0], req);
        updatedBoat[0].self = `${req.protocol}://${req.get('Host')}/boats/${boatID}`;
        return updatedBoat.map(ds.fromDatastore);
    }
}

const patchBoat = async (req) => {
    const boatID = parseInt(req.params.boatID);
    const owner = req.user.sub;

    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        const newBoat = { ...req.body };
        if (!newBoat.name) { newBoat.name = boat[0].name }
        if (newBoat.type === undefined) { newBoat.type = boat[0].type }
        if (!newBoat.length) { newBoat.length = boat[0].length }
        newBoat.slip = boat[0].slip;
        newBoat.cargo = boat[0].cargo;
        newBoat.owner = boat[0].owner;
        await datastore.update({ 'key': boatKey, 'data': newBoat });
        const updatedBoat = await datastore.get(boatKey);
        
        updatedBoat[0] = await expandCargo(updatedBoat[0], req);
        updatedBoat[0] = await expandSlip(updatedBoat[0], req);
        updatedBoat[0].self = `${req.protocol}://${req.get('Host')}/boats/${boatID}`;
        return updatedBoat.map(ds.fromDatastore);
    }
}

const deleteBoat = async (boatID, owner) => {
    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        if (boat[0].cargo.length !== 0) {
            for (const cargoID of boat[0].cargo) {
                const cargoKey = datastore.key([CARGO, cargoID]);
                const cargo = await datastore.get(cargoKey);
                const newCargo = { ...cargo[0] };
                newCargo.carrier = null;
                datastore.update({ 'key': cargoKey, 'data': newCargo});
            }
        }
        if (boat[0].slip !== null) {
            const slipKey = datastore.key([SLIP, boat[0].slip]);
            const slip = await datastore.get(slipKey);
            const newSlip = { ...slip[0] };
            newSlip.boat = null;
            datastore.update({ 'key': slipKey, 'data': newSlip });
        }
        await datastore.delete(boatKey);
        return Promise.resolve('deleted');
    }
};

const addCargoToBoat = async (boatID, cargoID, owner) => {
    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    const cargoKey = datastore.key([CARGO, cargoID]);
    const cargo = await datastore.get(cargoKey);
    if (cargo[0] === undefined || cargo[0] === null) {
        return Promise.resolve('empty');
    }
    if (cargo[0].carrier !== null) {
        return Promise.resolve('cargo already assigned');
    }
    if (boat[0].owner !== owner || cargo[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        const newCargo = { ...cargo[0] };
        newCargo.carrier = boatID;
        await datastore.update({ 'key': cargoKey, 'data': newCargo });
        
        const newBoat = { ...boat[0] };
        newBoat.cargo.push(cargoID);
        await datastore.update({ 'key': boatKey, 'data': newBoat });

        return Promise.resolve('done');
    }
}

const removeCargoFromBoat = async (boatID, cargoID, owner) => {
    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    const cargoKey = datastore.key([CARGO, cargoID]);
    const cargo = await datastore.get(cargoKey);
    if (cargo[0] === undefined || cargo[0] === null) {
        return Promise.resolve('empty');
    }
    if (cargo[0].carrier === null) {
        return Promise.resolve('cargo not assigned');
    }
    if (boat[0].owner !== owner || cargo[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    else {
        const newCargo = { ...cargo[0] };
        newCargo.carrier = null;
        await datastore.update({ 'key': cargoKey, 'data': newCargo });
        
        const newBoat = { ...boat[0] };
        newBoat.cargo = boat[0].cargo.filter(item => item !== cargoID)
        await datastore.update({ 'key': boatKey, 'data': newBoat });
        
        return Promise.resolve('done');
    }
}

const dockBoat = async (boatID, slipID, owner) => {
    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    if (slip[0].boat !== null) {
        return Promise.resolve('slip already occupied');
    }
    if (boat[0].slip !== null) {
        return Promise.resolve('boat already docked');
    }
    if (boat[0].length > slip[0].length) {
        return Promise.resolve('boat too large to dock');
    }
    else {
        const newSlip = { ...slip[0] };
        newSlip.boat = boatID;
        await datastore.update({ 'key': slipKey, 'data': newSlip });
        
        const newBoat = { ...boat[0] };
        newBoat.slip = slipID;
        await datastore.update({ 'key': boatKey, 'data': newBoat });

        return Promise.resolve('done');
    }
}

const undockBoat = async (boatID, slipID, owner) => {
    const boatKey = datastore.key([BOAT, boatID]);
    const boat = await datastore.get(boatKey);
    if (!boat[0]) {
        return Promise.resolve('empty');
    }
    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    if (boat[0].owner !== owner) {
        return Promise.resolve('unauthorized');
    }
    if (slip[0].boat !== boatID || boat[0].slip !== slipID) {
        return Promise.resolve('no boat at slip');
    }
    else {
        const newSlip = { ...slip[0] };
        newSlip.boat = null;
        await datastore.update({ 'key': slipKey, 'data': newSlip });
        
        const newBoat = { ...boat[0] };
        newBoat.slip = null
        await datastore.update({ 'key': boatKey, 'data': newBoat });
        
        return Promise.resolve('done');
    }
}

// END MODEL FUNCTIONS

// START CONTROLLER FUNCTIONS

router.post('/', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.user === undefined) {
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    if (req.body.name === undefined || req.body.type === undefined || req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object missing at least one required attribute' });
        return;
    }
    else {
        const owner = req.user.sub;
        const { name, type, length } = req.body
        const boat = await postBoat(name, type, length, owner);
        boat[0].self = `${req.protocol}://${req.get('Host')}/boats/${boat[0].id}`;
        res.status(201).json(boat[0]);
    }
});

router.get('/', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.user === undefined) {
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boats = await getAllBoats(req);
    res.status(200).json(boats);
    return;
});

router.get('/:boatID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.user === undefined) {
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boat = await getOneBoat(req);
    if (boat === 'empty' || boat === 'unauthorized') {
        res.status(403).json({ 'error': 'boat owned by another user or does not exist' });
        return;
    }
    else {
        res.status(200).json(boat[0]);
    }
});

router.put('/:boatID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.user === undefined) {
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    if (req.body.name === undefined || req.body.type === undefined || req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object is missing at least one of the required attributes' });
        return;
    }
    else {
        const boat = await putBoat(req);
        if (boat === 'empty' || boat === 'unauthorized') {
            res.status(403).json({ 'error': 'boat owned by another user or does not exist' });
            return;
        }
        else {
            res.status(200).json(boat[0]);
        }
    }
});

router.patch('/:boatID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.user === undefined) {
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    if (req.body.name === undefined && req.body.type === undefined && req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object is empty' });
        return;
    }
    else {
        const boat = await patchBoat(req);
        if (boat === 'empty' || boat === 'unauthorized') {
            res.status(403).json({ 'error': 'boat owned by another user or does not exist' });
            return;
        }
        else {
            res.status(200).json(boat[0]);
        }
    }
});

router.delete('/:boatID', async (req, res) => {
    if (req.user === undefined) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boatID = parseInt(req.params.boatID);
    const owner = req.user.sub;
    const response = await deleteBoat(boatID, owner);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat owned by another user or does not exist' });
        return;
    }
    else {
        res.status(204).end();
    }
});

router.patch('/:boatID/cargo/:cargoID', async (req, res) => {
    if (req.user === undefined) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boatID = parseInt(req.params.boatID);
    const cargoID = parseInt(req.params.cargoID);
    const owner = req.user.sub;
    const response = await addCargoToBoat(boatID, cargoID, owner);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat and/or cargo owned by another user or does not exist' });
        return;
    }
    if (response === 'cargo already assigned') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'cargo already assigned to a boat' })
    }
    else {
        res.status(204).end();
    }
});

router.delete('/:boatID/cargo/:cargoID', async (req, res) => {
    if (req.user === undefined) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boatID = parseInt(req.params.boatID);
    const cargoID = parseInt(req.params.cargoID);
    const owner = req.user.sub;
    const response = await removeCargoFromBoat(boatID, cargoID, owner);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat and/or cargo owned by another user or does not exist' });
        return;
    }
    if (response === 'cargo not assigned') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'the specified cargo is not assigned to the specified boat' })
    }
    else {
        res.status(204).end();
    }
});

router.patch('/:boatID/slips/:slipID', async (req, res) => {
    if (req.user === undefined) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boatID = parseInt(req.params.boatID);
    const slipID = parseInt(req.params.slipID);
    const owner = req.user.sub;
    const response = await dockBoat(boatID, slipID, owner);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat owned by another user or boat and/or slip does not exist' });
        return;
    }
    if (response === 'slip already occupied') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'slip already occupied' })
    }
    if (response === 'boat already docked') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat already docked' })
    }
    if (response === 'boat too large to dock') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat is larger than slip' })
    }
    else {
        res.status(204).end();
    }
});

router.delete('/:boatID/slips/:slipID', async (req, res) => {
    if (req.user === undefined) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({ 'Error': 'missing or invalid token' });
        return;
    }
    const boatID = parseInt(req.params.boatID);
    const slipID = parseInt(req.params.slipID);
    const owner = req.user.sub;
    const response = await undockBoat(boatID, slipID, owner);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'boat owned by another user or boat and/or slip does not exist' });
        return;
    }
    if (response === 'no boat at slip') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'Error': 'the specified boat is not docked at the specified slip' })
    }
    else {
        res.status(204).end();
    }
});

router.put('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.set('Allow', 'GET, POST');
    res.status(405).json({ 'Error': 'method not allowed for requested URL' })
});

router.patch('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.set('Allow', 'GET, POST');
    res.status(405).json({ 'Error': 'method not allowed for requested URL' })
});

router.delete('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.set('Allow', 'GET, POST');
    res.status(405).json({ 'Error': 'method not allowed for requested URL' })
});

// END CONTROLLER FUNCTIONS

module.exports = router;