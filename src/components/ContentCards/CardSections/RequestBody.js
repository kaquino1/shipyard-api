import React from 'react';

const BodyAttrs = ({ entries }) => {
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

const RequestBody = ({ item }) => {
  return (
    <React.Fragment>
      <dd>{item.request_body ? item.request_body : 'None'}</dd>
      {item.request_body_format && (
        <React.Fragment>
          <dt>Request Body Format:</dt>
          <dd>JSON</dd>
          <dt>Request JSON Attributes:</dt>
          <dd>
            <BodyAttrs entries={item.request_body_attrs} />
          </dd>
          <dt>Request Body Example:</dt>
          <dd>
            <pre>
              <code>{JSON.stringify(item.request_body_ex, undefined, 4)}</code>
            </pre>
          </dd>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default RequestBody;
