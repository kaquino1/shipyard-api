import React from 'react';
import RequestBody from './RequestBody';

const Params = ({ entries }) => {
  const rows = entries.map((row, indx) => (
    <tr key={indx}>
      {row.map((param, indx) => (
        <td key={indx}>{param}</td>
      ))}
    </tr>
  ));
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
};

const Headers = ({ entries }) => {
  const headers = entries.map((entry, indx) => <div key={indx}>{entry}</div>);
  return headers;
};

const RequestSection = ({ item }) => {
  return (
    <React.Fragment>
      <p className='fw-bold fs-5 my-1'>Request:</p>
      <dl className='list-unstyled mb-1'>
        <dt>Path Parameters:</dt>
        <dd>{item.path_params ? <Params entries={item.path_params} /> : 'None'}</dd>

        {item.request_headers.length > 0 && (
          <React.Fragment>
            <dt>Request Headers:</dt>
            <dd>
              <Headers entries={item.request_headers} />
            </dd>
          </React.Fragment>
        )}

        <dt>Request Body:</dt>
        <RequestBody item={item} />
      </dl>
    </React.Fragment>
  );
};

export default RequestSection;
