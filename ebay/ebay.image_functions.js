var imgCounter = 0;
var imgCheckMarks = "";

function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement("CANVAS");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || "image/png");
    callback.call(this, dataURL);
    // Clean up
    canvas = null;
  };
  img.src = url;
}

async function uploadImages(product) {
  //var imgUrls = product.main_sd_images;
  var sdImgs = product.main_sd_images;
  var hdImgs = product.main_hd_images;
  var color = product.extra.color;

  var imgUrls = [];
  imgUrls = hdImgs;

  if (imgUrls.length < 1) {
    imgUrls = sdImgs;
  }

  if (imgUrls.length < 12) {
    var totalImagesToAdd = 12 - imgUrls.length;

    for (var index = 0; index < sdImgs.length; index++) {
      var sdImg = sdImgs[index];

      if (index < totalImagesToAdd && totalImagesToAdd > 0) {
        imgUrls.push(sdImg);
      }
    }
  }

  if (imgUrls.length === 1) {
    imgUrls.push(imgUrls[0]);
  }

  var imgName = product.custom_title;
  //var imgName = product.filteredTitle;
  console.log(
    "\n\n\n-------------------------[Starting image Post]-----------------------\n\n\n"
  );

  imgName = insensitiveReplaceAll(imgName, product.brand, "");
  imgName = insensitiveReplaceAll(imgName, "amazon", "");


  uploadImageCounter();
  initializeImageCounter(imgUrls.length);


  

  await uploadMultiImage(imgName,imgUrls,color);
  await uploadFirstImage(imgName,imgUrls[0]);



  for (var i = 0; i < imgUrls.length; i++) 
  {
	  var imgUrl = imgUrls[i];
	  console.log(`#${i} Uploading Image: ${imgUrl}`);

	  if(i < 10)
	  {
		await uploadNormalImage(imgName,imgUrl);
	  }

	  
  }



  updateLoaderMessage();


  console.log(
    "\n\n\n-------------------------[Ending image Post]-----------------------\n\n\n"
  );
}

function uploadFirstImage(imgName,imgUrl){
	updateImageCounter();
	turnOnLoader();

	return new Promise((resolve, reject) => 
	{
		




		chrome.runtime.sendMessage(
			{
			  from: "ebay_draft",
			  type: "upload_first_img",
			  payload: {
				name: imgName,
				imgUrl: imgUrl,
				imgVariation: "first_image",
			  },
			},
			function (response) 
			{
			  console.log("response",response);

			  
			  updateImgCheckMark();

			  turnOffLoader();
			  resolve(response);
			  
			}
		  );

	});
}

function uploadNormalImage(imgName,imgUrl){

	updateImageCounter();
	turnOnLoader();

	return new Promise((resolve, reject) => {
		


		chrome.runtime.sendMessage(
			{
			  from: "ebay_draft",
			  type: "upload_normal_img",
			  payload: {
				name: imgName,
				imgUrl: imgUrl,
				imgVariation: "other_image",
			  },
			},
			function (response) 
			{
			  console.log("response",response);

			  
			  updateImgCheckMark();

			  turnOffLoader();
			  resolve(response);
			  
			}
		  );




	});
}


function uploadMultiImage(imgName,imgUrls,color) 
{
	updateImageCounter();
	turnOnLoader();

	return new Promise((resolve, reject) => 
	{
		chrome.runtime.sendMessage(
			{
			  from: "ebay_draft",
			  type: "upload_multi_img",
			  payload: {
				name: imgName,
				imgUrl: {
				  mainImage: imgUrls[0],
				  sideImage: imgUrls[1],
				},
				color: color,
				imgVariation: "multi_image",
			  },
			},
			function (response) 
			{
			  console.log("response",response);

			  
			  updateImgCheckMark();

			  turnOffLoader();
			  resolve(response);
			  
			}
		  );
	});

 
	
}

function turnOnLoader(){
	document.getElementById('loader').style.display = "block";
}

function turnOffLoader(){
	document.getElementById('loader').style.display = "none";
}

function updateImageCounter()
{
	imgCounter = imgCounter + 1;
	document.getElementById("my-upload-count").innerText = imgCounter;
}
function updateImgCheckMark()
{
	
	imgCheckMarks = imgCheckMarks + "✅";
	document.getElementById("image-started").innerText = imgCheckMarks;
}

function initializeImageCounter(uploadedImgCount) 
{

	uploadedImgCount = uploadedImgCount + 2;
	if(uploadedImgCount >12)
	{
		uploadedImgCount = 12;
	}


  document.getElementById("total-upload-images").innerHTML = uploadedImgCount;
}

function uploadImageCounter() {
  var upload_counter = document.getElementById("editpaneSect_VIN");

  var upload_image_count = document.createElement("div");
  upload_image_count.innerHTML =
    "<span id='image_loader_message'>Please be Patient... Uploading Image  </span>  -  <span id='my-upload-count'>0</span>/<span id='total-upload-images'>0</span><br><span id='image-started'></span>";

  upload_image_count.id = "lister_image_upload";
  upload_image_count.style.border = "thick solid rgb(172, 235, 100)";
  upload_image_count.style.fontStyle = "italic";

  var loader = document.createElement("div");
  loader.id = "loader";
  loader.style.border = "6px solid #f3f3f3"; /* Light grey */
  loader.style.borderTop = "6px solid #3498db"; /* Blue */
  loader.style.borderRadius = "50%";
  loader.style.width = "12px";
  loader.style.height = "12px";
  loader.style.animation = "spin 2s linear infinite";
  loader.style.display = "block";

  upload_image_count.appendChild(loader);

  upload_counter.append(upload_image_count);
}

function updateLoaderMessage(){
	var message = "Completed";
	var image_loader_message =  document.getElementById("image_loader_message");
	image_loader_message.innerText = message;

}