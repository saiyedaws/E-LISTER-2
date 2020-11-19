
//const WATERMARK_URL = 'https://i.imgur.com/g7AUaYP.png';

const WATERMARK_URL = 'https://centreforinquiry.ca/wp-content/uploads/2020/05/68353859-canadian-map-with-canada-flag.jpg';
//const WATERMARK_URL = 'https://cdn.shopify.com/s/files/1/2217/0475/products/flag-canadian-native-flag_800x.gif?v=1501001338';


const IMGUR_API_KEY = 'e0ca47584878aae';

// If it changed to 'true', script wouldn't change images
const TURN_OFF_IMGBB = false;

saveWaterMarkUrl();


function saveWaterMarkUrl()
{
    localStorage.setItem('waterMarkUrl', WATERMARK_URL);
}