// change these links later
// test with shorter video first
const videoURLList = [
	'./content/vid.mp4',
	//'https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4',
];

const screenGeneralSurvey = document.getElementById('general-survey');
const continueButton = document.getElementById('general-survey-continue');
const screenVideo = document.getElementById('video-screen');
const screenVideoSurvey = document.getElementById('video-survey');
const submitButton = document.getElementById('submit-survey');

const surveyContainer = document.getElementById('survey-container');
const videoContainer = document.getElementById('video-container');

const video = document.getElementById('video');
const watchVideoButton = document.getElementById('watch-video');
const playButton = document.getElementById('play-video');
const exitVideoButton = document.getElementById('exit-video');

function hide(el) {
	el.style.display = 'none';
}
function show(el) {
	el.style.removeProperty('display');
}

function videoMain() {
	async function downloadVideo(url) {
		const response = await fetch(url);
		return response.blob();
	}
	// load all the videos in the background
	const blobs = [];
	for (const url of videoURLList) {
		blobs.push(downloadVideo(url));
	}

	function moveOnTopOfVideo(el) {
		const y = (video.offsetHeight + el.offsetHeight) / 2;
		el.style.bottom = `${y}px`;
	}

	function displayVideo(index) {
		hide(exitVideoButton);
		hide(playButton);
		blobs[index]?.then((blob) => {
			video.src = URL.createObjectURL(blob);
			// wait for fullscreen transition before moving button
			setTimeout(() => {
				moveOnTopOfVideo(playButton);
				show(playButton);
			}, 250);
		});
	}
	// display the first video
	displayVideo(0);

	video.addEventListener('pause', function () {
		show(exitVideoButton);
		moveOnTopOfVideo(exitVideoButton);
	});

	playButton.addEventListener('click', function () {
		hide(playButton);
		if (document.fullscreen === true) {
			video.play();
		} else {
			console.log('video must be fullscreen to play');
		}
	});
}

hide(screenVideo);
hide(screenVideoSurvey);
hide(videoContainer);

continueButton.addEventListener('click', function () {
	hide(screenGeneralSurvey);
	show(screenVideo);
});

watchVideoButton.addEventListener('click', function () {
	document.body
		.requestFullscreen()
		.then(function () {
			hide(surveyContainer);
			show(videoContainer);
			videoMain();
		})
		.catch(function (error) {
			console.log('problem starting fullscreen', error);
		});
});

exitVideoButton.addEventListener('click', function () {
	document
		.exitFullscreen()
		.then(function () {
			hide(screenVideo);
			hide(videoContainer);
			show(surveyContainer);
			show(screenVideoSurvey);
		})
		.catch(function (error) {
			console.log('problem exiting fullscreen', error);
		});
});

submitButton.addEventListener('click', function () { });
