export const cargoAttrs = {
  name: 'Attributes',
  link: 'cargoAttrs',
  attrs: [
    ['Property', 'Data Type', 'Notes'],
    [
      'content',
      'String',
      "The cargo's content.\n May only contain alphanumeric characters, spaces, and these special characters: ':#&-.\n Cannot be an empty string or contain only spaces.\n Leading and trailing spaces will be removed."
    ],
    ['volume', 'Integer', 'The volume of the cargo in cubic feet. Must be greater than 0.']
  ]
};

export const cargoItems = [
  {
    link: 'postCargo',
    name: 'Create a Cargo Load',
    endpoint: 'POST /cargo',
    path_params: false,
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['content', "The cargo's content.", 'Yes.'],
      ['volume', 'The volume of the cargo in cubic feet.', 'Yes.']
    ],
    request_body_ex: { content: 'birthday hats', volume: 20 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '201 Created', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is missing at least one of the required attributes. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The cargo volume is not positive and/or the cargo content contains forbidden characters.'
      ],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 1122,
      content: 'birthday hats',
      volume: 20,
      creationDate: '2021-12-05',
      carrier: null,
      self: 'https://URL.com/cargo/122'
    }
  },
  {
    link: 'getAllCargo',
    name: 'View All Cargo Loads',
    endpoint: 'GET /cargo',
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
      cargo: [
        {
          id: 1122,
          content: 'birthday hats',
          volume: 20,
          creationDate: '2021-12-05',
          carrier: { id: 345, name: 'Get Reel', self: 'https://URL.com/boats/345' },
          self: 'https://URL.com/cargo/122'
        },
        {
          id: 2233,
          content: 'jumbo sombreros',
          volume: 10,
          creationDate: '2021-11-23',
          carrier: null,
          self: 'https://URL.com/cargo/2233'
        },
        {
          id: 6677,
          content: 'ugly Christmas sweaters',
          volume: 44,
          creationDate: '2021-12-15',
          carrier: null,
          self: 'https://URL.com/cargo/6677'
        },
        {
          id: 7788,
          content: 'red M&Ms',
          volume: 50,
          creationDate: '2021-11-16',
          carrier: null,
          self: 'https://URL.com/cargo/7788'
        }
      ],
      total: 4
    }
  },
  {
    link: 'getOneCargo',
    name: 'View a Cargo Load',
    endpoint: 'GET /cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: false,
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The cargo load is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 1122,
      content: 'birthday hats',
      volume: 20,
      creationDate: '2021-12-05',
      carrier: { id: 345, name: 'Get Reel', self: 'https://URL.com/boats/345' },
      self: 'https://URL.com/cargo/122'
    }
  },
  {
    link: 'deleteOneCargo',
    name: 'Delete a Cargo Load',
    endpoint: 'DELETE /cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN'],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The cargo load is owned by another user or it does not exist.']
    ]
  },
  {
    link: 'putOneCargo',
    name: 'Edit a Cargo Load - PUT',
    endpoint: 'PUT /cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['content', "The cargo's content.", 'Yes.'],
      ['volume', 'The volume of the cargo in cubic feet.', 'Yes.']
    ],
    request_body_ex: { content: 'kazoos', volume: 31 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is missing at least one of the required attributes. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The cargo volume is not positive and/or the cargo content contains forbidden characters.'
      ],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The cargo load is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 1122,
      content: 'kazoos',
      volume: 31,
      creationDate: '2021-12-05',
      carrier: null,
      self: 'https://URL.com/cargo/122'
    }
  },
  {
    link: 'patchOneCargo',
    name: 'Edit a Cargo Load - PATCH',
    endpoint: 'PATCH /cargo/:cargo_id',
    path_params: [
      ['Name', 'Description'],
      ['cargo_id', 'The id of the cargo load.']
    ],
    request_headers: ['Authorization: Bearer TOKEN', 'Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['content', "The cargo's content.", 'No.'],
      ['volume', 'The volume of the cargo in cubic feet.', 'No.']
    ],
    request_body_ex: { volume: 41 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is empty. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The cargo volume is not positive and/or the cargo content contains forbidden characters.'
      ],
      ['Failure', '401 Unauthorized', 'The JWT is invalid or missing.'],
      ['Failure', '403 Forbidden', 'The cargo load is owned by another user or it does not exist.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 1122,
      content: 'kazoos',
      volume: 41,
      creationDate: '2021-12-05',
      carrier: null,
      self: 'https://URL.com/cargo/122'
    }
  }
];

export default cargoItems;
