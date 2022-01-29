import { useState } from 'react';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

const Attrs = ({ entries }) => {
  const rows = entries.map((row, indx) => (
    <tr key={indx}>
      {row.map((attr, indx) => (
        <td key={indx}>{attr}</td>
      ))}
    </tr>
  ));
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
};

const AttributeCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  const toggleAttrItem = () => {
    setOpen(!open);
  };

  return (
    <Card className='p-3 mb-3'>
      <Button
        id={item.link}
        variant='outline-dark'
        className='endpoint-btn'
        onClick={toggleAttrItem}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faCaretRight} className='right-caret' />
        <span className='mx-2'>{item.name}</span>
      </Button>
      <Collapse in={open}>
        <div className='px-3'>
          <hr />

          <Attrs entries={item.attrs} />
        </div>
      </Collapse>
    </Card>
  );
};

export default AttributeCard;
