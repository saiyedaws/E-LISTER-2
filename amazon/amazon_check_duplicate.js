


if (window.location.href.indexOf("/dp/") > -1) {
	
    chrome.storage.local.get("skuList", (res) => 
    {
    
        var skuList = res.skuList;
    
        //console.log(skuList);
    
        var asin = getAsin();
        var sku = btoa(asin);
    
        //console.log("skusku: "+sku + "skuList.length; "+skuList.length);
    
        var isItemDuplicate = false;
    
    
    
    
        for (var index = 0; index < skuList.length; index++) 
        {
           // console.log(index);
            
            
            var skuListItem = skuList[index];
    
            //console.log("skuListItem: "+skuListItem);
          
            if( skuListItem.indexOf(sku) >= 0)
            {
                // Found world
                isItemDuplicate = true;
    
              //  console.log("skuListItem: "+skuListItem);
               // console.log("sku: "+sku);
    
               // console.log("This is a duplicate item!");
               break;
    
                
            }else
            {
               // console.log("NOT DD!");
               // console.log("skuListItem: "+skuListItem);
                //console.log("sku: "+sku);
               // resolve(isItemDuplicate);
            }
            
        }
    
    
        addImgToDom(isItemDuplicate);
      
    
    
    });
    
  }
   


function addImgToDom(isItemDuplicate) {
	return new Promise((resolve) => {
		if (isItemDuplicate) 
		{



			var duplicateUrl =
				"https://www.boltrics.nl/wp-content/uploads/2016/12/duplicate.png";

			var img = document.createElement("img");
			img.src = duplicateUrl;
			img.width = "140";
			img.height = "60";
			//img.title = veroBrandsMessage;

			var src = document.getElementById("productTitle");
			src.appendChild(img);
			resolve();
		} else {
			var safeUrl =
				"https://uploads.friendsresilience.org/wp-content/uploads/2017/01/23002444/Paula-Barrett-Thumbs-Up-Actions.jpg";

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