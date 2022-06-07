import { useEffect, useState } from "react";

import {
  useRouteMatch,
  useNaviate,
  useParams,
  useNavigate,
} from "react-router-dom";
//import { ArrowLeft, Star } from "react-feather";
//import { motion, AnimatePresence } from "framer-motion";
import { GeolocateControl } from "mapbox-gl";
import ReactMapboxGl, { ScaleControl, GeoJSONLayer, Cluster, Marker, Source, Layer, Feature } from "react-mapbox-gl";
import "./Map.scss";

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/TabPane';

// import 'mapbox-gl/dist/mapbox-gl.css';

import MarketTab from "../../components/MarketTab/MarketTab";
import WalletTab from "../../components/WalletTab/WalletTab";

import getTestGeoJsons from "../../assets/getTestGeoJsons";

import { geohash } from "ngeohash";

// console.log(geohash.encode(37.8324, 112.5584));
/*
var geohash = require('ngeohash');
console.log(geohash.encode(37.8324, 112.5584));
// prints ww8p1r4t8
var latlon = geohash.decode('ww8p1r4t8');
console.log(latlon.latitude);
console.log(latlon.longitude);
*/




const testGeoJson = 
{
  'type': 'FeatureCollection',
  'features': [
    {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [[
        [-67.13734, 45.13745],
        [-66.96466, 44.8097],
        [-68.03252, 44.3252],
        [-69.06, 43.98],
        [-70.11617, 43.68405],
        [-70.64573, 43.09008],
        [-70.75102, 43.08003],
        [-70.79761, 43.21973],
        [-70.98176, 43.36789],
        [-70.94416, 43.46633],
        [-71.08482, 45.30524],
        [-70.66002, 45.46022],
        [-70.30495, 45.91479],
        [-70.00014, 46.69317],
        [-69.23708, 47.44777],
        [-68.90478, 47.18479],
        [-68.2343, 47.35462],
        [-67.79035, 47.06624],
        [-67.79141, 45.70258],
        [-67.13734, 45.13745]]]
    }
  }
]
}

// testGeoJson = getTestGeoJsons(1)[0];

const test_coords = [
  [-67.13734, 45.13745],
  [-66.96466, 44.8097],
  [-68.03252, 44.3252],
  [-69.06, 43.98],
  [-70.11617, 43.68405],
  [-70.64573, 43.09008],
  [-70.75102, 43.08003],
  [-70.79761, 43.21973],
  [-70.98176, 43.36789],
  [-70.94416, 43.46633],
  [-71.08482, 45.30524],
  [-70.66002, 45.46022],
  [-70.30495, 45.91479],
  [-70.00014, 46.69317],
  [-69.23708, 47.44777],
  [-68.90478, 47.18479],
  [-68.2343, 47.35462],
  [-67.79035, 47.06624],
  [-67.79141, 45.70258],
  [-67.13734, 45.13745]]

  



const Mapbox = ReactMapboxGl({
  accessToken:
    "pk.eyJ1Ijoid2FpZGhvZmVyaiIsImEiOiJja2wwMGNtOHQyMTFqMndqdW9zZ2V3eDB3In0.Ptj-ozNnxV_X6mx5J4DIBA",
});


const mapStyles = {
  // width: "70%",
  height: "100%",
  // position: "relative",
  // top: 0,
  order: 0,
};


const polgyonFillPaint = {
  'fill-color': "#264653",
  'fill-opacity': 0.5
}



export default function Map() {
  const navigate = useNavigate();

  const [mapLocation, setMapLocation] = useState([-67.13734, 45.13745])  // SLO -> [-120.666132, 35.311089]);
  //const [userLocation, setUserLocation] = useState(null);
  const [zoom, setZoom] = useState([11]);
  const [displayedImage, setDisplayedImage] = useState()

  // const lat = 35.296017;
  // const long = -120.676579;


  var geohash = require('ngeohash');
  // console.log(geohash.encode(37.8324, 112.5584));
  // // prints ww8p1r4t8
  // var latlon = geohash.decode('ww8p1r4t8');


  const getAverageCoord = (imgJson) => {
    // console.log("HERE", imgJson)
    const coordinates = imgJson.geometry.coordinates[0];
    return coordinates.reduce(
      (sums, coord) => [sums[0] + coord[0], sums[1] + coord[1]],
      [0, 0]).map((sum) => sum / coordinates.length)
  }


  const getImageGeoHash = (imgJson) => {
    const hashes = imgJson.geometry.coordinates.map(geohash.encode)
    console.log(hashes)
  }

  // NOTE: imgJson is a feature whereas displayedImage is a featurecollection
  const updateMapImage = (imgJson) => {
    // if (!displayedImage) {
    //   console.log("NO")
    // }
    const formattedImgJson = {
      'type': 'FeatureCollection',
      'features': [imgJson]
    }
    console.log("Updating map...", formattedImgJson)
    setDisplayedImage(formattedImgJson);
    const avgCoord = getAverageCoord(imgJson);
    console.log("Avg",avgCoord);
    setMapLocation(avgCoord)
    // if (displayedImage) {
    //   console.log(displayedImage)
    // }
  }






  /**
   * Called when map has initialized. Used for instantiating plugins and controls.
   * @param {*} map mapbox instance
   */
  function onMapLoad(map) {
    const geoControl = new GeolocateControl({ trackUserLocation: true });
    // if (lat && long) {
    //   setMapLocation([lat, long])
    // }
    map.addControl(geoControl);
    geoControl.on("geolocate", (e) => {
      setMapLocation([e.coords.longitude, e.coords.latitude]);
    });
  }

  /**
   * Called to highlight image geometry on map
   */

  if (displayedImage) {
    console.log(1, displayedImage)
    console.log(2, testGeoJson)
  }
  return (
    
    <div className="MapPage">
      <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css" rel="stylesheet" />
      <article className="Map">
        <Mapbox
          // eslint-disable-next-line
          style="mapbox://styles/mapbox/light-v10"
          containerStyle={mapStyles}
          center={mapLocation}
          zoom={zoom}
          // onStyleLoad={onMapLoad}
          renderChildrenInPortal={true}
        >
          {/* { displayedImage &&
          <Layer
            type="fill"
            paint={{
              "fill-color": "#0091cd",
              "fill-opacity": 0.2,
            }}
          >
            <Feature
              coordinates={displayedImage.features[0].geometry.coordinates[0]}
            />
          </Layer>
          } */}
          {/* <Layer
            type="fill"
            paint={{
              "fill-color": "#0091cd",
              "fill-opacity": 0.2,
            }}
          >
            <Feature
              coordinates={test_coords}
            />
          </Layer> */}
          { displayedImage &&
          <GeoJSONLayer 
            key="2"
            data={testGeoJson}
            fillPaint={polgyonFillPaint}
          />
          }
          { displayedImage  &&
          <GeoJSONLayer 
            key="1" 
            data={displayedImage} 
            fillPaint={polgyonFillPaint}
          />
          } 
          <ScaleControl measurement="mi" position="bottom-left"/>
          {/* { if (displayedImage) {return (
            <Source id='highlighted' type="geojson" data={displayedImage}></Source>)}} */}
        </Mapbox>
      </article>
      <article className="TabBar">
        <div className="CatalogTitle">
          <h1>Catalog</h1>
        </div>
        
        
        <div className="list-wrapper">
          <Tabs defaultActiveKey="market" id="image-tabbar" className="CatalogTabBar">
            <Tab eventKey="market" title="Market">
              <div className="list-wrapper-inner"> 
                <MarketTab setImage={updateMapImage}/>
              </div>
            </Tab>
            <Tab eventKey="wallet" title="Wallet">
              <div className="list-wrapper-inner">
                <WalletTab setImage={updateMapImage}/>
              </div>
            </Tab>
          </Tabs>
        </div>
        
        
      </article>
    </div>
    
    
  );
}

/**
 * Gets the distance in miles between two [lon, lat] points
 * @param {number[]} p1
 * @param {number[]} p2
 * @returns distance
 */
function getGeoDistance(point1, point2) {
  let p1 = [...point1];
  let p2 = [...point2];
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    return 0;
  } else {
    p1[1] = (Math.PI * p1[1]) / 180;
    p2[1] = (Math.PI * p2[1]) / 180;
    let theta = (Math.PI * (p1[0] - p2[0])) / 180;
    var dist =
      Math.sin(p1[1]) * Math.sin(p2[1]) +
      Math.cos(p1[1]) * Math.cos(p2[1]) * Math.cos(theta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return Math.round(dist * 100) / 100;
  }
}
