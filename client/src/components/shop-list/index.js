import React from 'react';

import './shop-list.css';

import ShopListItem from '../shop-list-item'

const ShopList = ({ shops, ...otherProps }) => {
  const elements = shops.map((shop) => {
    const classNames = `shop-list__item list-group-item ${shop.isClosed ? '--closed' : false}`;
    return (
      <li className={classNames} key={shop._id}>
        <ShopListItem shop={shop} { ...otherProps } />
      </li>
    );
  });

  return <ul className="shop-list list-group">{ elements }</ul>;
};

export default ShopList;