
function uploadImgToEbay(payload) 
{
	console.log("uploadImageBase64ToEbay");
	console.log(payload);

	var base64Img = payload.base64Img;

	var imgHeight = 1500;
	var imgWidth = 1500;

	

	chrome.storage.local.get("ebayTab", (res) => {
		if (payload.imgVariation === "first_image") {
			//uploadMainEditedBase64Image(payload.base64Img, payload.name, res.ebayTab);
			uploadEditedImage(payload.imgUrl, payload.name, res.ebayTab, imgWidth, imgHeight);
		}

    if (payload.imgVariation === "other_image") 
    {
			uploadNormalImage(payload.imgUrl, payload.name, res.ebayTab, imgWidth, imgHeight);
    }

    if (payload.imgVariation === "multi_image") 
    {
 
		var fontType = "Ariel Unicode MS";

		//var fontColor = "black";
		var fontColor = payload.color;
	  uploadMultiImage(payload.imgUrl.mainImage, payload.imgUrl.sideImage, payload.name, res.ebayTab, imgWidth, imgHeight, fontColor, fontType);
	  

    }
    


	});
}



async function uploadMultiImage(imageSource, sideImageUrl, imageTitle, ebayTab, imgWidth, imgHeight, fontColor, fontType  )
{



	console.log("starting multi image");
	//console.log(imageSource);
	//console.log(sideImageUrl);
	//console.log(imageTitle);


	var waterMarkUrl = 'https://centreforinquiry.ca/wp-content/uploads/2020/05/68353859-canadian-map-with-canada-flag.jpg';

	//var waterMarkUrl = localStorage.getItem("waterMarkUrl");

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
  //addImgToDom(sideImg.src); 

  sideImg = await addBoxToImage(sideImg);

  //addImgToDom(sideImg.src); 

  sideImg = await flipImage(sideImg);
  sideImg = await rotateImage(sideImg, 10);
  
  sideImg = await resizeImage(
		sideImg,
		imgHeight * 0.45,
		imgWidth * 0.45
  );
  
  //addImgToDom(sideImg.src); 
 // img = await addTextToImage(img, imageTitle);
  img = await addSideImage(img, sideImg, 0.95);
  img = await addTextToImage(img, imageTitle, fontColor, fontType);


  
  



//img = await addTextToImage(img, imageTitle);

//console.log("Multi Img: ");
//console.log(img.src);


upload(img.src, imageTitle, ebayTab);
  
 // addImgToDom(img.src); 

 return 'done';
}

function addBoxToImage(img){
	return new Promise(function (resolve, reject) 
	{
		let canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		//canvas.style = "border:20px solid black;";

		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);


		

		ctx.drawImage(img, 0, 0,canvas.width,canvas.height);



		ctx.strokeStyle = 'black';  // some color/style
		ctx.lineWidth = 30;         // thickness
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
    

  


		var imgFinal = new Image();

		imgFinal.onload = function () {
			resolve(imgFinal);
		};
		imgFinal.src = canvas.toDataURL();
	});
}

function addSideImage(img, sideImg, opacity) 
{
	return new Promise(function (resolve, reject) {
		let canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(img, 0, 0);

    ctx.globalAlpha = opacity;
    

//bigger denominator makes it go right
var x = canvas.width - sideImg.width - (canvas.width/50);
	
//bigger denominator makes it go down
var y = canvas.height - sideImg.height - (canvas.height/12);
	
	//var y = canvas.height - sideImg.height ;
    

    ctx.drawImage(sideImg, x, y);

	//drawing Border
	/*
    ctx.strokeStyle = 'black';  // some color/style
    ctx.lineWidth = 5;         // thickness
	ctx.strokeRect(x, y, sideImg.width-10, sideImg.height);
	*/

    //drawing Border
    



		var imgFinal = new Image();

		imgFinal.onload = function () {
			resolve(imgFinal);
		};
		imgFinal.src = canvas.toDataURL();
	});
}


async function uploadEditedImage(imageSource, imageTitle, ebayTab, imgWidth, imgHeight) {

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

	upload(img.src, imageTitle, ebayTab);

	//addImgToDom(img.src);
}



async function uploadNormalImage(imageSource, imageTitle, ebayTab, imgWidth, imgHeight) {

	var waterMarkUrl = localStorage.getItem("waterMarkUrl");

	var img = await urlToImage(imageSource);
	//img = await flipImage(img);
	img = await rotateImage(img, 0);
	img = await resizeImage(img, imgWidth, imgHeight);


	/*
	var imgWatermark = await urlToImage(waterMarkUrl);
	imgWatermark = await resizeImage(
		imgWatermark,
		imgHeight * 0.4,
		imgWidth * 0.4
	);
	img = await addLogo(img, imgWatermark, 0.3);
		*/


	upload(img.src, imageTitle, ebayTab);
}


function addImgToDom(imgSrc) 
{
	var DOM_img = document.createElement("img");
	DOM_img.src = imgSrc;
	var src = document.getElementsByTagName("html")[0];
	src.appendChild(DOM_img);
}


function upload(b64Image, imageTitle, ebayTab) 
{
	var imgName = imageTitle + ".jpg";

	chrome.tabs.sendMessage(ebayTab, 
	{
		type: "ON_UPLOAD_BASE64_IMG",
		payload: {
			content: b64Image,
			name: imgName,
		},
	});
}

function base64ToImage(imageSource) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.src = imageSource;
		img.crossOrigin = "anonymous";

		//resolve(img);

		img.onload = function () {
			resolve(img);
		};
	});
}


async function addTextToImage(img, text, fontColor, fontType)
{

	var totalLines = await getTotalLines(img, text,  fontColor, fontType);
	console.log("addTextToImage totalLines: "+totalLines);
	var img = await addTextToImageFunction(img, text, totalLines,  fontColor, fontType);

	return img;
}

function addTextToImageFunction(img, text, totalLines, fontColor, fontType) 
{


	return new Promise(function (resolve, reject) {
		var canvas = document.createElement("canvas");
		canvas.id = "myCanvas";

	
		var fontSize = (img.height / 10) * 0.45;
		var extraHeight = fontSize + fontSize/2;
		var x = 0;
		var y = fontSize;

		//var totalLines =1;
		////totalLines = await getTotalLines(img, text, x, y);
		//console.log("totalLines: "+ totalLines);

		canvas.width = img.width;
        canvas.height = img.height + extraHeight*totalLines;


		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		

		

		var maxWidth = canvas.width;
		var lineHeight = canvas.height * (70/1500);



		
  

		//var fontColor = "orange";
		//var fontType = "Comic Sans MS";

		ctx.fillStyle = fontColor;
		ctx.font = fontSize + "px "+fontType;






		wrapText(ctx, text, x, y, maxWidth, lineHeight);

		ctx.drawImage(img, 0, extraHeight*totalLines);

		let img2 = new Image();
		img2.crossOrigin = "anonymous";
		img2.src = canvas.toDataURL();

		img2.onload = function () {
			resolve(img2);
		};
	});
}

//
function getTotalLines(img, text, fontColor, fontType)
{

	return new Promise(resolve =>
		{
			var canvas = document.createElement("canvas");
			canvas.id = "myCanvas";

			var fontSize = (img.height / 10) * 0.45;
		var extraHeight = fontSize + fontSize/2;
		var x = 0;
		var y = fontSize;

	
		canvas.width = img.width;
        //canvas.height = img.height + extraHeight;
        canvas.height = img.height;
	
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);


	
		var maxWidth = canvas.width;
		var lineHeight = canvas.height * (70/1500);

		ctx.fillStyle = fontColor;
		ctx.font = fontSize + "px "+fontType;

				//ctx.fillText(text, 0, fontSize);
			var totalLines =1;
			//console.log("totalLines: "+ totalLines);
				
				
	
		var words = text.split(' ');
		var line = '';
		
	
		for(var n = 0; n < words.length; n++) 
		{
		  var testLine = line + words[n] + ' ';
		  var metrics = ctx.measureText(testLine);
		  var testWidth = metrics.width;
		  if (testWidth > maxWidth && n > 0) 
		  {
			totalLines++;
			 
			ctx.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		  }
		  else 
		  {
			line = testLine;
			
		  }
		}
		
		
	
		resolve(totalLines);
	})

	

}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) 
{
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) 
	{
	  var testLine = line + words[n] + ' ';
	  var metrics = ctx.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
		ctx.fillText(line, x, y);
		line = words[n] + ' ';
		y += lineHeight;
	  }
	  else {
		line = testLine;
	  }
	}
	ctx.fillText(line, x, y);
  }

function flipImage(img) {
	return new Promise(function (resolve, reject) {
		var canvas = document.createElement("canvas");
		canvas.id = "myCanvas";

		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//Flip image
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);

		ctx.drawImage(img, 0, 0);

		let img2 = new Image();
		img2.crossOrigin = "anonymous";
		img2.src = canvas.toDataURL();

		img2.onload = function () {
			resolve(img2);
		};

		//var src = document.getElementsByTagName("html")[0];
		//src.appendChild(canvas);
		//console.log(img2.src);
	});
}

function resizeImage(img, x, y) {
	return new Promise(function (resolve, reject) {
		var canvas = document.createElement("canvas");
		canvas.id = "myCanvas";

		canvas.width = x;
		canvas.height = y;
		canvas.style = "border:2px solid black;";

		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//Center is to place image in middle
		var centerX = x / 2;
		var centerY = y / 2;

		var ratio = 1;

		if (img.width > img.height) {
			ratio = x / img.width;
		}

		if (img.width < img.height) {
			ratio = x / img.height;
		}

		if (img.width === img.height) {
			ratio = x / img.height;
		}

		var newWidth = img.width * ratio;
		var newHeight = img.height * ratio;

		//Transparency
		ctx.globalAlpha = 0.95;

		//Rotate
		//ctx.rotate((1 * Math.PI) / 180);

		ctx.drawImage(
			img,
			centerX - newWidth / 2,
			centerY - newHeight / 2,
			newWidth,
			newHeight
		);

		let img2 = new Image();
		img2.crossOrigin = "anonymous";
		img2.src = canvas.toDataURL();

		img2.onload = function () {
			resolve(img2);
		};

		//var src = document.getElementsByTagName("html")[0];
		//src.appendChild(canvas);
		//console.log(img2.src);
	});
}

function urlToImage(imageUrl) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + imageUrl, true);
		xhr.responseType = "arraybuffer";
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
		xhr.onload = function (e) {
			if (this.status === 200) {
				var uInt8Array = new Uint8Array(this.response);

				var blob = new Blob([uInt8Array], { type: "image/jpeg" });

				var reader = new FileReader();

				reader.onloadend = function () {
					let img = new Image();

					img.onload = function (e) {
						resolve(img);
					};

					let base64data = this.result;

					img.src = base64data;
				};

				reader.readAsDataURL(blob);

				let imageUrl = URL.createObjectURL(blob);
			}
		};
		xhr.send();
	});
}

function addLogo(img, imgWatermark, opacity) 
{
	return new Promise(function (resolve, reject) {
		let canvas = document.createElement("canvas");
		canvas.width = img.width + imgWatermark.width;
		canvas.height = img.height;

		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(img, 0, 0);

		ctx.globalAlpha = opacity;

		var imgWaterMarkWidth = imgWatermark.width *0.9;
		var imgWaterMarkHeight = imgWatermark.height *0.9;

		ctx.drawImage(imgWatermark, canvas.width - imgWaterMarkWidth,  0, imgWaterMarkWidth ,imgWaterMarkHeight);

	//	ctx.drawImage(imgWatermark, canvas.width - imgWatermark.width, 0-(canvas.height/10.75), imgWatermark.width ,imgWatermark.height);
		
	

		//ctx.drawImage(imgWatermark, canvas.width - imgWaterMarkWidth,  0, imgWaterMarkWidth ,imgWaterMarkHeight);


		var imgFinal = new Image();

		imgFinal.onload = function () {
			resolve(imgFinal);
		};
		imgFinal.src = canvas.toDataURL();
	});
}

function rotateImage(img, angle) {
	return new Promise(function (resolve, reject) {
		var canvas = document.createElement("canvas");

		var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var rads = (angle * Math.PI) / 180;
		var cos = Math.cos(rads);
		var sin = Math.sin(rads);
		if (sin < 0) {
			sin = -sin;
		}
		if (cos < 0) {
			cos = -cos;
		}

		canvas.width = img.height * sin + img.width * cos;
		canvas.height = img.height * cos + img.width * sin;

		var imgWidth = img.width;
		var imgHeight = img.height;

		// calculate the centerpoint of the canvas
		var cx = canvas.width / 2;
		var cy = canvas.height / 2;

		// draw the rect in the center of the newly sized canvas
		// ctx.clearRect(0,0,canvas.width,canvas.height);
		//  ctx.fillStyle="rgba(216,216,150,1.0)";

		var deg2Rad = Math.PI / 180;

		ctx.translate(cx, cy);
		ctx.rotate(angle * deg2Rad);

		ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

		var imgFinal = new Image();

		imgFinal.onload = function () {
			resolve(imgFinal);
		};
		imgFinal.src = canvas.toDataURL();
	});
}
