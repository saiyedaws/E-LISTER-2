console.log("bg_img_upload start");

var imgHeight = 500;
var imgWidth = 500;


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  if (request.from === "ebay_draft" && request.type === "upload_multi_img") {
    console.log("background received : upload_multi_img");
    upload_multi_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  if (request.from === "ebay_draft" && request.type === "upload_normal_img") {
    upload_normal_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  if (request.from === "ebay_draft" && request.type === "upload_first_img") 
  {
    upload_first_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  return true; // return true to indicate you want to send a response asynchronously
});



 
async function upload_normal_image(payload) {
  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;

  var img = await create_normal_image(payload.imgUrl, imgWidth, imgHeight);

  await upload_image(img.src, payload.name, payload.ebayTab);
  return "uploaded_normal_image";
}

async function create_normal_image(imageSource, imgWidth, imgHeight) {
  var waterMarkUrl = localStorage.getItem("waterMarkUrl");

  var img = await urlToImage(imageSource);
  //img = await flipImage(img);
  img = await rotateImage(img, 0);
  img = await resizeImage(img, imgWidth, imgHeight);

  return img;
}

async function upload_multi_image(payload) {

  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;

  var img = await create_multi_image(
    payload.imgUrl.mainImage,
    payload.imgUrl.sideImage,
    payload.name,
    imgWidth,
    imgHeight,
    fontColor,
    fontType
  );


  console.log("uploading multiImage with payload",payload);
  return "uploaded_multi_image";
    };




async function upload_first_image(payload) {

  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;



  var img = await create_first_image(
    payload.imgUrl,
    payload.name,
    imgWidth,
    imgHeight
  );

  await upload_image(img.src, payload.name, payload.ebayTab);
  return "uploaded_first_image";
}

async function create_first_image(
  imageSource,
  imageTitle,
  imgWidth,
  imgHeight
) {
  var waterMarkUrl = localStorage.getItem("waterMarkUrl");

  var img = await urlToImage(imageSource);
  //img = await flipImage(img);
  //img = await rotateImage(img, 5);
  img = await resizeImage(img, imgWidth, imgHeight);

  var imgWatermark = await urlToImage(waterMarkUrl);
  imgWatermark = await resizeImage(
    imgWatermark,
    imgHeight * 0.4,
    imgWidth * 0.4
  );
  img = await addLogo(img, imgWatermark, 0.75);

  img = await addTextToImage(img, imageTitle);
  //img = await addLogo(img, imgWatermark, 0.75);

  return img;
}

async function upload_normal_image(payload) {
  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;

  var img = await create_normal_image(payload.imgUrl, imgWidth, imgHeight);

  await upload_image(img.src, payload.name, payload.ebayTab);
  return "uploaded_normal_image";
}

async function create_normal_image(imageSource, imgWidth, imgHeight) {
  var waterMarkUrl = localStorage.getItem("waterMarkUrl");

  var img = await urlToImage(imageSource);
  //img = await flipImage(img);
  img = await rotateImage(img, 0);
  img = await resizeImage(img, imgWidth, imgHeight);

  return img;
}

async function upload_multi_image(payload) {

  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;

  var img = await create_multi_image(
    payload.imgUrl.mainImage,
    payload.imgUrl.sideImage,
    payload.name,
    imgWidth,
    imgHeight,
    fontColor,
    fontType
  );


  console.log("uploading multiImage with payload",payload);
  await upload_image(img.src, payload.name, payload.ebayTab);
  return "uploaded_multi_image";
}

function upload_image(b64Image, imageTitle, ebayTab) 
{
  console.log("upload_image ebayTab: ",ebayTab );
  return new Promise((resolve, reject) => 
  {
    var imgName = imageTitle + ".jpg";

    chrome.tabs.sendMessage(
      ebayTab,
      {
        type: "ON_UPLOAD_BASE64_IMG",
        payload: {
          content: b64Image,
          name: imgName,
        },
      },
      function () {
        resolve();
      }
    );
  });
}

function get_ebay_tab_id() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("ebayTab", (response) => {
      resolve(response.ebayTab);
    });
  });
}

async function create_multi_image(
  imageSource,
  sideImageUrl,
  imageTitle,
  imgWidth,
  imgHeight,
  fontColor,
  fontType
) {
  console.log("\n");
  console.log("creating multi image");
  //console.log(imageSource);
  //console.log(sideImageUrl);
  //console.log(imageTitle);

  //var waterMarkUrl ="https://centreforinquiry.ca/wp-content/uploads/2020/05/68353859-canadian-map-with-canada-flag.jpg";

  var waterMarkUrl = localStorage.getItem("waterMarkUrl");


  console.log("Converting ImgSource to img...",imageSource);
  var img = await urlToImage(imageSource);
  console.log("Obtained Img");
 

  //img = await flipImage(img);
  //img = await rotateImage(img, 5);
  console.log("Resizing Img...");
  img = await resizeImage(img, imgWidth, imgHeight);
  console.log("Resized Img");


  console.log("converting watermark to Img...");
  var imgWatermark = await urlToImage(waterMarkUrl);
  console.log("converting watermark to Img");


  console.log("resizing watermark...");
  imgWatermark = await resizeImage(
    imgWatermark,
    imgHeight * 0.45,
    imgWidth * 0.45
  );
  console.log("resized watermark");


  console.log("adding watermark to img...");
  img = await addLogo(img, imgWatermark, 0.75);
  console.log("added watermark to img");

  console.log("converting sideImageUrl to Img...");
  var sideImg = await urlToImage(sideImageUrl);
  console.log("converted sideImageUrl to Img");

  console.log("adding box to sideImage...");
  sideImg = await addBoxToImage(sideImg);
  console.log("added box to sideImage");

  //sideImg = await flipImage(sideImg);
  //sideImg = await rotateImage(sideImg, 10);

  console.log("resizing sideImage...");
  sideImg = await resizeImage(sideImg, imgHeight * 0.45, imgWidth * 0.45);
  console.log("resized sideImage");

  console.log("adding sideImage to img...");
  img = await addSideImage(img, sideImg, 0.95);
  console.log("added sideImage to img");




  console.log("adding text to img...");
  img = await addTextToImage(img, imageTitle, fontColor, fontType);
  console.log("added text to img...");

  console.log("Created Multi Image");
  return img;
}



async function create_multi_image_test(
  imageSource,
  sideImageUrl,
  image_3,
  image_4,
  imageTitle,
  imgWidth,
  imgHeight,
  fontColor,
  fontType
) {
  console.log("\n");
  console.log("creating multi image");
  //console.log(imageSource);
  //console.log(sideImageUrl);
  //console.log(imageTitle);

  var waterMarkUrl ="https://centreforinquiry.ca/wp-content/uploads/2020/05/68353859-canadian-map-with-canada-flag.jpg";

  //var waterMarkUrl = localStorage.getItem("waterMarkUrl");


  console.log("Converting ImgSource to img...",imageSource);
  var img = await urlToImage(imageSource);
  console.log("Obtained Img");

  //sendPictureToContent(img.src);
 

  //img = await flipImage(img);
  //img = await rotateImage(img, 5);
  console.log("Resizing Img...");
  img = await resizeImage(img, imgWidth, imgHeight);
  console.log("Resized Img");


  console.log("converting watermark to Img...");
  var imgWatermark = await urlToImage(waterMarkUrl);
  console.log("converting watermark to Img");


  console.log("resizing watermark...");
  imgWatermark = await resizeImage(
    imgWatermark,
    imgHeight * 0.45,
    imgWidth * 0.45
  );
  console.log("resized watermark");


  console.log("adding watermark to img...");
  img = await addTopRightImage(img, imgWatermark, 0.75);
  console.log("added watermark to img");

  console.log("converting bottomLeftImageUrl to Img...");
  var bottomLeftImage = await urlToImage(sideImageUrl);
  console.log("converted bottomLeftImage to Img");

  console.log("adding box to bottomLeftImage...");
  bottomLeftImage = await addBoxToImage(bottomLeftImage);
  console.log("added box to bottomLeftImage");

  //sideImg = await flipImage(sideImg);
  //sideImg = await rotateImage(sideImg, 10);

  console.log("resizing bottomLeftImage...");
  bottomLeftImage = await resizeImage(bottomLeftImage, imgHeight * 0.45, imgWidth * 0.45);
  console.log("resized bottomLeftImage");

  console.log("adding bottomLeftImage to img...");
  img = await addBottomRightImage(img, bottomLeftImage, 0.95);
  console.log("added bottomLeftImage to img");


  console.log("converting image3 to img");
  var topLeftImg = await urlToImage(image_3);
  console.log("adding box to image3");
  topLeftImg = await addBoxToImage(topLeftImg);
  topLeftImg = await resizeImage(topLeftImg, imgHeight * 0.45, imgWidth * 0.45);
  img = await addTopLeftImage(img, topLeftImg, 0.95);

 // sendPictureToContent(img.src);


  var bottomLeftImage = await urlToImage(image_4);
  bottomLeftImage = await addBoxToImage(bottomLeftImage);
  bottomLeftImage = await resizeImage(bottomLeftImage, imgHeight * 0.45, imgWidth * 0.45);
  img = await addBottomLeftImage(img, bottomLeftImage, 0.95);

 // sendPictureToContent(img.src);




  img = await flipImage(img);
  //sendPictureToContent(img.src);

  img = await rotateImage(img, 6);
 // sendPictureToContent(img.src);


  img = await resizeImage(img, 500, 500);
 // img = await resizeImage(img, 1500, 1500);
  //sendPictureToContent(img.src);


 img = await changeOpacityFix(img, 0.85);
 //sendPictureToContent(img.src);

 console.log("adding text to img...");
 img = await addTextToImage(img, imageTitle, fontColor, fontType);
 console.log("added text to img...");
 //sendPictureToContent(img.src);

  console.log("Created Multi Image");

  console.log("imgB64",img.src);
  return img.src;
}


//Receive Message in Background with type (requestType)
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if (request.type === 'get_image_for_amazon_test'){

      console.log(`Received type:get_image_for_amazon_test from:${request.from}`);
      var payload = request.payload;

      //var fontType = "Ariel Unicode MS";
      //var fontColor = "black";

      console.log("request",request);

      
     
      create_multi_image_test(   
        payload.image_1,
        payload.image_2,
        payload.image_3,
        payload.image_4,
        payload.name,
        500,
        500,
        "black",
        "Ariel Unicode MS"
        ).then((imgB64) => {
        sendResponse({from:'background', type: 'responseType_to_amazon_image_test', imgB64: imgB64});
      });

    }

    return true; // return true to indicate you want to send a response asynchronously
  });


  function sendPictureToContent(imgB64)
  {
   
    //sending one-time message from background script to content script
    console.log(`Sending Message from:background with type:b64Img_for_div`);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {from: "background", type: "b64Img_for_div", imgB64:imgB64});
    });
    
    
  }