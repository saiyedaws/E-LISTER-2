// Saves options to chrome.storage
function saveWaterMarkImage() 
{

    var waterMarkUrl = document.getElementById("waterMarkID").value;


    localStorage.setItem('waterMarkUrl', waterMarkUrl);
    addImageToDom();

}
  


  document.getElementById('saveWaterMarkImage').addEventListener('click', saveWaterMarkImage);

  
  addImageToDom();


function addImageToDom()
{
    var waterMarkUrl = localStorage.getItem("waterMarkUrl");

    var DOM_img = document.getElementById("myWatermark");
    DOM_img.src = waterMarkUrl;

    DOM_img.width = 500;
    DOM_img.height = 500;
    
	var src = document.getElementsByTagName("html")[0];
	src.appendChild(DOM_img);
}