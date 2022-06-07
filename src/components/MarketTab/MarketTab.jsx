import ImageList from "../ImageList/ImageList";
import { useState } from "react";
import "./../WalletTab/WalletTab.css"

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import getTestGeoJsons from "../../assets/getTestGeoJsons";

const testImageJson1 = {
    'name': 'Test1',
    'key': 'token1'
  };
  
  const testImageJson2 = {
    'name': 'Test2',
    'key': 'token2'
  };
  
  const testImageJson3 = {
    'name': 'Test3',
    'key': 'token3'
  };


const initialFilters = {
    "satellite": "senintel-8"
};





export default function MarketTab(props) {
    const { setImage } = props;

    const [images, setImages] = useState([]);

    const [showFilters, setShowFilters] = useState(false);
    const closeFilters = () => setShowFilters(false);
    const openFilters = () => setShowFilters(true);


    const [showUpload, setShowUpload] = useState(false);
    const closeUpload = () => setShowUpload(false);
    const openUpload = () => setShowUpload(true);

    function search() {
        setImages(getTestGeoJsons(5))
    }

    function filter() {
        openFilters();
    };


    function upload() {
        openUpload();
    };


    return (
        <div>
            <div className="ListButtonTab">
                <button onClick={() => {upload()}} className="ListButton">Upload Image</button> 
                <button onClick={() => {search()}} className="ListButton">Search This Area</button> 
                <button onClick={() => {filter()}} className="ListButton">Filters</button>
            </div>
            <Modal show={showFilters} onHide={closeFilters}>
                <Modal.Header closeButton>
                    <Modal.Title>Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>Filter options...</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeFilters}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={closeFilters}>
                    Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFilters} onHide={closeFilters}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>Upload GEOJSON or populate form</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeFilters}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={closeFilters}>
                    Upload
                    </Button>
                </Modal.Footer>
            </Modal>
            <ImageList images={images} setImage={setImage}></ImageList>
        </div>
    )
}

