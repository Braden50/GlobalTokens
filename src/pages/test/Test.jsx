import React, { useRef, useEffect, useState } from 'react';


import Tabs from 'react-bootstrap/Tabs';



export default function Test() {

  return (
    <div>
      <h1>test</h1>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="market" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Market</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="wallet" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Wallet</button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="market" role="tabpanel" aria-labelledby="home-tab">
          <h4>Image 1</h4>
          <h4>Image 2</h4>
          <h4>Image 3</h4>
          <h4>Image 4</h4>
        </div>
        <div className="tab-pane fade" id="wallet" role="tabpanel" aria-labelledby="profile-tab">
          <h4>My Image 1</h4>
          <h4>My Image 2</h4>
          <h4>My Image 3</h4>
        </div>
      </div>
    </div>
  );
}
