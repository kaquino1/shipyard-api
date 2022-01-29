export const boatAttrs = {
  name: 'Attributes',
  link: 'boatAttrs',
  attrs: [
    ['Property', 'Data Type', 'Notes'],
    [
      'name',
      'String',
      "The name of the boat.\n May only contain alphanumeric characters, spaces, and these special characters: ':#&-.\n Cannot be an empty string or contain only spaces.\n Leading and trailing spaces will be removed. \n Boat names must be unique and are case sensitive."
    ],
    [
      'type',
      'String',
      "The boat's type.\n May only contain alphanumeric characters, spaces, and these special characters: ':#&-.\n Cannot be an empty string or contain only spaces.\n Leading and trailing spaces will be removed."
    ],
    ['length', 'Integer', 'The length of the boat in feet. Must be greater than 0.']
  ]
};

export const boatItems = [
  {
    link: 'postBoat',
    name: 'Create A Boat',
    endpoint: 'POST /boats',
    path_params: false,
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['name', 'The name of the boat.', 'Yes.'],
      ['type', "The boat's type. E.g. Sailboat, Yacht, etc.", 'Yes.'],
      ['length', 'The length of the boat in feet.', 'Yes.']
    ],
    request_body_ex: { name: 'Sea Monster', type: 'Pirate Ship', length: 50 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '201 Created', ''],
      [
        'Failure',
        '400 Bad Request',
        'The boat is not created if the request is missing any required attributes.\n It is assumed that if the request contains any of the listed attributes, then the value of the attribute is valid.\n It is assumed that the request will not contain any extraneous attributes.'
      ],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 123,
      name: 'Sea Monster',
      type: 'Pirate Ship',
      length: 50,
      cargo: [],
      slip: null,
      owner: 'auth|5566',
      self: 'https://URL.com/boats/123'
    }
  },
  {
    link: 'getAllBoats',
    name: 'View All Boats',
    endpoint: 'GET /boats',
    path_params: false,
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      boats: [
        {
          id: 123,
          name: 'Sea Monster',
          type: 'Pirate Ship',
          length: 50,
          cargo: [],
          slip: null,
          owner: 'auth|5566',
          self: 'https://URL.com/boats/123'
        },
        {
          id: 234,
          name: 'Knot for Sail',
          type: 'Sailboat',
          length: 20,
          cargo: [],
          slip: { id: 9944, label: 'A97', self: 'https://URL.com/slips/9944' },
          owner: 'auth|5566',
          self: 'https://URL.com/boats/234'
        },
        {
          id: 345,
          name: 'Get Reel',
          type: 'Yacht',
          length: 60,
          cargo: [{ id: 1122, content: 'birthday hats', self: 'https://URL.com/cargo/1122' }],
          slip: null,
          owner: 'auth|5566',
          self: 'https://URL.com/boats/345'
        }
      ],
      total: 3
    }
  },
  {
    link: 'getOneBoat',
    name: 'View a Boat',
    endpoint: 'GET /boats/:boat_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The boat is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 345,
      name: 'Get Reel',
      type: 'Yacht',
      length: 60,
      cargo: [{ id: 1122, content: 'birthday hats', self: 'https://URL.com/cargo/1122' }],
      slip: null,
      owner: 'auth|5566',
      self: 'https://URL.com/boats/345'
    }
  },
  {
    link: 'deleteOneBoat',
    name: 'Delete a Boat',
    endpoint: 'DELETE /boats/:boat_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.']
    ],
    request_headers: ['Authorization: Bearer TOKEN'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The boat is owned by another user or it does not exist.']
    ]
  },
  {
    link: 'putOneBoat',
    name: 'Edit a Boat - PUT',
    endpoint: 'PUT /boats/:boat_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['name', 'The name of the boat.', 'No.'],
      ['type', "The boat's type. E.g. Sailboat, Yacht, etc.", 'No.'],
      ['length', 'The length of the boat in feet.', 'No.']
    ],
    request_body_ex: { name: 'Vitamin Sea', type: 'Catamaran', length: 50 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '400 Bad Request', 'The request object is missing at least one of the required attributes.'],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The boat is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 123,
      name: 'Vitamin Sea',
      type: 'Catamaran',
      length: 50,
      cargo: [],
      slip: null,
      owner: 'auth|5566',
      self: 'https://URL.com/boats/123'
    }
  },
  {
    link: 'patchOneBoat',
    name: 'Edit a Boat - PATCH',
    endpoint: 'PATCH /boats/:boat_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['name', 'The name of the boat.', 'Yes.'],
      ['type', "The boat's type. E.g. Sailboat, Yacht, etc.", 'Yes.'],
      ['length', 'The length of the boat in feet.', 'Yes.']
    ],
    request_body_ex: { name: 'Sea Monster' },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '400 Bad Request', 'The request object is empty.'],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The boat is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 123,
      name: 'Sea Monster',
      type: 'Catamaran',
      length: 50,
      cargo: [],
      slip: null,
      owner: 'auth|5566',
      self: 'https://URL.com/boats/123'
    }
  },
  {
    link: 'addCargoBoat',
    name: 'Add Cargo to Boat',
    endpoint: 'PATCH /boats/:boat_id/cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      [
        'Failure',
        '403 Forbidden',
        'The cargo is already assigned to a boat. OR\n  The boat and/or cargo is owned by another user or does not exist.'
      ]
    ]
  },
  {
    link: 'removeCargoBoat',
    name: 'Remove Cargo from Boat',
    endpoint: 'DELETE /boats/:boat_id/cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      [
        'Failure',
        '403 Forbidden',
        'The specified cargo is not assigned to the specified boat. OR\n The boat and/or cargo is owned by another user or does not exist.'
      ]
    ]
  },
  {
    link: 'dockBoatSlip',
    name: 'Dock Boat at Slip',
    endpoint: 'PATCH /boats/:boat_id/slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      [
        'Failure',
        '403 Forbidden',
        'The slip is already occcupied. OR\n The boat is already docked. OR\n The boat is larger than the slip. OR\n The boat is owned by another user or the boat and/or slip does not exist.'
      ]
    ]
  },
  {
    link: 'undockBoatSlip',
    name: 'Undock Boat from Slip',
    endpoint: 'DELETE /boats/:boat_id/slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['boat_id', 'The id of the boat.'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      [
        'Failure',
        '403 Forbidden',
        'The specified boat is not docked at the specified slip. OR\n The boat is owned by another user or the boat and/or slip does not exist.'
      ]
    ]
  }
];
