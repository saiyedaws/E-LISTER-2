
// First at all check product page
if(isProductPage()) 
{
    var product_data;

    removeUnwantedElements();
    var bullet_points = getBulletPoints();

        // Filling of saving variable
        product_data = 
        {
            title: getProductTitle(),
            custom_title: '',
            filteredTitle: getFilteredTitle(),
            //price: getProductPrice(),
            price: getAmazonPrice(),
            custom_price: '',
            brand: getProductBrand(),
            sku: getAsin(),
            upc: 'Does Not Apply',
            description: getProductDescription(),
            bullet_points: bullet_points.list,
            bullet_points_html: bullet_points.html,
            desc_template: desc_template,
            mpn: getModelPartNumberList(),
            tableSpecifics: getTableSpecifics(),

            filteredItemSpecifics: getFilteredItemSpecifics(),

            main_sd_images: getProductPictures(),
            main_hd_images: getHighResProductPictures(),
            
            dimensions: getDimensions(),
            shippingWeight: getShippingWeight(),
            extra: {},

   
        };


    console.log(product_data);


    // Save the product to storage
    chrome.storage.local.set({ /* key */ amazon: /* value */ product_data }, (/* Runs after creating */) => {
        
    });
}