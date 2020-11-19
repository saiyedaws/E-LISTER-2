//veroListNew
//veroListPersonal
//veroListOld

var amazonBrandToCheck = getProductBrand();
amazonBrandToCheck = amazonBrandToCheck.toLowerCase();
var veroBrandDetectedList = [];
var amazonTitle = getProductTitle();
amazonTitle = amazonTitle.toLowerCase();




if (window.location.href.indexOf("/dp/") > -1) {
	scanForVero();
  }





async function scanForVero() {
	await checkVeroBrandWithList(veroListOld);
	await checkVeroBrandWithList(veroListNew);
    await checkVeroBrandWithList(veroListPersonal);
    await checkVeroBrandWithList(veroListEbay);

   try {
    await isBrandVero();
   } catch (error) {
       
   }

}

function isBrandVero() {
	return new Promise((resolve) => {
		if (veroBrandDetectedList.length > 0) 
		{

			//console.log(veroBrandDetectedList);

			var veroBrandsMessage = "VeroBrands: \n\n"+veroBrandDetectedList.toString().replace(/,/g, "\n");



			var veroUrl =
				"https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Vero_Insurance_logo.svg/1280px-Vero_Insurance_logo.svg.png";

			var img = document.createElement("img");
			img.src = veroUrl;
			img.width = "140";
			img.height = "60";
			img.title = veroBrandsMessage;

			var src = document.getElementById("productTitle");
			src.appendChild(img);
			resolve();
		} else {
			var safeUrl =
				"https://cdn1.iconfinder.com/data/icons/color-bold-style/21/30-512.png";

			var img = document.createElement("img");
			img.src = safeUrl;
			img.width = "50";
			img.height = "30";

			var src = document.getElementById("productTitle");
			src.appendChild(img);
			resolve();
		}
	});
}

function checkVeroInAmazonTitle(veroBrand, veroFilterType)
{

	var amazonTitleWords = amazonTitle.split(" ");

	for (let index = 0; index < amazonTitleWords.length; index++) 
	{
		var amazonTitleWord = amazonTitleWords[index];

		if (amazonTitleWord === veroBrand) 
		{

			var message = "\nTitle Contains " + veroFilterType+" :\n"+ veroBrand;
			veroBrandDetectedList.push(message);
		}
		
	}


}

function checkVeroBrandWithList(list) 
{
	return new Promise((resolve) => {
		for (var index = 0; index < list.length; ++index) 
		{
			var veroBrand = list[index].toLowerCase();

			if (veroBrand.includes(amazonBrandToCheck)) 
			{

				veroBrandDetectedList.push("\nveroBrand: \n"+veroBrand);

			}


            if (amazonBrandToCheck.includes(veroBrand)) 
            {

				veroBrandDetectedList.push("\nveroBrand: \n"+veroBrand);

            }
			
			/*
			if (amazonTitle.includes(veroBrand)) 
			{

				veroBrandDetectedList.push("amazonTitle veroBrand: "+veroBrand);
			}
			*/

			checkVeroInAmazonTitle(veroBrand,"veroBrand");



			
          
            var veroBrandWithOutWhiteSpace = veroBrand.replace(/\s/g, "");
        
			if (veroBrandWithOutWhiteSpace.includes(amazonBrandToCheck)) 
			{

				veroBrandDetectedList.push("\nveroBrandWithOutWhiteSpace: \n"+veroBrandWithOutWhiteSpace);

			}


			if (amazonBrandToCheck.includes(veroBrandWithOutWhiteSpace)) 
			{

				veroBrandDetectedList.push("\nveroBrandWithOutWhiteSpace: \n"+veroBrandWithOutWhiteSpace);

			}

			/*
			if (amazonTitle.includes(veroBrandWithOutWhiteSpace)) 
			{

				veroBrandDetectedList.push("amazonTitle veroBrandWithOutWhiteSpace: "+veroBrandWithOutWhiteSpace);
			}
			*/

			checkVeroInAmazonTitle(veroBrandWithOutWhiteSpace,"veroBrandWithOutWhiteSpace");


			var veroBrandWithoutInc = veroBrand;
			veroBrandWithoutInc = veroBrandWithoutInc.replace(", inc","");
			var veroBrandWithoutInc = veroBrandWithoutInc.replace("inc","");
			var veroBrandWithoutInc = veroBrandWithoutInc.replace(",","");

			//remove all strange characters
			//
			
			/*
			if (amazonTitle.includes(veroBrandWithoutInc)) 
			{

				veroBrandDetectedList.push("amazonTitle veroBrandWithoutInc: "+veroBrandWithoutInc);
			}
			*/

			checkVeroInAmazonTitle(veroBrandWithoutInc,"veroBrandWithoutInc");

			if (veroBrandWithoutInc.includes(amazonBrandToCheck)) 
			{

				veroBrandDetectedList.push("\nveroBrandWithoutInc: \n"+veroBrandWithoutInc);

			}


			if (amazonBrandToCheck.includes(veroBrandWithoutInc)) 
			{

				veroBrandDetectedList.push("\nveroBrandWithoutInc: \n"+veroBrandWithoutInc);

			}



			resolve();
		}
	});
}



