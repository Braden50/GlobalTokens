export async function getImageJsons() {
    const get_images_endpont = "https://f4fxjrn3rf.execute-api.us-west-2.amazonaws.com/getImages"
    const images = await fetch(get_images_endpont).then(response => response.json())
    return images

}


export function getPublicKey() {
    const currentImage = localStorage.getItem('image');
}