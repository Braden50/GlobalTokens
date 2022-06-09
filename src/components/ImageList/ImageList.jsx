import "./ImageList.css"

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useState } from "react";
import AccordionButton from "react-bootstrap/esm/AccordionButton";




function ImageBar(props) {
    const { image, index, setViewImage } = props
    const [showImage, setShowImage] = useState(false)

    const [showProperties, setShowProperties] = useState(false)
    const openProperties = () => {setShowProperties(true)}
    const closeProperties = () => {setShowProperties(false)}

    const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false)
    const openPurchaseConfirm = () => {setShowPurchaseConfirm(true)}
    const closePurchaseConfirm = () => {setShowPurchaseConfirm(false)}

    var img_props = image.features[0].properties
    img_props["coords"] = image.features[0].geometry.coordinates


    function setImageToDisplay() {
        try {
            setViewImage(image)
        } catch (err) {
            console.log(err)
        }
        
    }
    

    function purchase() {
        closePurchaseConfirm()
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
            </Accordion.Body>
            <Modal show={showProperties} onHide={closeProperties}>
                <Modal.Header closeButton>
                    <Modal.Title>Properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {<ul>
                        {Object.keys(img_props).map((key, i) => 
                            <li key={i}>{key}: {img_props[key]}</li>)}
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
                    <Button variant="primary" onClick={purchase}>
                    Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Accordion.Item>
    )
}


{/* <Accordion.Collapse eventKey="0">
<Card.Body>Hello! I'm the body</Card.Body>
</Accordion.Collapse> */}

export default function ImageList(props) {  
    
    const { images, setViewImage } = props       // list of image json objects
    const imgList = Object.assign(images)
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
