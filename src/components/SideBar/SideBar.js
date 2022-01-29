import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideBarItem from './SideBarItem';
import { boatItems } from '../../data/boat-data';
import { cargoItems } from '../../data/cargo-data';
import { slipItems } from '../../data/slip-data';

const SideBar = ({ show }) => {
  const classNames = ['bg-white', 'd-flex', 'flex-column'];
  if (!show) {
    classNames.push('hidden');
  }
  return (
    <div id='side-bar' className={classNames.join(' ')}>
      <div className='text-center pt-2 pb-4 border-bottom'>
        <a href='#home' id='sidebarTitle' className='my-1'>
          Shipyard API
        </a>
      </div>

      <ul className='list-unstyled ps-0 mb-auto py-2'>
        <SideBarItem title='Boats' data={boatItems} attrLink='#boatAttrs' />
        <SideBarItem title='Cargo' data={cargoItems} attrLink='#cargoAttrs' />
        <SideBarItem title='Slips' data={slipItems} attrLink='#slipAttrs' />
      </ul>

      <div className='d-flex justify-content-evenly pt-4 border-top'>
        <div className=''>
          <FontAwesomeIcon icon={faGithub} className='mx-2 github-icon' />
          <a href='https://github.com/kaquino1/shipyard-rest-api' className='my-1 github-link'>
            API
          </a>
        </div>
        <div>
          <FontAwesomeIcon icon={faGithub} className='mx-2 github-icon' />
          <a href='https://github.com/kaquino1/shipyard-rest-api/tree/spec' className='my-1 github-link'>
            Docs
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
