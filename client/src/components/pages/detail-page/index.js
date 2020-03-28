import React from 'react';

import './detail-page.css';

import ShopListItem from '../../shop-list-item';

const DetailPage = ({ shop, handleSaveBtn }) => {
  if (!shop) return <h2>Loading...</h2>

  return (
    <div className="detail-page">
      <ShopListItem shop={shop} handleSaveBtn={handleSaveBtn} isDetail />
    </div>
  );
};

export default DetailPage;