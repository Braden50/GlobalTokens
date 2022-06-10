import "./ImageList.css"

import { useEffect, useState } from "react";
// import styled from "styled-components";
// import Countdown from "react-countdown";
import { CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";


import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';

import AccordionButton from "react-bootstrap/esm/AccordionButton";


import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    shortenAddress,
    CANDY_MACHINE_PROGRAM
  } from "../../solana/candy-machine";

 


function ImageBar(imageProps : any) {
    const { image, index, setViewImage } = imageProps
    const [showImage, setShowImage] = useState(false)

    const [showProperties, setShowProperties] = useState(false)
    const openProperties = () => {setShowProperties(true)}
    const closeProperties = () => {setShowProperties(false)}

    const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false)
    const openPurchaseConfirm = () => {setShowPurchaseConfirm(true)}
    const closePurchaseConfirm = () => {setShowPurchaseConfirm(false)}

    // ---------
    const [balance, setBalance] = useState<number>();
    const [isActive, setIsActive] = useState(false); // true when countdown completes
    const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  
    const [itemsAvailable, setItemsAvailable] = useState(0);
    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsRemaining, setItemsRemaining] = useState(0);

    interface AlertState {
      open: Boolean;
      message: String;
      severity: any;
    }
    
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
      });
    const closeAlert = () => {setAlertState({
        open: false,
        message: "",
        severity: undefined,
    });}

    const wallet = useAnchorWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

 

    var img_props = image.features[0].properties
    img_props["coords"] = image.features[0].geometry.coordinates

    const on_chain_props = image.features[0].properties.on_chain

    const treasury = new anchor.web3.PublicKey(on_chain_props.metadata_authority)
    const config = new anchor.web3.PublicKey(on_chain_props.candy_machine_address)
    const candyMachineId = new anchor.web3.PublicKey(on_chain_props.candy_machine_address)
    const devnet_rpc = "https://explorer-api.devnet.solana.com";
    const connection = new anchor.web3.Connection(devnet_rpc);
    const startDateSeed = parseInt(on_chain_props.go_live_stamp, 10);
    const txTimeout = 30000;  // test

    const [startDate, setStartDate] = useState(new Date(startDateSeed));

    interface CandyProps {
      candyMachineId: anchor.web3.PublicKey;
      config: anchor.web3.PublicKey;
      connection: anchor.web3.Connection;
      startDate: number;
      treasury: anchor.web3.PublicKey;
      txTimeout: number;
    }

    const props: CandyProps = {
      candyMachineId: candyMachineId,
      config: config,
      connection: connection,
      startDate: startDateSeed,
      treasury: treasury,
      txTimeout: txTimeout
    }

    const refreshCandyMachineState = () => {
      (async () => {
          if (!wallet) return;

          const {
          candyMachine,
          goLiveDate,
          itemsAvailable,
          itemsRemaining,
          itemsRedeemed,
          } = await getCandyMachineState(
          wallet as anchor.Wallet,
          props.candyMachineId,
          props.connection
          );

          setItemsAvailable(itemsAvailable);
          setItemsRemaining(itemsRemaining);
          setItemsRedeemed(itemsRedeemed);

          setIsSoldOut(itemsRemaining === 0);
          setStartDate(goLiveDate);
          setCandyMachine(candyMachine);
      })();
    };


    const purchase = async () => {
      try {
        setIsMinting(true);
        if (wallet && candyMachine?.program) {
          const mintTxId = await mintOneToken(
            candyMachine,
            props.config,
            wallet.publicKey,
            props.treasury
          );
  
          const status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            "singleGossip",
            false
          );
  
          if (!status?.err) {
            setAlertState({
              open: true,
              message: "Congratulations! Mint succeeded!",
              severity: "success",
            });
          } else {
            setAlertState({
              open: true,
              message: "Mint failed! Please try again!",
              severity: "error",
            });
          }
        }
      } catch (error: any) {
        // TODO: blech:
        let message = error.msg || "Minting failed! Please try again!";
        if (!error.msg) {
          if (error.message.indexOf("0x138")) {
          } else if (error.message.indexOf("0x137")) {
            message = `SOLD OUT!`;
          } else if (error.message.indexOf("0x135")) {
            message = `Insufficient funds to mint. Please fund your wallet.`;
          }
        } else {
          if (error.code === 311) {
            message = `SOLD OUT!`;
            setIsSoldOut(true);
          } else if (error.code === 312) {
            message = `Minting period hasn't started yet.`;
          }
        }
  
        setAlertState({
          open: true,
          message,
          severity: "error",
        });
      } finally {
        if (wallet) {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
        setIsMinting(false);
        refreshCandyMachineState();
      }
    };

    useEffect(() => {
      (async () => {
        if (wallet) {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      })();
    }, [wallet, props.connection]);

    useEffect(refreshCandyMachineState, [
      wallet,
      props.candyMachineId,
      props.connection,
    ]);
    

    function setImageToDisplay() {
        try {
            setViewImage(image)
        } catch (err) {
            console.log(err)
        }
        
    }

    return (
        <Accordion.Item eventKey={index}>
            <Accordion.Header>{img_props.name} - {img_props.price} SOL</Accordion.Header>
            <Accordion.Body>
                <div className="flex-container">
                    <button onClick={setImageToDisplay} className="ListButton">Show On Map</button>
                    <button onClick={openProperties} className="ListButton">Show Properties</button>
                </div>
                <div className="flex-container">
                    <button onClick={openPurchaseConfirm} className="ListButton">Purchase</button>
                </div>
                {wallet && (
                  <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
                )}

                {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}

                {wallet && <p>Total Available: {itemsAvailable}</p>}

                {wallet && <p>Redeemed: {itemsRedeemed}</p>}

                {wallet && <p>Remaining: {itemsRemaining}</p>}
            </Accordion.Body>
            <Modal show={showProperties} onHide={closeProperties}>
                <Modal.Header closeButton>
                    <Modal.Title>Properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {<ul>
                        {Object.keys(img_props).map((key, i) => 
                            <li key={i}>{key}: {JSON.stringify(img_props[key], null, 2)}</li>)}
                    </ul>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProperties}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPurchaseConfirm} onHide={closePurchaseConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Purchase Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Initiate purchase for {img_props.price} SOL?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closePurchaseConfirm}>
                    Close
                    </Button>
                    { wallet ? (
                      <Button variant="primary" onClick={purchase}>Purchase</Button>
                    ) : (
                      <WalletDialogButton></WalletDialogButton>
                    )}
                </Modal.Footer>
            </Modal>
            { alertState.open &&
            <Alert key="alert" onClose={closeAlert}>
                {alertState.message}
            </Alert>
            }
        </Accordion.Item>
    )
}


{/* <Accordion.Collapse eventKey="0">
<Card.Body>Hello! I'm the body</Card.Body>
</Accordion.Collapse> */}

export default function ImageList(props: any) {  
    
    const { images, setViewImage } = props       // list of image json objects
    const imgList: [any] = Object.assign(images)
    return (
        <div className="scrollbar">
            <Accordion> 
                { imgList.length ? (
                    imgList.map((image, i) => <ImageBar image={image} key={i} index={i} setViewImage={setViewImage}/>)
                ) : (
                    <h4>No Images</h4>
                )}   
            </Accordion>
        </div>
    )
}



{/* <ul className="content" ref={contentRef}>
        {comments.length ? (
          comments.map((data, i) => <CommentCard key={i} {...data} />)
        ) : (
          <p className="absolute-center">
            Looks like you are the first one here, start the discussion!
          </p>
        )}
        <MessageComposer onSend={postMessage} />
      </ul> */}
