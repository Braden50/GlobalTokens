import React, { useRef, useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import { CandyMachine, mintOneToken } from '../../solana/candy-machine';

import * as anchor from "@project-serum/anchor";

// import {
//   MintLayout,
//   TOKEN_PROGRAM_ID,
//   Token,
// } from "@solana/spl-token";


// mintOneToken = async (
//   candyMachine: CandyMachine,
//   config: anchor.web3.PublicKey, // feels like this should be part of candyMachine?
//   payer: anchor.web3.PublicKey,
//   treasury: anchor.web3.PublicKey,
// )
// function mintToken() {



export default function Test() {
  // [candyMachine, setCandyMachine] = useState()
  

  return (
    <div>
      <Button variant="secondary" onClick={() => {}}>
        Close
      </Button>
      <Button variant="secondary" onClick={() => {}}>
        Close
      </Button>
    </div>
  );
}
