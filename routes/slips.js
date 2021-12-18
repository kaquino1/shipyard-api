const express = require('express');
const router = express.Router();
router.use(express.json());

const ds = require('../services/datastore');
const datastore = ds.datastore;
const SLIP = 'Slip';
const BOAT = 'Boat';

// START MODEL FUNCTIONS

const postSlip = async (label, length) => {
    const slipKey = datastore.key(SLIP);
    const newSlip = { 'label': label, 'length': length, 'boat': null };
    await datastore.save({ 'key': slipKey, 'data': newSlip });
    const slip = await datastore.get(slipKey);
    return slip.map(ds.fromDatastore);
};

const expandBoat = async (slipObj, req) => {
    if (slipObj.boat === null) { return slipObj }
    const boatKey = datastore.key([BOAT, slipObj.boat]);
    const boat = await datastore.get(boatKey);
    slipObj.boat = { 'id': slipObj.boat, 'name': boat[0].name, 'self': `${req.protocol}://${req.get('Host')}/boats/${slipObj.boat}`}
    return slipObj
}

const getAllSlips = async (req) => {
    const all = await datastore.runQuery(datastore.createQuery(SLIP).select('__key__'));
    let query = datastore.createQuery(SLIP).limit(5);
    const results = {};
    if (Object.keys(req.query).includes('cursor')) {
        query = query.start(req.query.cursor);
    }
    const slip = await datastore.runQuery(query);
    slip[0].map(ds.fromDatastore);
    for (let oneSlip of slip[0]) {
        oneSlip.self = `${req.protocol}://${req.get('Host')}/slips/${oneSlip.id}`;
        oneSlip = await expandBoat(oneSlip, req)
    }
    results.slips = slip[0];
    if (slip[1].moreResults != ds.Datastore.NO_MORE_RESULTS) {
        results.next = `${req.protocol}://${req.get('Host')}/slips/?cursor=${encodeURIComponent(slip[1].endCursor)}`;
    }
    results.total = all[0].length
    return results;
};

const getOneSlip = async (req) => {
    const slipID = parseInt(req.params.slipID);

    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    else {
        slip[0] = await expandBoat(slip[0], req)
        slip[0].self = `${req.protocol}://${req.get('Host')}/slips/${slipID}`;
        return slip.map(ds.fromDatastore);
    }
};

const putSlip = async (req) => {
    const slipID = parseInt(req.params.slipID);
    const { label, length } = req.body;

    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    else {
        const newSlip = { 'label': label, 'length': length, 'boat': slip[0].boat };
        await datastore.update({ 'key': slipKey, 'data': newSlip });
        const updatedSlip = await datastore.get(slipKey);

        updatedSlip[0] = await expandBoat(updatedSlip[0], req)
        updatedSlip[0].self = `${req.protocol}://${req.get('Host')}/slips/${slipID}`;
        return updatedSlip.map(ds.fromDatastore);
    }
}

const patchSlip = async (req) => {
    const slipID = parseInt(req.params.slipID);

    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    else {
        const newSlip = { ...req.body };
        if (!newSlip.label) { newSlip.label = slip[0].label };
        if (!newSlip.length) { newSlip.length = slip[0].length };
        newSlip.boat = slip[0].boat;
        await datastore.update({ 'key': slipKey, 'data': newSlip });
        const updatedSlip = await datastore.get(slipKey);

        updatedSlip[0] = await expandBoat(updatedSlip[0], req)
        updatedSlip[0].self = `${req.protocol}://${req.get('Host')}/slips/${slipID}`;
        return updatedSlip.map(ds.fromDatastore);
    }
}

const deleteSlip = async (slipID) => {
    const slipKey = datastore.key([SLIP, slipID]);
    const slip = await datastore.get(slipKey);
    if (!slip[0]) {
        return Promise.resolve('empty');
    }
    else {
        if (slip[0].boat !== null) {
            const boatKey = datastore.key([BOAT, slip[0].boat]);
            const boat = await datastore.get(boatKey);
            const newBoat = { ...boat[0] };
            newBoat.slip = null;
            await datastore.update({ 'key': boatKey, 'data': newBoat });
        }
        await datastore.delete(slipKey);
        return Promise.resolve('deleted');
    }
};

// END MODEL FUNCTIONS

// START CONTROLLER FUNCTIONS

router.post('/', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.body.label === undefined || req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object missing at least one required attribute' });
        return;
    }
    else {
        const slip = await postSlip(req.body.label, req.body.length);
        slip[0].self = `${req.protocol}://${req.get('Host')}/slips/${slip[0].id}`;
        res.status(201).json(slip[0]);
    }
});

router.get('/', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    const slip = await getAllSlips(req);
    res.status(200).json(slip);
    return;
});

router.get('/:slipID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    const slip = await getOneSlip(req);
    if (slip === 'empty' || slip === 'unauthorized') {
        res.status(403).json({ 'error': 'no slip with this slip_id' });
        return;
    }
    else {
        res.status(200).json(slip[0]);
    }
});

router.put('/:slipID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.body.label === undefined || req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object is missing at least one of the required attributes' });
        return;
    }
    else {
        const slip = await putSlip(req);
        if (slip === 'empty' || slip === 'unauthorized') {
            res.status(403).json({ 'error': 'no slip with this slip_id' });
            return;
        }
        else {
            res.status(200).json(slip[0]);
        }
    }
});

router.patch('/:slipID', async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.get('Accept') !== 'application/json') {
        res.status(406).json({ 'Error': 'server only returns application/json data' });
        return
    }
    if (req.body.label === undefined && req.body.length === undefined) {
        res.status(400).json({ 'Error': 'request object is empty' });
        return;
    }
    else {
        const slip = await patchSlip(req);
        if (slip === 'empty' || slip === 'unauthorized') {
            res.status(403).json({ 'error': 'no slip with this slip_id' });
            return;
        }
        else {
            res.status(200).json(slip[0]);
        }
    }
});

router.delete('/:slipID', async (req, res) => {
    const slipID = parseInt(req.params.slipID);
    const response = await deleteSlip(slipID);
    if (response === 'empty' || response === 'unauthorized') {
        res.set('Content-Type', 'application/json');
        res.status(403).json({ 'error': 'no slip with this slip_id' });
        return;
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