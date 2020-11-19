
// Connecting with the background
let bg_port = chrome.runtime.connect({ name: "ebay_list" }),
    table_rows_pattern = 'tbody[id*=grid-row]';


var totalPageNumber = 0;
var currentPageNumber = 0;  

if(typeof isWorkingPage !== 'undefined' && isWorkingPage)
{
    try 
    {
        getCurrentPgNumber();
        chrome.runtime.sendMessage({ type: 'from_ebay_list', command: "fetched_data_proceed" });
    // Send
        sendDataToBackground();
    } catch (error) 
    {
        console.log(error);
        //send to background page their was error and then refresh with is working page
        chrome.runtime.sendMessage({ type: 'from_ebay_list', command: "restart_ebay_page", error:error});
    }
    



}


function getCurrentPgNumber()
{
    var pgNumberElement = document.getElementsByClassName("go-to-page")[0];


   // currentPageNumber = pgNumberElement.getElementsByClassName("textbox__control1")[0].value;
    currentPageNumber = pgNumberElement.getElementsByClassName("textbox__control")[0].value

    totalPageNumber = pgNumberElement.getElementsByClassName("label")[0].innerText.replace(/\D/g, "");


}


function sendDataToBackground()
{
    // Send
    var totalActiveListings = parseInt($("span.results-count").html().replace(/[^0-9]/g, ''));
    bg_port.postMessage({ type: 'pgNumber', totalPageNumber: totalPageNumber, currentPageNumber : currentPageNumber  });
    bg_port.postMessage({ type: 'total_active_listings', count: totalActiveListings });
    bg_port.postMessage({ type: 'SKU_codes', sku_list: getSKUsList() });
  


}



function getSKUsList() {

    let items = [];

    // Looping through all table row elements on ebay active listing page
    // using jquery elements with $
    for(row of $(table_rows_pattern)) 
    {

        //Setting variable in jQuery, this is how you select an item and make it into a jQeury element.
        let $row = $(row);

        items.push({

            SKU: $row.find('td[class*="listingSKU"]').find('.cell-wrapper').text(),
            quantity: parseInt($row.find('td[class*="availableQuantity"]').find('.cell-wrapper').text().replace(/[^0-9]/g, '')),
            itemNumber: $row.find(".grid-row").attr("data-id"),
            price: parseFloat($row.find('td[class*="price"]').find('.cell-wrapper').text().replace(/[^0-9.]/g, ''))
        
        });

    }

    return items;
}
