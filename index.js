const elVideo = document.getElementById("video");
const buttonNextVideo = document.getElementById('play-video');
const elSurveyLink = document.getElementById('survey-link');

const urlList = [
    'https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4',
    'https://survey-webserver-reza.s3.amazonaws.com/QS/LOL_QS.mp4',
    'https://survey-webserver-reza.s3.amazonaws.com/QS/Valorant-QS.mp4',
];

async function download(url) {
	const response = await fetch(url);
	return response.blob();
}

function displayVideo(index) {
	blobJobs[index]?.then(blob => {
		elVideo.src = URL.createObjectURL(blob);
	});
}

// load the videos
const blobJobs = [];
for (const url of urlList) {
	blobJobs.push(download(url));
}

// display the first video
elSurveyLink.style.display = 'none';
let index = 0;
displayVideo(index++);
elVideo.addEventListener('pause', function () {
	elSurveyLink.style.removeProperty('display');
});

buttonNextVideo.addEventListener('click', function () {
	// hide the problem
	buttonNextVideo.style.display = 'none';
	// play the video
	elVideo.play();
});
