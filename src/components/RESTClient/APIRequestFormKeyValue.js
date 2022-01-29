import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const APIRequestFormKeyValue = ({ name, onRemove }) => {
  return (
    <InputGroup data-key-value-pair className='my-2'>
      <Form.Control data-key type='text' placeholder='Key' name={`data-key-${name}`} />
      <Form.Control data-value type='text' placeholder='Value' name={`data-value-${name}`} />
      <Button name={name} variant='outline-danger' type='button' onClick={onRemove}>
        Remove
      </Button>
    </InputGroup>
  );
};

export default APIRequestFormKeyValue;
