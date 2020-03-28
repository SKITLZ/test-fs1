import React from 'react';
import { Route } from "react-router-dom";

import './detail-page.css';

import ShopListItem from '../../shop-list-item';

const DetailPage = ({ shop, handleSaveBtn, createNew }) => {
  if (!shop) return <h2>Loading...</h2>

  return (
    <Route
      render={(props) => {
        return (
          <div className="detail-page">
            <ShopListItem shop={shop} handleSaveBtn={handleSaveBtn} createNew={createNew} isDetail history={props.history} />
          </div>
        );
      }}
    />
  );
};

export default DetailPage;