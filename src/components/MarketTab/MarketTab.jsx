import ImageList from "../ImageList/ImageList";
import FilterModal from "../FilterModal/FilterModal";
import { useState } from "react";
import "./../WalletTab/WalletTab.css"

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import getTestGeoJsons from "../../utils/getTestGeoJsons";
import { getImageJsons } from "../../utils/util";


const initialFilters = {
    "satellite": "senintel-8"
};



export default function MarketTab(props) {
    const { setViewImage, mapBounds } = props;

    const [marketImages, setMarketImages] = useState([]);

    const [marketFilters, setMarketFilters] = useState([])

    const [showMarketFilters, setShowMarketFilters] = useState(false);
    const closeFilters = () => setShowMarketFilters(false);
    const openFilters = () => setShowMarketFilters(true);


    const [showUpload, setShowUpload] = useState(false);
    const closeUpload = () => setShowUpload(false);
    const openUpload = () => setShowUpload(true);

    function upload() { // TODO
        closeUpload();
    };

    function locationFilter(image) {
        if (!mapBounds)
            return true
        // const min_lat = Math.min(lat_bounds)
        // const max_lat = Math.max(lat_bounds)
        // const min_long = Math.min(long_bounds)
        // const max_long = Math.max(long_bounds)

        const image_coords = image.features[0].geometry.coordinates[0]
        console.log(mapBounds, image_coords)
        for (const coord of image_coords) {
            if (coord[0] >= mapBounds[0][0] && coord[0] <= mapBounds[1][0]) {
                if (coord[1] >= mapBounds[0][1] && coord[1] <= mapBounds[1][1]) {
                    return true
                }
            }
        }
        return false
    }
    
    async function search() {
        var images = await getImageJsons()
        // console.log("pre", images)
        for (var i=0; i<marketFilters.length; i++) {
            // console.log(marketFilters[i])
            images = images.filter(marketFilters[i])
        }
        // console.log("post", images)
        images = images.filter(locationFilter)  // TODO: fix, not working
        // console.log("postpost", images)
        setMarketImages(images)
    }

    function setNewMarketFilters(filters) {
        setMarketFilters(filters)
        closeFilters();
    };


    return (
        <div>
            <div className="ListButtonTab">
                <button onClick={search} className="ListButton">Search This Area</button>
                <button onClick={openFilters} className="ListButton">Filters</button> 
                <button onClick={openUpload} className="ListButton">Upload Image</button>
            </div>
            <ImageList images={marketImages} setViewImage={setViewImage}></ImageList>
            <Modal show={showUpload} onHide={closeUpload}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>Upload GEOJSON or populate form</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeUpload}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={upload}>
                    Upload
                    </Button>
                </Modal.Footer>
            </Modal>
            <FilterModal 
                showFilters={showMarketFilters}
                setFilters={setNewMarketFilters}
                closeFilters={closeFilters}
            ></FilterModal>
        </div>
    )
}

