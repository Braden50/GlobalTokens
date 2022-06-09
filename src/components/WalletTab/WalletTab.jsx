
// import Logout from "../../util/Logout"
import ImageList from "../ImageList/ImageList";
import FilterModal from "../FilterModal/FilterModal";

import "./WalletTab.css"

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import getTestGeoJsons from "../../utils/getTestGeoJsons";
import { getImageJsons } from "../../utils/util";




  
export default function WalletTab(props) {
    const { setViewImage } = props;
    const navigation = useNavigate()
    const [walletImages, setWalletImages] = useState([]);

    const [walletFilters, setWalletFilters] = useState([])

    const [showWalletFilters, setShowWalletFilters] = useState(false);
    const closeFilters = () => setShowWalletFilters(false);
    const openFilters = () => setShowWalletFilters(true);


    function logout() {
        localStorage.clear()
        navigation("/login")
    }

    async function refresh() {
        var images = await getImageJsons()
        console.log("pre", images)
        for (var i=0; i<walletFilters.length; i++) {
            // console.log(walletFilters[i])
            images = images.filter(walletFilters[i])
            console.log(images)
        }
        setWalletImages(images)
    }

    function setNewWalletFilters(filters) {
        setWalletFilters(filters)
        closeFilters();
    };

    return (
        <div>
            <div className="ListButtonTab">
                <button onClick={refresh} className="ListButton">Refresh</button> 
                <button onClick={openFilters} className="ListButton">Filters</button> 
                <button onClick={logout} className="ListButton">Log Out</button>
            </div>
            <ImageList images={walletImages} setViewImage={setViewImage}></ImageList>
            <FilterModal 
                showFilters={showWalletFilters}
                setFilters={setNewWalletFilters}
                closeFilters={closeFilters}
            ></FilterModal>
        </div>
    )
}

