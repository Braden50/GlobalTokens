
// import Logout from "../../util/Logout"
import ImageList from "../ImageList/ImageList";

import "./WalletTab.css"

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import getTestGeoJsons from "../../assets/getTestGeoJsons";

// const testImageJson1 = {
//     'name': 'Test1',
//     'key': 'token1'
//   };
  
// const testImageJson2 = {
//     'name': 'Test2',
//     'key': 'token2'
// };

// const testImageJson3 = {
//     'name': 'Test3',
//     'key': 'token3'
// };

// const testImages = [testImageJson1, testImageJson2];

const testImages = [];
for (var i = 0; i < 15; i++) {
    testImages.push({
        'name': 'Test' + i,
        'key': 'token' + i
    })
}

  
export default function WalletTab(props) {
    const { setImage } = props;
    // console.log(setImage)
    const navigation = useNavigate()
    const [images, setImages] = useState([]);
    // console.log(images)
    // console.log(images.length)
    

    function logout() {
        localStorage.clear()
        navigation("/login")
    }

    function refresh() {
        setImages(getTestGeoJsons(2))
        // console.log(images)
    }

    return (
        <div>
            <div className="ListButtonTab">
                <button onClick={() => {refresh()}} className="ListButton">Refresh</button> 
                <button onClick={() => {logout()}} className="ListButton">Log Out</button>
            </div>
            <ImageList images={images} setImage={setImage}></ImageList>
        </div>
    )
}

