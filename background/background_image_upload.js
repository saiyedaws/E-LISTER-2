console.log("bg_img_upload start");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  if (request.from === "ebay_draft" && request.type === "upload_multi_img") {
    upload_multi_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  if (request.from === "ebay_draft" && request.type === "upload_normal_img") {
    upload_normal_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  if (request.from === "ebay_draft" && request.type === "upload_first_img") {
    upload_first_image(request.payload).then((message) => {
      sendResponse({ message: message });
    });
  }

  return true; // return true to indicate you want to send a response asynchronously
});

async function upload_first_image(payload) {
  var imgHeight = 1500;
  var imgWidth = 1500;
  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;
  var ebayTab = await get_ebay_tab_id();

  var img = await create_first_image(
    payload.imgUrl,
    payload.name,
    imgWidth,
    imgHeight
  );

  await upload_image(img.src, payload.name, ebayTab);
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
  var imgHeight = 1500;
  var imgWidth = 1500;
  var fontType = "Ariel Unicode MS";
  var fontColor = payload.color;

  var ebayTab = await get_ebay_tab_id();

  var img = await create_normal_image(payload.imgUrl, imgWidth, imgHeight);

  await upload_image(img.src, payload.name, ebayTab);
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
  var imgHeight = 1500;
  var imgWidth = 1500;
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

  var ebayTab = await get_ebay_tab_id();
  await upload_image(img.src, payload.name, ebayTab);
  return "uploaded_multi_image";
}

function upload_image(b64Image, imageTitle, ebayTab) 
{
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
  console.log("creating multi image");
  //console.log(imageSource);
  //console.log(sideImageUrl);
  //console.log(imageTitle);

  //var waterMarkUrl ="https://centreforinquiry.ca/wp-content/uploads/2020/05/68353859-canadian-map-with-canada-flag.jpg";

  var waterMarkUrl = localStorage.getItem("waterMarkUrl");

  var img = await urlToImage(imageSource);
  //img = await flipImage(img);
  //img = await rotateImage(img, 5);
  img = await resizeImage(img, imgWidth, imgHeight);

  var imgWatermark = await urlToImage(waterMarkUrl);
  imgWatermark = await resizeImage(
    imgWatermark,
    imgHeight * 0.45,
    imgWidth * 0.45
  );

  img = await addLogo(img, imgWatermark, 0.75);

  var sideImg = await urlToImage(sideImageUrl);

  sideImg = await addBoxToImage(sideImg);

  //sideImg = await flipImage(sideImg);
  //sideImg = await rotateImage(sideImg, 10);

  sideImg = await resizeImage(sideImg, imgHeight * 0.45, imgWidth * 0.45);

  img = await addSideImage(img, sideImg, 0.95);
  img = await addTextToImage(img, imageTitle, fontColor, fontType);

  console.log("Created Multi Image");
  return img;
}
