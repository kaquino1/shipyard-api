import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const APIResponseTabs = ({ response }) => {
  if (!response) {
    return;
  }

  return (
    <Tab.Container defaultActiveKey='response-json'>
      <Nav variant='tabs'>
        <Nav.Item>
          <Nav.Link eventKey='response-json'>JSON</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='response-headers'>Headers</Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content className='p-3 border-top-0 border'>
        <Tab.Pane eventKey='response-json'>
          <div id='data-response-json'>
            <div id='data-json-response-body' className='overflow-auto'>
              {response.data && (
                <pre>
                  <code>{JSON.stringify(response.data, undefined, 4)}</code>
                </pre>
              )}
            </div>
          </div>
        </Tab.Pane>
        <Tab.Pane eventKey='response-headers'>
          {response && (
            <div id='response-headers'>
              {Object.keys(response.headers).map((keyName, i) => (
                <div className='row' key={i}>
                  <div className='col-2 py-1'>{keyName}:</div>
                  <div className='col-3 py-1'>{response.headers[keyName]}</div>
                </div>
              ))}
            </div>
          )}
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default APIResponseTabs;
