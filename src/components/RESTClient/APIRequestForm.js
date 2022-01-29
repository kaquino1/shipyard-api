import React, { useState } from 'react';
import restService from '../../restService';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import APIRequestFormTabs from './APIRequestFormTabs';

const APIRequestForm = ({ onResponse }) => {
  const [formKey, setFormKey] = useState(Math.random());

  const keyValuePairsToObjects = entries => {
    const keys = [];
    const values = [];
    Object.keys(entries).forEach(label => {
      if (label.includes('data-key-')) {
        keys.push(label);
      }
      if (label.includes('data-value-')) {
        values.push(label);
      }
    });
    const result = {};
    keys.forEach((key, i) => (result[entries[key]] = entries[values[i]]));
    return result;
  };

  const createParams = (entries, data) => {
    let headers = keyValuePairsToObjects(entries);
    if (entries['data-token']) {
      headers = { ...headers, Authorization: `Bearer ${entries['data-token']}` };
    }
    return {
      url: `https://shipyard-rest-api.uk.r.appspot.com${entries['data-url']}`,
      method: entries['data-method'],
      headers: headers,
      data
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEntries = {};
    let data;
    for (const [key, value] of formData.entries()) {
      if (key === 'data-request-json') {
        try {
          data = JSON.parse(value || null);
        } catch (e) {
          alert('JSON data is malformed');
          return;
        }
      }
      if (value) {
        if (['login', 'callback', 'userinfo'].some(el => value.toLowerCase().includes(el))) {
          formEntries[key] = '/error';
        } else {
          formEntries[key] = value.toLowerCase();
        }
      }
    }
    setFormKey(Math.random());
    const params = createParams(formEntries, data);
    const reply = await restService(params);
    onResponse(reply);
  };

  return (
    <Form key={formKey} className='mt-4' onSubmit={handleSubmit}>
      <InputGroup className='mb-4'>
        <Form.Select className='flex-grow-0 w-auto' defaultValue={'GET'} name='data-method'>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </Form.Select>
        <InputGroup.Text>https://shipyard-rest-api.uk.r.appspot.com</InputGroup.Text>
        <Form.Control required name='data-url' placeholder='/slips' />
        <Button as='input' type='submit' variant='secondary' value='Send' />
      </InputGroup>
      <APIRequestFormTabs />
    </Form>
  );
};

export default APIRequestForm;
