// script that will change the image during a slide show 

// the current index of the array of images
var currentIndex = 0;

// the switch image timing
var imageSwitchTimer = 3000;
var splits = window.location.href.split('/');
var initialPicturePath = "/media/portfolio_images/";

// based on which page is currently loaded, set that picture path
if (splits[splits.length - 2].includes("drive-on-metz"))
{
	initialPicturePath += "driveonmetz-logo.jpg";
}
else if (splits[splits.length - 2].includes("forsaken"))
{
	initialPicturePath += "forsaken-logo.png";
}
else if (splits[splits.length - 2].includes("memoryless"))
{
	initialPicturePath += "memoryless-logo.jpg";
}
else if (splits[splits.length - 2].includes("over-drive"))
{
	initialPicturePath += "overdrive-logo.png";
}
else if (splits[splits.length - 2].includes("road-rager"))
{
	initialPicturePath += "roadrager-logo.png";
}
else if (splits[splits.length - 2].includes("rollaball-mod"))
{
	initialPicturePath += "rollaballmod-logo.png";
}
else if (splits[splits.length - 2].includes("squirvival"))
{
	initialPicturePath += "squirvival-logo.png";
}


// once the script starts, set the initial picture
changeImage(initialPicturePath, currentIndex);


// start fading animation
// wait a certain amount of seconds then call fadeImage
var timeoutHandle = window.setTimeout(fadeImage, imageSwitchTimer);

// function that changes the image
// imageSource: the location of the image to display
// index: the index of the image that was clicked
function changeImage(imageSource, index)
{
	// get the componenets broken up
	var splits = imageSource.split('/');
	
	// set the current index
	currentIndex = index;
	
	// the loading image that was displayed, remove the display
	var loadingImage = document.getElementsByClassName("image-loading");
	loadingImage[0].style.display = "none";

	// the image to change, display the image and change the source
	var imageToChange = document.getElementsByClassName("slideshow-image");
	imageToChange[0].style.display = "block";
	imageToChange[0].src = imageSource;
	imageToChange[0].title = splits[splits.length - 1];
	imageToChange[0].alt = splits[splits.length - 1];
	
	// get the subimages 
	var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");
	
	// loop through all subimages
	for (i = 0; i < subImages.length; i++) 
	{
		// remove the selected image
 		subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
	}
	
	// set the selected image
	subImages[index].className += " slideshow-subimage-selected";
	
	// clear the timeout and reset
	window.clearTimeout(timeoutHandle);
	timeoutHandle = window.setTimeout(fadeImage, imageSwitchTimer);
}

// function that fades to the next image
function fadeImage()
{
	// get the sub images 
	var subImages = document.getElementsByClassName("slideshow-subimages-to-switch");
	
	// increase the index
	currentIndex = (currentIndex + 1)%subImages.length;
	
	// get the componenets broken up
	var splits = subImages[currentIndex].src.split('/');
	
	// the image to change, display the image and change the source
	var imageToChange = document.getElementsByClassName("slideshow-image");
	imageToChange[0].style.display = "block";
	imageToChange[0].src = subImages[currentIndex].src;
	imageToChange[0].title = splits[splits.length - 1];
	imageToChange[0].alt = splits[splits.length - 1];
	
	// loop through all subimages
	for (i = 0; i < subImages.length; i++) 
	{
		// remove the selected image
 		subImages[i].className = subImages[i].className.replace(" slideshow-subimage-selected", "");
	}
	
	// set the selected image
	subImages[currentIndex].className += " slideshow-subimage-selected";
	
	// wait a certain amount of seconds then call fadeImage
	window.clearTimeout(timeoutHandle);
	timeoutHandle = window.setTimeout(fadeImage, imageSwitchTimer);
}
