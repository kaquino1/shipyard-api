import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const APIRequestBody = () => {
  const [code, setCode] = useState('{\n\n}');

  const handleTab = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <Form.Control
      as='textarea'
      name='data-request-json'
      id='data-request-json'
      rows={5}
      value={code}
      onKeyDown={handleTab}
      onChange={e => setCode(e.target.value)}
    />
  );
};

export default APIRequestBody;
