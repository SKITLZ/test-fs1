import React from 'react';

import './shop-list.css';

const ShopList = ({ shops }) => {
  const elements = shops.map((shop) => {
    const { id, name } = shop;
    return <li className="list-group-item" key={ id }>{ name }</li>;
  });

  return <ul className="shop-list list-group">{ elements }</ul>;
};

export default ShopList;