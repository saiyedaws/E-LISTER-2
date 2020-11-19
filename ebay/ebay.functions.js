
function pastePrice(product) {
	// Sets price
	document.querySelector("input#binPrice").value = product.custom_price;

	// Finds field with selling format and sets it fixed-price
	var select = document.querySelector("select#format");
	select.value = "StoresFixedPrice";

	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", false, true);
	select.dispatchEvent(evt);
}

function pasteTitle(product) {
	//document.querySelector("input#editpane_title").value = product.custom_title;

	var title = product.custom_title;

	if (title.length > 80) {
		title = title.substring(0, 77) + "...";
	}

	document.querySelector("input#editpane_title").value = title;
}

function pasteAsin(product) {
	var encodedAsin = btoa(product.sku);
	document.querySelector("input#editpane_skuNumber").value = encodedAsin;
}

function pasteUpc(product) {
	try {
		document.querySelector("input#upc").value = product.upc;
	} catch (error) {
		console.log(error);
	}
}

function pickItemCondition() 
{
	try {
			// New Item Condition
	var select = document.querySelector("select#itemCondition");
	select.value = "1000";

	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("change", false, true);
	select.dispatchEvent(evt);
	} catch (error) 
	{
		console.log(error);
	}

}

function pasteBrand(product) {
	try {
		deleteOldBrand();
	} catch (error) {
		console.log(error);
	}

	try {
		var select = document.getElementById("Listing.Item.ItemSpecific[Brand]");
		select.value = "Unbranded";
	} catch (error) {
		
	}

}

function pasteItemSpecifics(product) 
{
	//var itemSpecifics = product.tableSpecifics;
	var itemSpecifics = product.filteredItemSpecifics;




	var fields = document.querySelectorAll("[name*='_st_']");

	for (var index = 0; index < fields.length; index++) 
	{
		var field = fields[index];
		var fieldName = field.getAttribute("fieldname");

		console.log("\nChecking fieldName: "+fieldName);

		if (fieldName) {
			fieldName = fieldName.toLowerCase();

			for (var i = 0; i < itemSpecifics.length; i++) 
			{
				var itemSpecific = itemSpecifics[i];
				var label = itemSpecific.label.toLowerCase();

				var value = itemSpecific.value;
				try {
					value = jsUcfirst(string);
				} catch (error) {
					
				}
				

				if (fieldName.includes(label)) 
				{
					console.log("\n\nFound: ");
					console.log("fieldName: " + fieldName);
					console.log("label: " + label);

				
					if(!field.value)
					{
						console.log("Field Empty, enter itemspecific Value");
						console.log("itemSpecific.value: "+value);
						field.value = value;
					}
				}

				if (label.includes(fieldName)) 
				{
					console.log("\n\nFound: ");
					console.log("fieldName: " + fieldName);
					console.log("label: " + label);

					if(!field.value)
					{
						console.log("Field Empty, enter itemspecific Value");
						console.log("itemSpecific.value: "+value);
						field.value = value;
					}
				}
			}



		}
	}


}

function pasteNAToRequiredItemSpecifics() {
	//var reqdElms = document.getElementsByClassName("eib-selTgLbl reqd");
	var reqdElms = document.getElementsByClassName("reqd");
	for (let index = 0; index < reqdElms.length; index++) {
		var reqdElm = reqdElms[index].parentElement.parentElement.parentElement;
		//console.log(reqdElm);

		var matchedElems = reqdElm.querySelectorAll("[name*='_st_']");

		if (matchedElems.length > 0) {
			var matchedEle = reqdElm.querySelectorAll("[name*='_st_']")[0];

			//console.log(matchedEle);
			//console.log(index);

			if (
				matchedEle.value == "" ||
				matchedEle.value == 0 ||
				matchedEle.value == null
			) {
				// Invalid... Box is empty
				//console.log("Box is empty");
				matchedEle.value = "Unavailable";
			}
		}
	}

	var materialElm = document.querySelectorAll(
		`[id="Listing.Item.ItemSpecific[Material]"]`
	);

	if (materialElm.length > 0) {
		//console.log(materialElm[0]);
		//console.log(materialElm[0].value);

		if (
			materialElm[0].value == "" ||
			materialElm[0].value == 0 ||
			materialElm[0].value == null
		) {
			// Invalid... Box is empty
			// console.log("Box is empty");
			materialElm[0].value = "Unavailable";
		}
	}

	var mpnElm = document.querySelectorAll(`[id="Listing.Item.ItemSpecific[MPN]`);

	if (mpnElm.length > 0) {
		//console.log(materialElm[0]);
		//console.log(materialElm[0].value);

		if (
			mpnElm[0].value == "" ||
			mpnElm[0].value == 0 ||
			mpnElm[0].value == null
		) {
			// Invalid... Box is empty
			// console.log("Box is empty");
			mpnElm[0].value = "Does Not Apply";
		}
	}

	var typeElm = document.querySelectorAll(
		`[id="Listing.Item.ItemSpecific[Type]`
	);

	if (typeElm.length > 0) {
		//console.log(materialElm[0]);
		//console.log(materialElm[0].value);

		if (
			typeElm[0].value == "" ||
			typeElm[0].value == 0 ||
			typeElm[0].value == null
		) {
			// Invalid... Box is empty
			// console.log("Box is empty");
			typeElm[0].value = "Does Not Apply";
		}
	}
}

function deleteOldBrand() {
	var matchedElems = document.querySelectorAll("[n*='Brand']");
	matchedElems[0].getElementsByTagName("button")[0].click();
}


function pasteShippingWeight(product)
{
	console.log("pasteShippingWeight");

	if(product.shippingWeight)
	{
		console.log("pasteShippingWeight true");

		try 
		{
			var shippingWeight = product.shippingWeight.value;
			var shippingWeightUnit = product.shippingWeight.unit;

			console.log("shippingWeight: "+shippingWeight);
			console.log("shippingWeightUnit: "+shippingWeightUnit);

			if(shippingWeightUnit === "g")
			{
				console.log("g");
				document.querySelector("input#minorUnitWeight").value = shippingWeight;
			}

			if(shippingWeightUnit === "kg")
			{
				console.log("kg");
				document.querySelector("input#majorUnitWeight").value = shippingWeight;
			}
		
		} catch (error) {
			console.log(error);
		}

	}
}


function pasteDimensions(product)
{

	var dimensions = product.dimensions;

	if(dimensions)
	{

		if(dimensions.unit === "cm")
		{
			
			document.querySelector("input#pkgLength").value = dimensions.length;
			document.querySelector("input#pkgWidth").value = dimensions.width;
			document.querySelector("input#pkgHeight").value = dimensions.height;
		}

	}
}



function pasteCustomItemSpecific(label, value)
{


	return new Promise(resolve =>
	{
		try {
		
	
					
			var addItemSpecificElement;

			var xpath = "//a[text()=' + Add custom item specific']";
			addItemSpecificElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			

			value = jsUcfirst(value);
			label = jsUcfirst(label);
			
			//limit both to 65 characters
			if (value.length > 64)
			{

				value = value.substring(0,62)+"...";
			}
			//limit both to 65 characters
			if (value.length > 64)
			{

				value = value.substring(0,62)+"...";
			}



			addItemSpecificElement.click();
			document.querySelectorAll("#_isTag")[0].value = label;
			document.querySelectorAll("#_isVal")[0].value = value;
		
			if ($("#_errTag").is(":visible")){
				$("a[id$=cancle]")[0].click();
				resolve();
			}
			else
			{
				$("#_isSave")[0].click();
				resolve();
			}


		

				
	
		} catch (e) 
		{
			console.log(e);
			$("a[id$=cancle]")[0].click();
			resolve();
	
		}


	});

	


}


async function pasteCustomItemSpecifics(product)
{

	var exitingFieldNames = getExistingFieldNames();
	var itemSpecifics = product.filteredItemSpecifics;

	console.log("pasteCustomItemSpecifics: "+itemSpecifics);
	//remove duplicates
	itemSpecifics = itemSpecifics.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i);

	console.log("pasteCustomItemSpecifics: "+itemSpecifics);

	for (var index = 0; index < itemSpecifics.length; index++) 
	{
		var itemSpecific = itemSpecifics[index];

		var label = itemSpecific.label;
		var value = itemSpecific.value;

		
	
		if(!exitingFieldNames.includes(label))
		{
			await pasteCustomItemSpecific(label, value);
		}
		
		
	}
}






function getExistingFieldNames() {
	var exitingFieldNames = [];
	var fields = document.querySelectorAll("[name*='_st_']");

	for (var index = 0; index < fields.length; index++) {
		var field = fields[index];
		var fieldName = field.getAttribute("fieldname");

		if (fieldName) {
			exitingFieldNames.push(fieldName.toLowerCase().trim());
		}
	}

	exitingFieldNames = exitingFieldNames = exitingFieldNames.filter(
		(v, i, a) => a.findIndex((t) => t === v) === i
	);

	return exitingFieldNames;
}


