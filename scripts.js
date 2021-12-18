const toggleSidebar = () => {
    document.getElementById('mySidebar').classList.toggle('closed')
    document.getElementById('main').classList.toggle('closed')
    document.getElementById('openbtn').classList.toggle('hide')
}

const postBoatsRequest = {"name": "Sea Monster", "type": "Pirate Ship", "length": 50}
const postBoatsResponse = {"id": 123, "name": "Sea Monster", "type": "Pirate Ship", "length": 50, "cargo": [], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/123"}

const postCargoRequest = {"content": "birthday hats", "volume": 20}
const postCargoResponse = {"id": 1122, "content": "birthday hats", "volume": 20, "creationDate": "2021-12-05", "carrier": null, "self": "https://URL.com/cargo/122"}

const postSlipsRequest = {"label": "A97", "length": 45}
const postSlipsResponse = {"id": 9944, "label": "A97", "length": 45, "boat": null, "self": "https://URL.com/slips/9944"}

const getAllBoatsResponse = {"boats": [
    {"id": 123, "name": "Sea Monster", "type": "Pirate Ship", "length": 50, "cargo": [], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/123"},{"id": 234, "name": "Knot for Sail", "type": "Sailboat", "length": 20, "cargo": [], "slip": {"id": 9944, "label": "A97", "self": "https://URL.com/slips/9944"}, "owner": "auth|5566", "self": "https://URL.com/boats/234"},
    {"id": 345, "name": "Get Reel", "type": "Yacht", "length": 60, "cargo": [{"id": 1122, "content": "birthday hats", "self": "https://URL.com/cargo/1122"}], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/345"}],
    "total": 3}

const getAllCargoResponse = {"cargo": [
    {"id": 1122, "content": "birthday hats", "volume": 20, "creationDate": "2021-12-05", "carrier": {"id": 345, "name": "Get Reel", "self": "https://URL.com/boats/345"}, "self": "https://URL.com/cargo/122"},
    {"id": 2233, "content": "jumbo sombreros", "volume": 10, "creationDate": "2021-11-23", "carrier": null, "self": "https://URL.com/cargo/2233"},
    {"id": 6677, "content": "ugly Christmas sweaters", "volume": 44, "creationDate": "2021-12-15", "carrier": null, "self": "https://URL.com/cargo/6677"},
    {"id": 7788, "content": "red M&Ms", "volume": 50, "creationDate": "2021-11-16", "carrier": null, "self": "https://URL.com/cargo/7788"}],
    "total": 4}

const getAllSlipsResponse = {"slips": [
    {"id": 9944, "label": "A97", "length": 45, "boat": {"id": 234, "name": "Knot for Sail", "self": "https://URL.com/boats/234"}, "self": "https://URL.com/slips/9944"},
    {"id": 5511, "label": "B12", "length": 20, "boat": null, "self": "https://URL.com/slips/5511"},
    {"id": 7744, "label": "C52", "length": 50, "boat": null, "self": "https://URL.com/slips/7744"},
    {"id": 8855, "label": "A13", "length": 100, "boat": null, "self": "https://URL.com/slips/8855"},
    {"id": 4411, "label": "B6", "length": 33, "boat": null, "self": "https://URL.com/slips/4411"}],
    "next": "https://URL.com/slips/?cursor=Ci0SJHAgJjm%2BpkK%3D",
    "total": 6}

const getOneBoatResponse = {"id": 345, "name": "Get Reel", "type": "Yacht", "length": 60, "cargo": [{"id": 1122, "content": "birthday hats", "self": "https://URL.com/cargo/1122"}], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/345"}

const getOneCargoResponse = {"id": 1122, "content": "birthday hats", "volume": 20, "creationDate": "2021-12-05", "carrier": {"id": 345, "name": "Get Reel", "self": "https://URL.com/boats/345"}, "self": "https://URL.com/cargo/122"}

const getOneSlipResponse = {"id": 9944, "label": "A97", "length": 45, "boat": {"id": 234, "name": "Knot for Sail", "self": "https://URL.com/boats/234"}, "self": "https://URL.com/slips/9944"}

const putOneBoatRequest = {"name": "Vitamin Sea", "type": "Catamaran", "length": 50}
const putOneBoatResponse = {"id": 123, "name": "Vitamin Sea", "type": "Catamaran", "length": 50, "cargo": [], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/123"}

const putOneCargoRequest = {"content": "kazoos", "volume": 31}
const putOneCargoResponse = {"id": 1122, "content": "kazoos", "volume": 31, "creationDate": "2021-12-05", "carrier": null, "self": "https://URL.com/cargo/122"}

const putOneSlipRequest = {"label": "A86", "length": 44}
const putOneSlipResponse = {"id": 9944, "label": "A86", "length": 44, "boat": null, "self": "https://URL.com/slips/9944"}

const patchOneBoatRequest = {"name": "Sea Monster"}
const patchOneBoatResponse = {"id": 123, "name": "Sea Monster", "type": "Catamaran", "length": 50, "cargo": [], "slip": null, "owner": "auth|5566", "self": "https://URL.com/boats/123"}

const patchOneCargoRequest = {"volume": 41}
const patchOneCargoResponse = {"id": 1122, "content": "kazoos", "volume": 41, "creationDate": "2021-12-05", "carrier": null, "self": "https://URL.com/cargo/122"}

const patchOneSlipRequest = {"length": 46}
const patchOneSlipResponse = {"id": 9944, "label": "A86", "length": 46, "boat": null, "self": "https://URL.com/slips/9944"}

window.onload = () => {
    document.getElementById('postBoatsRequest').innerHTML = JSON.stringify(postBoatsRequest, undefined, 4);
    document.getElementById('postBoatsResponse').innerHTML = JSON.stringify(postBoatsResponse, undefined, 4);
    document.getElementById('postCargoRequest').innerHTML = JSON.stringify(postCargoRequest, undefined, 4);
    document.getElementById('postCargoResponse').innerHTML = JSON.stringify(postCargoResponse, undefined, 4);
    document.getElementById('postSlipsRequest').innerHTML = JSON.stringify(postSlipsRequest, undefined, 4);
    document.getElementById('postSlipsResponse').innerHTML = JSON.stringify(postSlipsResponse, undefined, 4);

    document.getElementById('getAllBoatsResponse').innerHTML = JSON.stringify(getAllBoatsResponse, undefined, 4);
    document.getElementById('getAllCargoResponse').innerHTML = JSON.stringify(getAllCargoResponse, undefined, 4);
    document.getElementById('getAllSlipsResponse').innerHTML = JSON.stringify(getAllSlipsResponse, undefined, 4);

    document.getElementById('getOneBoatResponse').innerHTML = JSON.stringify(getOneBoatResponse, undefined, 4);
    document.getElementById('getOneCargoResponse').innerHTML = JSON.stringify(getOneCargoResponse, undefined, 4);
    document.getElementById('getOneSlipResponse').innerHTML = JSON.stringify(getOneSlipResponse, undefined, 4);

    document.getElementById('putOneBoatRequest').innerHTML = JSON.stringify(putOneBoatRequest, undefined, 4);
    document.getElementById('putOneBoatResponse').innerHTML = JSON.stringify(putOneBoatRequest, undefined, 4);
    document.getElementById('putOneCargoRequest').innerHTML = JSON.stringify(putOneCargoRequest, undefined, 4);
    document.getElementById('putOneCargoResponse').innerHTML = JSON.stringify(putOneCargoResponse, undefined, 4);
    document.getElementById('putOneSlipRequest').innerHTML = JSON.stringify(putOneSlipRequest, undefined, 4);
    document.getElementById('putOneSlipResponse').innerHTML = JSON.stringify(putOneSlipResponse, undefined, 4);

    document.getElementById('patchOneBoatRequest').innerHTML = JSON.stringify(patchOneBoatRequest, undefined, 4);
    document.getElementById('patchOneBoatResponse').innerHTML = JSON.stringify(patchOneBoatResponse, undefined, 4);
    document.getElementById('patchOneCargoRequest').innerHTML = JSON.stringify(patchOneCargoRequest, undefined, 4);
    document.getElementById('patchOneCargoResponse').innerHTML = JSON.stringify(patchOneCargoResponse, undefined, 4);
    document.getElementById('patchOneSlipRequest').innerHTML = JSON.stringify(patchOneSlipRequest, undefined, 4);
    document.getElementById('patchOneSlipResponse').innerHTML = JSON.stringify(patchOneSlipResponse, undefined, 4);
}