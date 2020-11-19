// This variable will contain a product info from storage in background
let temp_storage;
var popup_port;
var ebay_port;
var amazon_port;

var ebayTab;




// Checks connections and waits the popup
chrome.extension.onConnect.addListener(function (port) {
	// Checks the connection source
	if (port.name === "popup") 
	{
		popup_port = port;

		// Begins to listen messages from popup
		popup_port.onMessage.addListener(function (request) {
			// Checks the form submission
			if (request.from === "popup" && request.type === "create_ebay_tab") 
			{


				chrome.storage.local.get(["amazon"], (res) => 
				{

				temp_storage = res.amazon;
				var sku = temp_storage.sku;
				sku = btoa(sku);

				addSkuToDuplicateList(sku);

				// Update variables with received data
                temp_storage.custom_title = request.title;
                temp_storage.custom_price = request.price;


				// Update the product in storage
				chrome.storage.local.set({ amazon: temp_storage });
				});




				// Create new tab
				chrome.tabs.create(
					{
						url:
							"http://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem",
						active: true,
					},
					function (tab) {
						// Ask tab for script executing
						// It is necessary, because it needs to make query after document if completely loaded
						chrome.tabs.executeScript(
							tab.id,
							{
								code: 'console.log("Inserting product starts..")',
								runAt: "document_end",
							},
							() => {
								// Send request that says ebay's listener that it needs to start inserting from storage
								ebayTab = tab.id;

								chrome.storage.local.set({ ebayTab: ebayTab });


								chrome.tabs.sendMessage(ebayTab, { type: "start_inserting" });
							}
						);
					}
				);
			}





			if (request.from === "popup" && request.type === "upload_img") 
			{

				uploadImg(request.imgUrl);
			}


			






		});
	}


	if (port.name === "ebay") 
	{
		ebay_port = port;

		ebay_port.onMessage.addListener(function (request) 
		{

			if (request.from === "ebay" && request.type === "upload_img") 
			{

				console.log("Uplading IMG");
				uploadImgToEbay(request.payload) 
				
			}

		});


	}


	if (port.name === "amazon") 
	{
		amazon_port = port;

		// Begins to listen messages from popup
		amazon_port.onMessage.addListener(function (request) {
			// Checks the form submission
			if (request.from === "amazon" && request.type === "create_ebay_tab") 
			{

				console.log(request);

				chrome.storage.local.get(["amazon"], (res) => 
				{

				temp_storage = res.amazon;
				var sku = temp_storage.sku;
				sku = btoa(sku);

				addSkuToDuplicateList(sku);

				// Update variables with received data
                temp_storage.custom_title = request.title;
				temp_storage.custom_price = request.price;
				temp_storage.extra = request.extra;


				// Update the product in storage
				chrome.storage.local.set({ amazon: temp_storage });
				});




				// Create new tab
				chrome.tabs.create(
					{
						url:
							"http://bulksell.ebay.ca/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem",
						active: true,
					},
					function (tab) 
					{
						// Ask tab for script executing
						// It is necessary, because it needs to make query after document if completely loaded

						console.log(`Tab Created from amazon, tabId of created ebayDraft is: ${tab.id}`);

						setTimeout(() => {
							chrome.tabs.executeScript(
								tab.id,
								//null,
								{
									code: 'console.log("Inserting product starts..")',
									runAt: "document_end",
									//runAt: "document_start",
								},
								() => {
	
									console.log("Executed  script, starting callback");
	
									// Send request that says ebay's listener that it needs to start inserting from storage
									ebayTab = tab.id;
	
									chrome.storage.local.set({ ebayTab: ebayTab });
	
	
									chrome.tabs.sendMessage(ebayTab, { type: "start_inserting" });
								}
							);
						}, 2000);



					}
				);
			}







			






		});
	}


});
