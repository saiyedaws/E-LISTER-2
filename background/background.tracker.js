let 
	ebay_active_port,
	ebay_end_port,
	main_tab,
	process_status = false,
	pagination_offset = -200,
	total_active_listings,
	page_items_count = 0,
	iteration_items_count = 0,
	totalPageNumber = 0,
	currentPageNumber = 0,
	endListing_tab,
	didItemFailToUpdate = false;

var skuList = [];	

// Checks connections and waits the popup
chrome.extension.onConnect.addListener((port) => {
	// Checks the connection source
	if (port.name === "popup") 
	{
		popup_port = port;

		// Begins to listen messages from popup
		popup_port.onMessage.addListener((request) => {
			// Checks the form submission
			if (request.type === "start") 
			{
				
				skuList = [];	
				chrome.storage.local.set({ skuList: skuList });
				startNextPage();
			}
		});

		popup_port.onDisconnect.addListener(() => (popup_port = null));
	}


	if (port.name === 'ebay_list') 
    {

        ebay_active_port = port;

        // Begins to listen messages from Ebay
        ebay_active_port.onMessage.addListener(request => 
            {

            if (request.type === 'SKU_codes') 
            {
                checkSKUList(request.sku_list);
            }

            if (request.type === 'total_active_listings') {
                total_active_listings = request.count;
            }

            if (request.type === 'pgNumber') {
                totalPageNumber = request.totalPageNumber;
                currentPageNumber = request.currentPageNumber;

                console.log(currentPageNumber + "/" + totalPageNumber);
            }

        });

        ebay_active_port.onDisconnect.addListener(() => ebay_active_port = null);
	}
	

});

function startNextPage() 
{
	console.log(skuList);

	process_status = true;

	return new Promise((resolve) => {
		setTimeout(() => {
			page_items_count = 0;
			pagination_offset += 200;

			// Closing previous tab
			try {
				chrome.tabs.remove(main_tab);
				main_tab = null;
			} catch (err) {}

			chrome.tabs.create(
				{
					url:
						"https://www.ebay.ca/sh/lst/active?offset=" +
						pagination_offset +
						"&limit=200&sort=timeRemaining",
					active: false,
				},
				function (tab) {
					// Saving ID of Ebay listing page tab
					main_tab = tab.id;

					// Defining of needed page inside a script
					chrome.tabs.executeScript(main_tab, {
						code: "let isWorkingPage = true;",
						runAt: "document_end",
					});
				}
			);

			let messageListener = (request) => {
				chrome.runtime.onMessage.removeListener(messageListener);

				if (
					request.type === "from_ebay_list" &&
					request.command === "fetched_data_proceed"
				) {
					resolve();
				}

				if (
					request.type === "from_ebay_list" &&
					request.command === "restart_ebay_page"
				) {
					//close browser,
					chrome.tabs.remove(main_tab, () => {
						pagination_offset -= 200;

						startNextPage();
						resolve();
					});
				}
			};

			chrome.runtime.onMessage.addListener(messageListener);
		}, 1000);
	});
}



async function checkSKUList(list) 
{


    total_page_items = list.length;

	for (item of list) 
	{

        
		var sku = item.SKU;
		skuList.push(sku);


        
        //await checkToEndItemListing(item.itemNumber);


        page_items_count++;



    }


	
	chrome.storage.local.set({ skuList: skuList });
	await checkNextPage();
	
}



function addSkuToDuplicateList(sku){
	skuList.push(sku);
	chrome.storage.local.set({ skuList: skuList });
}


function checkNextPage() 
{
    return new Promise(resolve => {

		console.log("currentPageNumber: "+currentPageNumber);
		console.log("totalPageNumber: "+totalPageNumber);

		if (currentPageNumber === totalPageNumber)
		{
            console.log("On the Last Page!");
            pagination_offset = -200;
            page_items_count = 0;






        } else if (page_items_count >= total_page_items) {

            //console.log("Starting Next Page");
            startNextPage().then(() => resolve());
        }


    });







}