// script that retreive all the images in a folder and set the sources for each image
//setPortfolioImages("overdrive");

// function sets the images
function setPortfolioImages(whichFolder)
{
	// the folder containing portfolio images
	var folder = "../../media/portfolio_images/" + whichFolder;

	// create an array for all the images
	var loadedImages = [];
	
	// go through the current folder directory and load the images
	$.ajax({
		url : folder,
		success: function (data) 
		{
			alert("here");
			$(data).find("a").attr("href", function (i, val) 
			{
			    if(val.match(/\.(jpe?g|png|gif)$/)) 
			    { 
			        
			    } 
			});
	    }
	});
	$.get(folder, function(data) 
    {
        console.log(data);
    });	
    
	// get the subimages
	var subImages = document.getElementsByClassName("images-to-switch");
	//alert(loadedImages.length);
	
	// loop through all subimages
	for (i = 1; i < subImages.length; i++) 
	{
		// set the src image
		subImages[i].src = loadedImages[i];
		subImages[i].onclick = "changeImage('../../media/portfolio_images/overdrive-logo.png', " + i +")";
	}
}
