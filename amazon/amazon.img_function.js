function getHiRes1() 
{
	var hiResImgs = [];

	//var imgBlock = document.getElementById("imageBlock_feature_div");
   // var javascriptBlock = imgBlock.getElementsByTagName("script")[1];
    

    var javascriptBlock = document.getElementById("imageBlock").nextElementSibling;

	var jsFunction = javascriptBlock.innerText;

	jsFunction = jsFunction.replace(/[^]*(?=var data)/g, "");
	jsFunction = jsFunction.replace(
		"A.trigger('P.AboveTheFold'); // trigger ATF event.",
		""
	);
	jsFunction = jsFunction.replace(/(?<=return data;)[^]*/g, "");
	jsFunction = jsFunction.replace(/'airyConfig.*/g, "");

    

	var func = new Function(jsFunction);
    var data = func();
    


	var imageArray = data.colorImages.initial;

	for (var i = 0; i < imageArray.length; i++) {
		var hiResImg = imageArray[i].hiRes;
		//console.log(i + "#  hiResImg: " + hiResImg);
		//console.log(i + "#  type: " + typeof hiResImg);

		if (
			hiResImgs !== null &&
			hiResImgs !== "" &&
			hiResImgs !== "null" &&
			typeof hiResImg === "string"
		) {
            if(hiResImg){
                hiResImgs.push(hiResImg);
            }
		}
		//hiResImgs.push(hiResImg);
	}

	return hiResImgs;
}




function getHiRes2()
{
    var hiResImgs = [];

    var imgWrappers = document.querySelectorAll(".imgTagWrapper");
    
    for (let index = 0; index < imgWrappers.length; index++) 
    {
        var imgWrapper = imgWrappers[index];
        //console.log(imgWrapper);

        var img = imgWrapper.querySelectorAll("img")[0];

        if(img)
        {
            var hiResImg = img.getAttribute("data-old-hires");
          //  console.log(hiResImg);

            if(hiResImg){
                hiResImgs.push(hiResImg);
            }
           
        }
   
        
    }


    return hiResImgs;

}



function getHighResProductPictures()
{

    var hiResImgs = [];
    var hiResImgs2 = [];
    var hiResImgs1 = [];

   try {
    hiResImgs1 = getHiRes1();
   } catch (error) {
       
   }

   try {
    hiResImgs2 = getHiRes2();
   } catch (error) {
       
   }



    hiResImgs = hiResImgs1.concat(hiResImgs2); 

//remove duplicates
    hiResImgs = hiResImgs.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
 });



   return hiResImgs;
}


