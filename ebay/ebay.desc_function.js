/*
function pasteDescription(product) {

    //Switch To HTML View
    $("[id$=_switchLnk] > a.std-lnk")[0].click();
    var desc_html = product.description;


    // Fill description WYSIWYG iFrame
    $("[id$=txtEdit_ht]").contents().find("body").html(desc_html);

    //Switch back to StandardView
    $("[id$=_switchLnk] > a.htm-lnk")[0].click();
}
*/

function pasteDescription(product) {
    try {
        $("a[id$=cancle]")[0].click();
    }
    catch (e) { }

    $("[id$=_switchLnk] > a.std-lnk")[0].click();

    let desc_html = "";
 
    
    product.desc_template = product.desc_template.replace(/\[TITLE\]/, product.custom_title);
   
    
    //Product Description, check if its empty
    var bullet_points_html = product.bullet_points_html;
    var div = document.createElement('div');
    div.innerHTML = bullet_points_html.trim();

    var text;
    try {
        text = div.innerText;
    text = text.replace(/\s/g,"").toLowerCase();
    } catch (error) 
    {
        console.log(error);
    }
    


    if(text === "productdescription")
    {
        product.desc_template = product.desc_template.replace(/\[DESCRIPTION\]/, product.description);
    }else
    {
        product.desc_template = product.desc_template.replace(/\[DESCRIPTION\]/, "");
    }


   
    product.desc_template = product.desc_template.replace(/\[BULLETS\]/, product.bullet_points_html);

    desc_html = product.desc_template;



    


    // Replace http with https
    desc_html = desc_html.replace(/http\:/gi, "https:");
    // Have no idea what it does
    // As I understand it removes quotes from href attributes only
    desc_html = desc_html.replace(/<a(.*)href=("|')([^'"]+)("|')(.*)>/gi, "<a$1href=''$5>").replace(/<img(.*)src=("|')([^'"]+)("|')(.*)>/gi, "<img$1src=''$5>");
    // Remove Javascript code
    desc_html = desc_html.replace(/<script.*?>[\s\S]*?<\/script>/ig, "");



    var brandToReplace = product.brand;
    desc_html = insensitiveReplaceAll(desc_html, brandToReplace, "");













    desc_html = insensitiveReplaceAll(desc_html, "full refund", "resolution");
    
    desc_html = insensitiveReplaceAll(desc_html, "amazon.ca", "");
    desc_html = insensitiveReplaceAll(desc_html, ".ca", "");

    desc_html = insensitiveReplaceAll(desc_html, "Read more", "");
	desc_html = insensitiveReplaceAll(desc_html, "amazon", "");
	desc_html = insensitiveReplaceAll(desc_html, "ebay", "");
    desc_html = insensitiveReplaceAll(desc_html, "warranty", "satisfaction");
    

    desc_html = insensitiveReplaceAll(desc_html, "warran-ty", "satisfaction");

    desc_html = insensitiveReplaceAll(desc_html, "refund", "satisfaction");
    
    desc_html = insensitiveReplaceAll(desc_html, "Email Address", "");
    desc_html = insensitiveReplaceAll(desc_html, "Email", "");
    desc_html = insensitiveReplaceAll(desc_html, "Address", "");

    desc_html = insensitiveReplaceAll(desc_html, "phone", "");


    desc_html = insensitiveReplaceAll(desc_html, "GUARANTEE", "SATISFACTION GUARANTEE");
    desc_html = insensitiveReplaceAll(desc_html, "MONEY BACK", "");
    desc_html = insensitiveReplaceAll(desc_html, "worry-free", "");

    desc_html = insensitiveReplaceAll(desc_html, "contact us", "contact me");

    desc_html = insensitiveReplaceAll(desc_html, "year", "");

    desc_html = insensitiveReplaceAll(desc_html, "limited", "");

    desc_html = insensitiveReplaceAll(desc_html, "lifetime", "");

    desc_html = insensitiveReplaceAll(desc_html, "24-MONTH", "");


    desc_html = insensitiveReplaceAll(desc_html, "MONTH", "");

    desc_html = insensitiveReplaceAll(desc_html, "30-day", "");
    desc_html = insensitiveReplaceAll(desc_html, "money-back", "satisfaction");
    desc_html = insensitiveReplaceAll(desc_html, "30-day", "");
    desc_html = insensitiveReplaceAll(desc_html, "3- free", "");
    desc_html = insensitiveReplaceAll(desc_html, "replacement", "");

    desc_html = insensitiveReplaceAll(desc_html, "120-day", "");


    desc_html = insensitiveReplaceAll(desc_html, "LINK", "");
    desc_html = insensitiveReplaceAll(desc_html, "BROWSER", "");


    desc_html = insensitiveReplaceAll(desc_html, "E-Book", "");
    desc_html = insensitiveReplaceAll(desc_html, "E-Mail", "");



    //remove links
    desc_html = desc_html.replace(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, "");
    


	//remove any email
    //html = html.replace(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/, "");
    desc_html = desc_html.replace(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/gim, "");
    desc_html = desc_html.replace(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/g, "");
    desc_html = desc_html.replace(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/gi, "");


    //remove phone numbers
    desc_html = desc_html.replace(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g, "");
    

	//remove all url
	desc_html = desc_html.replace(
		"\\b((?:[a-z][\\w-]+:(?:\\/{1,3}|[a-z0-9%])|www\\d{0,3}[.]|[a-z0-9.\\-]+[.][a-z]{2,4}\\/)(?:[^\\s()<>]+|\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\))+(?:\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:'\".,<>?\u00AB\u00BB\u201C\u201D\u2018\u2019]))",
		""
	);

    desc_html = insensitiveReplaceAll(desc_html, "brand", "product");
    


    //---------------Removing mpn--------------


    //removing any MPN from title
    desc_html = desc_html.replace(/\b([A-Z]{3}[0-9].*?)\b/g, "");

    //from mpnList remove title
    var mpns = product.mpn;

    if(mpns.length>0)
    {
        for (i = 0; i < mpns.length; i++) 
        {
            var mpn = mpns[i].toLowerCase();
            desc_html = insensitiveReplaceAll(desc_html, mpn, "");
        }
    }




    // Fill description WYSIWYG iFrame
    let html_as_text = document.createTextNode(desc_html);
    $("[id$=txtEdit_ht]").contents().find("body").html(html_as_text);
    $("[id$=_switchLnk] > a.htm-lnk")[0].click();
}