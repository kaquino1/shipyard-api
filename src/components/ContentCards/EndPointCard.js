import { useState } from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import RequestSection from './CardSections/RequestSection';
import ResponseSection from './CardSections/ResponseSection';

const EndPointCard = ({ item }) => {
  const [open, setOpen] = useState(true);

  const toggleEndPointItem = () => {
    setOpen(!open);
  };

  return (
    <Card className='p-3 mb-3'>
      <Button
        id={item.link}
        variant='outline-dark'
        className='endpoint-btn'
        onClick={toggleEndPointItem}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faCaretRight} className='right-caret' />
        <span className='mx-2'>{item.name}</span>
      </Button>
      <Collapse in={open}>
        <div className='px-3'>
          <hr />
          <code className='endpoint fs-4'>{item.endpoint}</code>
          <RequestSection item={item} />
          <ResponseSection item={item} />
        </div>
      </Collapse>
    </Card>
  );
};

export default EndPointCard;
