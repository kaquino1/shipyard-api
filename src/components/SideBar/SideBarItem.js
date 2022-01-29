import { useState } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

const ListLinks = ({ data, attrLink }) => {
  const links = data.map(entry => (
    <li key={entry.link}>
      <a key={entry.link} href={`#${entry.link}`} className='link-dark my-1'>
        {entry.name}
      </a>
    </li>
  ));
  return (
    <ul className='list-links list-unstyled fw-normal pb-1'>
      <li>
        <a href={attrLink} className='link-dark my-1'>
          Attributes
        </a>
      </li>
      {links}
    </ul>
  );
};

const SideBarItem = ({ title, data, attrLink }) => {
  const [open, setOpen] = useState(false);

  const toggleSideBarItem = () => {
    setOpen(!open);
  };

  return (
    <li className='mb-1'>
      <Button
        variant='outline-dark'
        className='side-bar-btn align-items-center fw-bold'
        onClick={toggleSideBarItem}
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faAngleRight} className='right-caret' />
        <span className='mx-1'>{title}</span>
      </Button>
      <Collapse in={open}>
        <div>
          <ListLinks data={data} attrLink={attrLink} />
        </div>
      </Collapse>
    </li>
  );
};

export default SideBarItem;
