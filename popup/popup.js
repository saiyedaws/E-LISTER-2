let _e = (ID) => document.getElementById(ID), // It is just a shortcut
	bg_port = chrome.runtime.connect({ name: "popup" }); // Establishment a connection with the background

try {
	updatePopupValueForAmazonItem();
} catch (error) {}

function updatePopupValueForAmazonItem() {
	console.log("POPUP");

	chrome.storage.local.get(["amazon"], (res) => 
	{
		console.log(res.amazon);
		//var customTitle = res.amazon.title;
		var customTitle = res.amazon.filteredTitle;

		_e("product_title").value = customTitle;

		var price = res.amazon.price * 1.15;
		_e("product_price").value = price.toFixed(2);
	});
}

try {
	updatePopupValueForActiveListScanner();
} catch (error) {
	console.log(error);
}

function updatePopupValueForActiveListScanner() 
{
	console.log("POPUP");

	chrome.storage.local.get("skuList", (res) => 
	{
		var skuList = res.skuList;

		var totalSKUs = skuList.length;

		if(skuList.length > 1)
		{
			_e("skuFound").innerText = "SkuFound: "+totalSKUs;
		}

	});
	
}


document.getElementById("main_form").addEventListener("submit", function(e) {
  e.preventDefault();

  bg_port.postMessage({ type: "start"});
});


// Listen form submission
_e("popup_form").addEventListener("submit", (e) => {
	// Actually it is not necessary, but keep it for future backward compatibility
	e.preventDefault();

	console.log("submit pressed");

	// Send a message to the background with new values
	bg_port.postMessage({
		from: "popup",
		type: "create_ebay_tab",
		title: _e("product_title").value,
		price: _e("product_price").value,
	});
});

const getActiveTab = () => {
	return new Promise((resolve, reject) => {
		chrome.tabs.query(
			{
				currentWindow: true,
				active: true,
			},
			(tabs) => {
				if (tabs.length > 0) {
					return resolve(tabs[0]);
				} else reject("Please open popup when open ebay.ca page");
			}
		);
	});
};

window.addEventListener("load", () => {
	document.getElementById("test-btn").addEventListener("click", () => {
		console.log("on click");
		console.log("sendMessage");

		const img = document.getElementById("img-base64");
		//* The line for simulating requests.

		/*

      getActiveTab().then((tab) => 
      {
          console.log("found tabs", tab);
          chrome.tabs.sendMessage(tab.id, 
            {
            type: "ON_UPLOAD_BASE64_IMG",
            payload: {
              content: img.value,
              name: 'put_the_file_name_here.png'
            },
          });

        });

    */

		chrome.storage.local.get("ebayTab", (res) => {
			console.log("ress");
			console.log(res.ebayTab);

			chrome.tabs.sendMessage(res.ebayTab, {
				type: "ON_UPLOAD_BASE64_IMG",
				payload: {
					content: img.value,
					name: "put_the_file_name_here.png",
				},
			});
		});
	});
});

chrome.storage.local.get("ebayTab", (res) => {
	console.log("ress");
	console.log(res.ebayTab);
});
