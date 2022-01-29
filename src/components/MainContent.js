import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import APIClient from './RESTClient/APIClient';
import EndPointCardsContainer from './ContentCards/EndPointCardsContainer';
import AttributeCard from './ContentCards/AttributeCard';
import { boatAttrs, boatItems } from '../data/boat-data';
import { cargoAttrs, cargoItems } from '../data/cargo-data';
import { slipAttrs, slipItems } from '../data/slip-data';

const MainContent = ({ toggleSideBar, sideBar }) => {
  const classNames = ['bg-dark', 'w-100'];
  if (!sideBar) {
    classNames.push('expand');
  }
  return (
    <div id='main-content' className={classNames.join(' ')}>
      <Button id='home' variant='dark' className='fs-2' onClick={toggleSideBar}>
        <FontAwesomeIcon id='open-icon' icon={faCaretRight} className={!sideBar ? 'closed' : ''} />
        <span className='mx-1'>Shipyard API Documentation</span>
      </Button>

      <div className='mb-3 mx-3'>
        <div className='mb-3'>
          <span className='fs-4 text-light'>Register / Login: </span>
          <a className='fs-4 api-url' href='https://shipyard-rest-api.uk.r.appspot.com'>
            https://shipyard-rest-api.uk.r.appspot.com
          </a>
        </div>

        <APIClient />

        <h3 className='fw-thin text-white'>Boats</h3>
        <AttributeCard item={boatAttrs} />
        <EndPointCardsContainer data={boatItems} />

        <h3 className='fw-thin text-white'>Cargo</h3>
        <AttributeCard item={cargoAttrs} />
        <EndPointCardsContainer data={cargoItems} />

        <h3 className='fw-thin text-white'>Slips</h3>
        <AttributeCard item={slipAttrs} />
        <EndPointCardsContainer data={slipItems} />
      </div>
    </div>
  );
};

export default MainContent;
