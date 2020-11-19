
console.log("Paste Draft Functions Initilaized");
function pasteDraftTitle() 
{
    chrome.storage.local.get(["amazon"], async function (result) 
    {
		let messageObject = {
			fpCmd: "titleSelected",
			suggestedCategories: [],
			title: result.amazon.title,
		};

		setTimeout(function () {
			window.postMessage(JSON.stringify(messageObject));


			console.log("Title to enter: ",result.amazon.title);
			try {
				console.log("Title to enter: ",result.amazon.title);
				var findProductTextBox = document.querySelector(".find-product");
				findProductTextBox.value = result.amazon.title;
			} catch (error) {
				console.log(error);
			}
		
        }, 400);
        

	});
}


