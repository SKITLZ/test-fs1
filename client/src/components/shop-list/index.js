import React from 'react';

import './shop-list.css';

import ShopListItem from '../shop-list-item'

const ShopList = ({ shops, ...otherProps }) => {
  const elements = shops.map((shop) => {
    return (
      <li className="shop-list__item list-group-item" key={shop._id}>
        <ShopListItem { ...shop } { ...otherProps } />
      </li>
    );
  });

  return <ul className="shop-list list-group">{ elements }</ul>;
};

export default ShopList;