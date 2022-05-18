console.log("starting ebay image samples");

createImage();




function createImage(){

    console.log("product_data from content.js",product_data);
    var payload = get4Images();
    payload.name = product_data.title;


        //Sending Message To Background with Type (get_image)
    chrome.runtime.sendMessage({
        from: 'amazon_image_test_content', 
        type: 'get_image_for_amazon_test',
 
        payload: payload
        }
        ,function(response){

        console.log(`sent_from:amazon_image_test_content , sent_type:get_image_for_amazon_test`);
        console.log(`response_type:${response.type}, response_from:${response.from}`,response);

        
       

        console.log("imgb64", response.imgB64);

        var img = new Image();
        img.src = response.imgB64;
        var div = document.getElementById('productTitle');
        div.appendChild(img);
          
          
         // img.src = response.img.src;
          

    });


}

//receive one-time Message in content from background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) 
  {
    if (request.type == "b64Img_for_div")

    var img = new Image();
    img.src = request.imgB64;
    var div = document.getElementById('productTitle');
    div.appendChild(img);
    
      
  }
);



function get4Images()
{
    if(product_data.main_hd_images.length >=4)
    {
        var payload = 
        {
            image_1 : product_data.main_hd_images[0],
            image_2 : product_data.main_hd_images[1],
            image_3 : product_data.main_hd_images[2],
            image_4 : product_data.main_hd_images[3],

        }

        return payload;
    }
}