import prettyBytes from 'pretty-bytes';
import APIResponseTabs from './APIResponseTabs';

const APIResponse = ({ response }) => {
  if (!response) return null;
  return (
    <div className='mt-4 '>
      <div className='fs-4'>Response</div>
      <div className='d-flex mt-2 mb-4'>
        <div className='me-3'>
          Status:{' '}
          <span id='data-status' className={response.status >= 400 ? 'text-danger' : 'text-success'}>
            {response.status}
          </span>
        </div>
        {response.meta && (
          <div className='me-3'>
            Time: <span id='data-time'>{response.meta.time}</span>ms
          </div>
        )}
        <div className='me-3'>
          Size:{' '}
          <span id='data-size'>
            {prettyBytes(JSON.stringify(response.data).length + JSON.stringify(response.headers).length)}
          </span>
        </div>
      </div>
      <APIResponseTabs response={response} />
    </div>
  );
};

export default APIResponse;
