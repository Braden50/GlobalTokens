import Modal from 'react-bootstrap/Modal';
// import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

export default function FilterModal(props) {
    const{ showFilters, setFilters, closeFilters } = props;
    
    const [ minPrice, setMinPrice ] = useState()
    const [ maxPrice, setMaxPrice ] = useState()
    const [ existingKeys, setExistingKeys ] = useState([])
    const [ keysToMatch, setKeysToMatch ] = useState({})

    function resetFilters() {
        setFilters([])
    }

    function populateFilters() {
        const minFilter = (image) => {
            if (!minPrice) return true
            const price = image.features[0].properties.price
            // console.log(price, minPrice)
            if (price >= minPrice) {
                return true
            }
            else {
                return false
            }
        }
        const maxFilter = (image) => {
            if (!maxPrice) return true
            const price = image.features[0].properties.price
            // console.log(price, maxPrice)
            if (price <= maxPrice) {
                return true
            }
            else {
                return false
            }
        }
        setFilters([
            minFilter,
            maxFilter
        ])
    }

    return (
        <Modal show={showFilters} onHide={closeFilters}>
            <Modal.Header closeButton>
                <Modal.Title>Filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    Min Price: <input
                        type="number"
                        id="minPrice"
                        placeholder={minPrice}
                        onChange={(event) => {setMinPrice(parseFloat(event.target.value))}}
                        step="0.01"
                    ></input> SOL
                    <br></br>
                    Max Price: <input
                        type="number"
                        id="minPrice"
                        placeholder={maxPrice}
                        onChange={(event) => {setMaxPrice(parseFloat(event.target.value))}}
                        step="0.01"
                    ></input> SOL
                    {/* <Button variant="secondary" onClick={closeFilters()}>
                    Close
                    </Button>
                    <Button variant="secondary" onClick={closeProperties}>
                    Update
                    </Button> */}
                    {/* { 

                    }
                    { existingKeys.length ? (
                        existingKeys.map((key, i) => <ImageBar image={image} key={i} index={i} setViewImage={setViewImage}/>)
                    ) : (
                        <h4>No Images</h4>
                    )} */}

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeFilters}>
                Close
                </Button>
                <Button variant="primary" onClick={resetFilters}>
                Reset Filters
                </Button>
                <Button variant="primary" onClick={populateFilters}>
                Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
