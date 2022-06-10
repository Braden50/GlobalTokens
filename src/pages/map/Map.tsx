import { useEffect, useState, useMemo, createRef, useRef } from "react";

// import * as mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl'
import {
  useNavigate
} from "react-router-dom";
//import { ArrowLeft, Star } from "react-feather";
//import { motion, AnimatePresence } from "framer-motion";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider, WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { createTheme, ThemeProvider } from "@material-ui/core";

import { useAnchorWallet } from "@solana/wallet-adapter-react";

import "./Map.scss";

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/TabPane';

// import 'mapbox-gl/dist/mapbox-gl.css';

import MarketTab from "../../components/MarketTab/MarketTab";
import WalletTab from "../../components/WalletTab/WalletTab";

import getTestGeoJsons from "../../utils/getTestGeoJsons";



const network = "devnet" as WalletAdapterNetwork;
mapboxgl.accessToken = "pk.eyJ1Ijoid2FpZGhvZmVyaiIsImEiOiJja2wwMGNtOHQyMTFqMndqdW9zZ2V3eDB3In0.Ptj-ozNnxV_X6mx5J4DIBA";

const mapStyles = {
  height: "100%",
  width: "100%",
  order: 0,
};


const polgyonFillPaint = {
  'fill-color': "#264653",
  'fill-opacity': 0.5
}



export default function Map() {

  const navigate = useNavigate();
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null)
  const [mapLocation, setMapLocation] = useState([-67.13734, 45.13745])  // SLO -> [-120.666132, 35.311089]);
  //const [userLocation, setUserLocation] = useState(null);
  const [zoom, setZoom] = useState([11]);
  const [displayedImage, setDisplayedImage] = useState()
  const [mapBounds, setMapBounds] = useState()


  var geohash = require('ngeohash');

  const wrapSourceImage = (image: any) => {
    return {
      "type": "geojson",
      "data": image
    }
  }


  const loadInitialDisplayedImage = () => {
    map.current!.addSource('displayed', wrapSourceImage(displayedImage))
      
    map.current!.addLayer({
      'id': 'displayed',
      'type': 'fill',
      'source': 'displayed', // reference the data source
      'layout': {},
      'paint': polgyonFillPaint
      });
      // Add a black outline around the polygon.
    map.current!.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'displayed',
      'layout': {},
      'paint': {
      'line-color': '#000',
      'line-width': 3
      }
      });
  }



  useEffect(() => {
    if (map.current) {
      try {
        // console.log("changing map", displayedImage)
        map.current.getSource('displayed').setData(displayedImage);
      } catch {
        loadInitialDisplayedImage()
      }
      map.current.triggerRepaint()
    }
    // console.log("New image", displayedImage)
  }, [displayedImage])


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: new mapboxgl.LngLat(mapLocation[0], mapLocation[1]),
      zoom: zoom[0]
    });
    map.current.on('render', () => {
      setMapBounds(map.current.getBounds().toArray());
    });

    // map.current.on('load', updateImageSource)
  });


  const getCoordGeoHash = (coord: [number, number]) => {
    const hash = geohash.encode(coord[0], coord[1], 8)
    console.log(coord, hash)
    return hash
  }

  const getGeoCoords = (imgJson: any) => {
    if (imgJson.features) {
      return imgJson.features[0].geometry.coordinates[0]
    }
    else {
      console.log("Wrong format")
      return imgJson.geometry.coordinates[0]
    }
  }

  const getAverageCoord = (imgJson: any) => {
    // console.log("HERE", imgJson)
    const coordinates = getGeoCoords(imgJson)
    return coordinates.reduce(
      (sums: any, coord: any) => [sums[0] + coord[0], sums[1] + coord[1]],
      [0, 0]).map((sum: any) => sum / coordinates.length)
  }

  const getImgBounds = (imgJson: any) => {
    const coordinates = getGeoCoords(imgJson)
    var xmin = 90;
    var xmax = -90;
    var ymin = 180;
    var ymax = -180;
    for (const coord of coordinates) {
      xmin = ((coord[0] < xmin) ? coord[0] : xmin)
      xmax = ((coord[0] > xmax) ? coord[0] : xmax)
      ymin = ((coord[1] < ymin) ? coord[1] : ymin)
      ymax = ((coord[1] > ymax) ? coord[1] : ymax)
      // console.log(coord)
    }
    // console.log(xmin, xmax, ymin, ymax)
    return new mapboxgl.LngLatBounds(
      new mapboxgl.LngLat(xmin, ymin),
      new mapboxgl.LngLat(xmax, ymax)
    );
  }


  const getImageGeoHash = (imgJson: any) => {
    const coords = getGeoCoords(imgJson)
    const hashes = coords.map(getCoordGeoHash)

    console.log(coords, hashes)
  }
  // getImageGeoHash(testGeoJson)


  const updateMapImage = (imgJson: any) => {
    // const avgCoord = getAverageCoord(imgJson);
    setDisplayedImage(imgJson);
    map.current.fitBounds(getImgBounds(imgJson), {padding: 10})
    map.current.triggerRepaint()
  }

  
  const theme = createTheme({
    palette: {
        type: 'dark',
    },
    overrides: {
        MuiButtonBase: {
            root: {
                justifyContent: 'flex-start',
            },
        },
        MuiButton: {
            root: {
                textTransform: undefined,
                padding: '12px 16px',
            },
            startIcon: {
                marginRight: 8,
            },
            endIcon: {
                marginLeft: 8,
            },
        },
    },
  });

const endpoint = useMemo(() => clusterApiUrl(network), []);

const wallets = useMemo(
  () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network })
  ],
  []
);

return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletDialogProvider>
            <div className="MapPage">
              {/* <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css" rel="stylesheet" /> */}
              {/* <article className="Map"> */}
              <div ref={mapContainer} className="Map" />
              <div className="TabBar">
                <h1 className="CatalogTitle">GlobalTokens</h1>
                <WalletDialogButton></WalletDialogButton>
                {/* </div> */}
                <div className="list-wrapper">
                  <Tabs defaultActiveKey="market" id="image-tabbar" className="CatalogTabBar">
                    <Tab eventKey="market" title="Market">
                      <div className="list-wrapper-inner"> 
                        <MarketTab setViewImage={updateMapImage} mapBounds={mapBounds}/>
                      </div>
                    </Tab>
                    <Tab eventKey="wallet" title="Wallet">
                      <div className="list-wrapper-inner">
                        <WalletTab setViewImage={updateMapImage}/>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
                
                
              </div>
            </div>
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
);
};

  // return (
    
  //   <div className="MapPage">
  //     <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css" rel="stylesheet" />
  //     {/* <article className="Map"> */}
  //     <div ref={mapContainer} className="Map" />
  //     <article className="TabBar">
  //       <div className="CatalogTitle">
  //         <h1>GlobalTokens</h1>
  //       </div>
  //       <div className="list-wrapper">
  //         <Tabs defaultActiveKey="market" id="image-tabbar" className="CatalogTabBar">
  //           <Tab eventKey="market" title="Market">
  //             <div className="list-wrapper-inner"> 
  //               <MarketTab setViewImage={updateMapImage} mapBounds={mapBounds}/>
  //             </div>
  //           </Tab>
  //           <Tab eventKey="wallet" title="Wallet">
  //             <div className="list-wrapper-inner">
  //               <WalletTab setViewImage={updateMapImage}/>
  //             </div>
  //           </Tab>
  //         </Tabs>
  //       </div>
        
        
  //     </article>
  //   </div>
  // );
// }

// /**
//  * Gets the distance in miles between two [lon, lat] points
//  * @param {number[]} p1
//  * @param {number[]} p2
//  * @returns distance
//  */
// function getGeoDistance(point1, point2) {
//   let p1 = [...point1];
//   let p2 = [...point2];
//   if (p1[0] === p2[0] && p1[1] === p2[1]) {
//     return 0;
//   } else {
//     p1[1] = (Math.PI * p1[1]) / 180;
//     p2[1] = (Math.PI * p2[1]) / 180;
//     let theta = (Math.PI * (p1[0] - p2[0])) / 180;
//     var dist =
//       Math.sin(p1[1]) * Math.sin(p2[1]) +
//       Math.cos(p1[1]) * Math.cos(p2[1]) * Math.cos(theta);
//     if (dist > 1) {
//       dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515;
//     return Math.round(dist * 100) / 100;
//   }
// }
