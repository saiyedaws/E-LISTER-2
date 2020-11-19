uploadImageCounter();
function uploadImageCounter() {
  var upload_counter = document.getElementById("editpaneSect_VIN");

  var upload_image_count = document.createElement("div");
  upload_image_count.innerHTML =
    "Starting Image Upload -  <span id='my-upload-count'>0</span>/<span id='total-upload-images'>0</span><span id='image-started'>&#9989;</span>";

  upload_image_count.id = "lister_image_upload";
  upload_image_count.style.border = "thick solid rgb(172, 235, 100)";
  upload_image_count.style.fontStyle = "italic";

  var loader = document.createElement("div");
  loader.id = "loader";
  loader.style.border = "6px solid #f3f3f3"; /* Light grey */
  loader.style.borderTop = "6px solid #3498db"; /* Blue */
  loader.style.borderRadius = "50%";
  loader.style.width = "12px";
  loader.style.height = "12px";
  loader.style.animation = "spin 2s linear infinite";
  loader.style.display = "block";



  upload_image_count.appendChild(loader);

  upload_counter.append(upload_image_count);
}
