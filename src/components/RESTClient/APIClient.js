import { useState } from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import APIRequestForm from './APIRequestForm';
import APIResponse from './APIResponse';

const APIClient = () => {
  const [open, setOpen] = useState(true);
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState();

  const toggleClient = () => {
    setOpen(!open);
  };

  const handleResponse = apiResponse => {
    setShowResponse(true);
    setResponse(apiResponse);
  };

  return (
    <Card className='p-3 mb-3'>
      <Button variant='outline-dark' className='endpoint-btn' onClick={toggleClient} aria-expanded={open}>
        <FontAwesomeIcon icon={faCaretRight} className='right-caret' />
        <span className='mx-2'>REST Client</span>
      </Button>
      <Collapse in={open}>
        <div className='px-3'>
          <APIRequestForm onShowResponse={handleResponse} onResponse={handleResponse} />
          {showResponse && <APIResponse response={response} />}
        </div>
      </Collapse>
    </Card>
  );
};

export default APIClient;
