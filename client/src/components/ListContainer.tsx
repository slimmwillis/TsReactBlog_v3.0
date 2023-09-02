// ListContainer.tsx

import React from 'react';
import { Item } from '../types/Item';

interface ListContainerProps {
  list: Item[];
}

const ListContainer: React.FC<ListContainerProps> = ({ list }) => {
  return (
    <div>
      <h1>List Items</h1>
      <ul>
        {list.map((item) => (
          <li key={item.id} >
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListContainer;
