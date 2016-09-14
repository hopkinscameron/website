// script that will change the video during a slide show 

// function that changes the video
// videoSource: the location of the video to display
// index: the index of the image that was clicked
function changeVideo(videoSource, index)
{
	// the video to change, change the source
	var videoToChange = document.getElementsByClassName("iframe-porfolio-video");
	videoToChange[0].src = videoSource;
	
	// get the subimages 
	var subImages = document.getElementsByClassName("slideshow-subvideoimage-to-switch");
	
	// loop through all subimages
	for (i = 0; i < subImages.length; i++) 
	{
		// remove the selected image
 		subImages[i].className = subImages[i].className.replace(" slideshow-subvideoimage-selected", "");
	}
	
	// set the selected image
	subImages[index].className += " slideshow-subvideoimage-selected";
}
