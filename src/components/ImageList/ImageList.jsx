import "./ImageList.css"

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import { useState } from "react";


// const testGeoJson = {
//     'type': 'Feature',
//     'geometry': {
//     'type': 'Polygon',
//     'coordinates': [
//         [-67.13734, 45.13745],
//         [-66.96466, 44.8097],
//         [-68.03252, 44.3252],
//         [-69.06, 43.98],
//         [-70.11617, 43.68405],
//         [-70.64573, 43.09008],
//         [-70.75102, 43.08003],
//         [-70.79761, 43.21973],
//         [-70.98176, 43.36789],
//         [-70.94416, 43.46633],
//         [-71.08482, 45.30524],
//         [-70.66002, 45.46022],
//         [-70.30495, 45.91479],
//         [-70.00014, 46.69317],
//         [-69.23708, 47.44777],
//         [-68.90478, 47.18479],
//         [-68.2343, 47.35462],
//         [-67.79035, 47.06624],
//         [-67.79141, 45.70258],
//         [-67.13734, 45.13745]]
//     }
// }


// const geoJsonTest2 = {
//     "type": "Feature",
//     "geometry": {
//       "type": "Polygon",
//       "coordinates": [
//         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
//       ]
//     },
//     "properties": {
//       "prop0": "value0",
//       "prop1": 0.0
//     }
// }



function ImageBar(props) {
    const { image, index, setImage } = props
    const [showImage, setShowImage] = useState(false)

    function setImageToDisplay() {
        try {
            setImage(image)
        } catch (err) {
            console.log(err)
        }
        
    }

    
    return (
        <Accordion.Item eventKey={index}>
            <Accordion.Header>{image.properties.name}</Accordion.Header>
            <Accordion.Body>
                <button onClick={setImageToDisplay} className="ListButton align-but-right">Show On Map</button>
            </Accordion.Body>
        </Accordion.Item>
    )
}


{/* <Accordion.Collapse eventKey="0">
<Card.Body>Hello! I'm the body</Card.Body>
</Accordion.Collapse> */}

export default function ImageList(props) {  
    
    const { images, setImage } = props       // list of image json objects
    const imgList = Object.assign(images)
    return (
        <div className="scrollbar">
            <Accordion> 
                { imgList.length ? (
                    imgList.map((image, i) => <ImageBar image={image} key={i} index={i} setImage={setImage}/>)
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
