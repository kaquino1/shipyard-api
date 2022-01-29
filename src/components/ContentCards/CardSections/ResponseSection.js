import React from 'react';

const Formats = ({ entries }) => {
  return (
    <React.Fragment>
      <div> Succes: None</div>
      <div> Failure: {entries[1]}</div>
    </React.Fragment>
  );
};

const Statuses = ({ entries }) => {
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

const ResponseSection = ({ item }) => {
  return (
    <React.Fragment>
      <p className='fw-bold fs-5 mb-1'>Response:</p>
      <dl className='list-unstyled mb-0'></dl>
      <dt>Response Body Format:</dt>
      <dd>
        {item.response_body_format.length === 1 ? (
          item.response_body_format[0]
        ) : (
          <Formats entries={item.response_body_format} />
        )}
      </dd>
      <dt>Response Statuses:</dt>
      <dd>
        <Statuses entries={item.response_statuses} />
      </dd>
      {item.response_body_format.length === 1 && (
        <React.Fragment>
          <dt>Response Example:</dt>
          <dd>
            <pre>
              <code>{JSON.stringify(item.response_body_ex, undefined, 4)}</code>
            </pre>
          </dd>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ResponseSection;
