


function createTestGeoJson() {
    const offset = 5
    const lat = -67.13734//Math.floor(((Math.random() * 2) - 1) * (90 - offset - 1));
    const long = 45.13745//Math.floor(((Math.random() * 2) - 1) * (90 - offset - 1));
    const initial_point = [lat, long]
    console.log(initial_point)
    const coords = [
        initial_point,
        [lat + offset, long],
        [lat, long + offset],
        [lat + offset, long + offset],
        initial_point
    ]
    // const coords = [
    //     initial_point,
    //     [-80.75102, 43.08003],
    //     [-80.79761, 43.21973],
    //     [-80.98176, 43.36789],
    //     initial_point
    // ]
    // console.log(coords)
    const sats = ['senintel-8', 'landsat-7', 'landsat-6'];
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
        [-90.94416, 43.46633],
        [-90.08482, 45.30524],
        [-90.66002, 45.46022],
        [-70.30495, 45.91479],
        [-50.00014, 46.69317],
        [-50.23708, 47.44777],
        [-68.90478, 47.18479],
        [-68.2343, 47.35462],
        [-67.79035, 47.06624],
        [-67.79141, 45.70258],
        [-67.13734, 45.13745]]
    console.log(3, test_coords)
    console.log(4, coords)
    const testGeoJson = {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [coords]
        },
        'properties': {
            "name": "Red band over Columbia",
            "token": "keyVal",  // address of TokenManager
            'satellite': sats[Math.floor(Math.random() * (sats.length - 1))],
            'prop1': "yes",
            "prop2": "ye"
        }
    }
    return testGeoJson;
}


export default function getTestGeoJsons(size) {
    const test = []
    for (var i=0; i < size; i++) {
        test.push(createTestGeoJson())
    }
    return test;
}

