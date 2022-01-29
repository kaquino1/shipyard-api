export const slipAttrs = {
  name: 'Attributes',
  link: 'slipAttrs',
  attrs: [
    ['Property', 'Data Type', 'Notes'],
    [
      'label',
      'String',
      "The slip's idenifying label.\n May only contain alphanumeric characters, spaces, and these special characters: ':#&-.\n Cannot be an empty string or contain only spaces.\n Leading and trailing spaces will be removed and labels will be stored in uppercase characters.\n Slip labels must be unique and are case insensitive."
    ],
    ['length', 'Integer', 'The length of the slip in feet. Must be greater than 0.']
  ]
};

export const slipItems = [
  {
    link: 'postSlips',
    name: 'Create a Slip',
    endpoint: 'POST /slips',
    path_params: false,
    request_headers: ['Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['label', "The slip's idenifying label.", 'Yes.'],
      ['length', 'The length of the slip in feet.', 'Yes.']
    ],
    request_body_ex: { label: 'A97', length: 45 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '201 Created', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is missing at least one of the required attributes. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The slip length is not positive and/or the slip label contains forbidden characters.'
      ],
      ['Failure', '403 Forbidden', 'A slip with this label already exists.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: { id: 9944, label: 'A97', length: 45, boat: null, self: 'https://URL.com/slips/9944' }
  },
  {
    link: 'getAllSlips',
    name: 'View All Slips',
    endpoint: 'GET /slips',
    path_params: false,
    request_headers: ['Accept: application/json'],
    request_body: false,
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      slips: [
        {
          id: 9944,
          label: 'A97',
          length: 45,
          boat: { id: 234, name: 'Knot for Sail', self: 'https://URL.com/boats/234' },
          self: 'https://URL.com/slips/9944'
        },
        { id: 5511, label: 'B12', length: 20, boat: null, self: 'https://URL.com/slips/5511' },
        { id: 7744, label: 'C52', length: 50, boat: null, self: 'https://URL.com/slips/7744' },
        { id: 8855, label: 'A13', length: 100, boat: null, self: 'https://URL.com/slips/8855' },
        { id: 4411, label: 'B6', length: 33, boat: null, self: 'https://URL.com/slips/4411' }
      ],
      next: 'https://URL.com/slips/?cursor=Ci0SJHAgJjm%2BpkK%3D',
      total: 6
    }
  },
  {
    link: 'getOneSlip',
    name: 'View a Slip',
    endpoint: 'GET /slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: ['Accept: application/json'],
    request_body: false,
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      ['Failure', '403 Forbidden', 'No slip with this slip_id exists.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: {
      id: 9944,
      label: 'A97',
      length: 45,
      boat: { id: 234, name: 'Knot for Sail', self: 'https://URL.com/boats/234' },
      self: 'https://URL.com/slips/9944'
    }
  },
  {
    link: 'deleteOneSlip',
    name: 'Delete a Slip',
    endpoint: 'DELETE /slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: [],
    request_body: false,
    response_body_format: [false, 'JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '204 No Content', ''],
      ['Failure', '403 Forbidden', 'No slip with this slip_id exists.']
    ]
  },
  {
    link: 'putOneSlip',
    name: 'Edit a Slip - PUT',
    endpoint: 'PUT /slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: ['Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['label', "The slip's idenifying label.", 'Yes.'],
      ['length', 'The length of the slip in feet.', 'Yes.']
    ],
    request_body_ex: { label: 'A86', length: 44 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is missing at least one of the required attributes. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The slip length is not positive and/or the slip label contains forbidden characters.'
      ],
      ['Failure', '403 Forbidden', 'No slip with this slip_id exists. OR\n A slip with this label already exists.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: { id: 9944, label: 'A86', length: 44, boat: null, self: 'https://URL.com/slips/9944' }
  },
  {
    link: 'patchOneSlip',
    name: 'Edit a Slip - PATCH',
    endpoint: 'PATCH /slips/:slip_id',
    path_params: [
      ['Name', 'Description'],
      ['slip_id', 'The id of the slip.']
    ],
    request_headers: ['Accept: application/json'],
    request_body: 'Required',
    request_body_format: 'JSON',
    request_body_attrs: [
      ['Name', 'Description', 'Required?'],
      ['label', "The slip's idenifying label.", 'No.'],
      ['length', 'The length of the slip in feet.', 'No.']
    ],
    request_body_ex: { length: 46 },
    response_body_format: ['JSON'],
    response_statuses: [
      ['Outcome', 'Status Code', 'Notes'],
      ['Success', '200 OK', ''],
      [
        'Failure',
        '400 Bad Request',
        'The request object is empty. OR\n The request object contains extraneous attributes. OR\n One or more request object attributes are the wrong type. OR\n The slip length is not positive and/or the slip label contains forbidden characters.'
      ],
      ['Failure', '403 Forbidden', 'No slip with this slip_id exists. OR\n A slip with this label already exists.'],
      ['Failure', '406 Not Acceptable', 'The server only returns application/json data.']
    ],
    response_body_ex: { id: 9944, label: 'A86', length: 46, boat: null, self: 'https://URL.com/slips/9944' }
  }
];
