import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import APIRequestFormKeyValue from './APIRequestFormKeyValue';
import APIRequestBody from './APIRequestBody';

const APITestFormTabs = () => {
  const [headersList, setHeadersList] = useState([{ index: uuidV4() }]);

  const onRemoveHeader = e => {
    const index = e.target.name;
    setHeadersList(headersList.filter(item => item.index !== index));
  };

  const headers = headersList.map(item => (
    <APIRequestFormKeyValue key={item.index} name={item.index} onRemove={onRemoveHeader} />
  ));

  const onAddHeader = () => {
    setHeadersList([...headersList, { index: uuidV4() }]);
  };

  return (
    <Tab.Container defaultActiveKey='token'>
      <Nav variant='tabs'>
        <Nav.Item>
          <Nav.Link eventKey='token'>Authorization Token</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='request-headers'>Headers</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='json'>JSON</Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content className='p-3 border-top-0 border'>
        <Tab.Pane eventKey='token'>
          <div id='token'>
            <div id='data-token'>
              <Form.Control name='data-token' placeholder='Token' className='my-2' />
            </div>
          </div>
        </Tab.Pane>
        <Tab.Pane eventKey='request-headers'>
          <div id='request-headers'>
            <div id='data-request-headers'>{headers}</div>
            <Button
              id='data-add-request-header-btn'
              variant='outline-success'
              className='mt-2'
              type='button'
              onClick={onAddHeader}
            >
              Add
            </Button>
          </div>
        </Tab.Pane>
        <Tab.Pane eventKey='json'>
          <div id='json'>
            <div id='data-json-request-body' className='overflow-auto'>
              <APIRequestBody />
            </div>
          </div>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default APITestFormTabs;
