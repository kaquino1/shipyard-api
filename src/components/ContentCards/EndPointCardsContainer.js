import React from 'react';
import EndPointCard from './EndPointCard';

const EndPointCardsContainer = ({ data }) => {
  return (
    <React.Fragment>
      {data.map(entry => (
        <EndPointCard key={entry.link} item={entry} />
      ))}
    </React.Fragment>
  );
};

export default EndPointCardsContainer;
