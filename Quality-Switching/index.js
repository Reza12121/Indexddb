import { addVideoToDatabase, getVideoFromDatabase } from '../indexeddb.js';

function hide(el) {
	console.log('hiding', el);
	el.style.display = 'none';
}

function show(el) {
	el.style.removeProperty('display');
}

function toInteger(num) {
	return new Uint32Array([num])[0];
}

function enterFullscreen() {
	return new Promise(function (resolve, reject) {
		document.body
			.requestFullscreen()
			.then(function () {
				resolve();
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

function exitFullscreen() {
	return new Promise(function (resolve, reject) {
		document
			.exitFullscreen()
			.then(function () {
				resolve();
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

const downloadQueue = [];

async function queueVideoDownload(video, button) {
	downloadQueue.push({ video, button });
}

async function downloadVideo(video, button) {
	const buttonText = button.textContent;

	button.textContent = "loading video (0%)";
	button.disabled = true;

	try {
		video.blob = await getVideoFromDatabase(video.url);
		console.log(`loaded video from indexeddb: ${video.url}`);
	} catch (err) {
		console.log(`download video from: ${video.url}`);
		const response = await fetch(video.url);

		// https://javascript.info/fetch-progress
		// Example to get download progress
		const reader = response.body.getReader();
		const contentLength = Number.parseInt(response.headers.get('Content-Length'));
		const contentType = response.headers.get('Content-Type');
		let receivedLength = 0;
		let chunks = [];
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			chunks.push(value);
			receivedLength += value.length;
			button.textContent = `loading video (${toInteger(receivedLength / contentLength * 100)}%)`;
		}

		video.blob = new Blob(chunks, { type: contentType });
		addVideoToDatabase(video.url, video.blob);
		console.log(`stored video into indexeddb: ${video.url}`);
	} finally {
		button.textContent = buttonText;
		button.disabled = false;
	}
}

async function downloadAllVideos() {
	for (const { video, button } of downloadQueue) {
		await downloadVideo(video, button);
	}
}

// Survey Container
const surveyContainer = document.getElementById('survey-container');

// Video Container
const videoContainer = document.getElementById('video-container');
const videoPlayButton = videoContainer.querySelector('.play-video');
const videoExitButton = videoContainer.querySelector('.exit-video');
const videoPlayer = videoContainer.querySelector('video');

function centerButton(el, parent) {
	const e = el.getBoundingClientRect();
	const p = parent.getBoundingClientRect();
	el.style.left = `${p.x + p.width / 2 - e.width / 2}px`;
	el.style.top = `${p.y + p.height / 2 - e.height / 2}px`;

}
async function showVideoPlayer(video) {
	try {
		await enterFullscreen();
	} catch (error) {
		// handle this error if needed
		console.log("Could not enter fullscreen.");
	}

	videoPlayer.src = URL.createObjectURL(video.blob);
	videoPlayer.style.opacity = "25%";

	hide(surveyContainer);
	hide(videoPlayButton);
	hide(videoExitButton);
	show(videoContainer);

	setTimeout(() => {
		show(videoPlayButton);
		centerButton(videoPlayButton, videoPlayer);
	}, 100);

	videoPlayer.addEventListener('pause', function showExitButton(e) {
		videoPlayer.removeEventListener('pause', showExitButton);
		videoPlayer.style.opacity = "25%"
		show(videoExitButton);
		centerButton(videoExitButton, videoPlayer);
	});
}
function tryShowVideo(step, videoToPlay) {
	console.log(step, videoToPlay);
	if (videoToPlay !== undefined) {
		if (videoToPlay.blob !== undefined)
			showVideoPlayer(videoToPlay);
		else alert(`Missing video for ${step.getAttribute('id')}`);
	}
}

function hideVideoPlayer() {
	show(surveyContainer);
	hide(videoContainer);
}

videoPlayButton.addEventListener('click', async function () {
	hide(videoPlayButton);
	if (document.fullscreenElement === null) {
		await enterFullscreen();
	}
	videoPlayer.style.opacity = "100%"
	videoPlayer.play();
});

videoExitButton.addEventListener('click', async function () {
	hideVideoPlayer();
	if (document.fullscreenElement !== null) {
		await exitFullscreen();
	}
});

hideVideoPlayer();

function getFormData(form) {
	const formData = new FormData(form);
	const keys = new Set();
	for (const input of form.querySelectorAll('input')) {
		keys.add(input.name);
	}
	const data = {};
	for (const key of keys) {
		if (formData.has(key)) {
			data[key] = formData.get(key);
		} else {
			data[key] = undefined;
		}
	}
	return data;
}

function highlight(el) {
	el.style.border = '1px solid red';
	el.scrollIntoView({
		behavior: "smooth",
		block: "start"
	});
}
function unhighlight(el) {
	el.style.removeProperty('border');
}

function validateFormData(step, dataStorage) {
	const form = step.querySelector('form');
	const data = getFormData(form);
	for (const [key, value] of Object.entries(data)) {
		const fieldset = form.querySelector(`fieldset[name="${key}"]`)
		if (value === undefined) {
			highlight(fieldset);
			return false;
		} else {
			unhighlight(fieldset);
		}
	}
	dataStorage.push(data);
	return true;
}

const formInfo = {
	groupName: undefined,
	element: undefined
}
function setupForm(element, groupName = "", HTML) {
	formInfo.groupName = groupName;
	formInfo.element = element.querySelector('form');
	formInfo.innerHtml = HTML;
}

function addFormQuestion(fieldName, message, choices) {
	let HTML = `
		<fieldset class="options-list" name="${formInfo.groupName}-${fieldName}">
			<div class="description">
				<label for="${formInfo.groupName}-${fieldName}">${message}</label>
			</div>
	`;
	for (let index = 0; index < choices.length; ++index) {
		const value = choices[index];
		HTML += `<label for="${formInfo.groupName}-${fieldName}${index}"><input type="radio" id="${formInfo.groupName}-${fieldName}${index}" name="${formInfo.groupName}-${fieldName}" value="${value}">${choices[index]}</label>`;
	}
	HTML += `
		</fieldset>
	`;
	formInfo.element.innerHTML += HTML;
}

function addFormRange(fieldName, message, textL, choices, textR) {
	let HTML = `
		<fieldset class="options-range" name="${formInfo.groupName}-${fieldName}">
			<div class="description">
				<label for="${formInfo.groupName}-${fieldName}">${message}</label>
			</div>
			<div class="row">
			<span>${textL}</span>
	`;
	for (let index = 0; index < choices.length; ++index) {
		const value = choices[index];
		HTML += `<label for="${formInfo.groupName}-${fieldName}${index}"><input type="radio" id="${formInfo.groupName}-${fieldName}${index}" name="${formInfo.groupName}-${fieldName}" value="${value}">${choices[index]}</label>`;
	}
	HTML += `
			<span>${textR}</span>
			</div>
		</fieldset>
	`;
	formInfo.element.innerHTML += HTML;
}

function addFormContinue(text) {
	formInfo.element.innerHTML += `<button type="button" class="continue">${text}</button>`;
}

let dataSubmitted = false;
async function submitData(dataObjects) {
	if (dataSubmitted === false) {
		let finalData = {};
		for (const data of dataObjects) {
			finalData = { ...finalData, ...data };
		}
		console.log(finalData);
		// send to server
		await fetch('/submit-data', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(finalData)
		});
		dataSubmitted = true;
	}
}

//
//
//
//
// Steps, Videos, Surveys

const video1 = { url: 'https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4' };
const video2 = { url: 'https://survey-webserver-reza.s3.amazonaws.com/QS/LOL_QS.mp4' };
const video3 = { url: 'https://survey-webserver-reza.s3.amazonaws.com/QS/Valorant-QS.mp4' };

//const video1 = { url: 'vid1.mp4' };
//const video2 = { url: 'vid1.mp4' };
//const video3 = { url: 'vid1.mp4' };
const video4 = { url: '' };
const video5 = { url: '' };
const video6 = { url: '' };
const video7 = { url: '' };
const video8 = { url: '' };
const video9 = { url: '' };
const video10 = { url: '' };
const video11 = { url: '' };
const video12 = { url: '' };

const surveyData = [];

// Finish the Survey Code
// continueButton.disabled = true;
// submitData(surveyData);
// continueButton.textContent = "Data Sent!";

// Step 1 - Intro + Video 1
{
	// set these to correct steps
	const step = step1;
	const nextStep = step2;
	const videoToPlay = video1;

	// form setup
	setupForm(step);
	addFormContinue("play first video");

	//
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 2 - Video 1 Survey + Video 2
{
	// set these to correct steps
	const step = step2;
	const nextStep = step3;
	const videoToPlay = video2;

	// form setup
	setupForm(step, "QS-GTA", `
		<h1>Quality Switching Evaluation</h1>
		<p>
			<b>Note:</b> Answer the following questions based on the video you have just viewed.
		</p>
	`);
	addFormRange(
		"QoE",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormQuestion(
		"Notice-Quality",
		`Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
		['Yes', 'No']
	);
	addFormQuestion(
		"Car",
		`Did you see a car in the video?`,
		['Yes', 'No']
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 3 - Video 2 Survey + Video 3
{
	// set these to correct steps
	const step = step3;
	const nextStep = step4;
	const videoToPlay = video3;

	// form setup
	setupForm(step, "QS-LoL", `
		<h1>Quality of Video</h1>
		<p>
			<b>Note:</b> Answer the following questions based on the video you have just viewed.
		</p>
	`);
	addFormRange(
		"QoE",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormQuestion(
		"Notice-Quality",
		`Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
		['Yes', 'No']
	);
	addFormQuestion(
		"fights",
		`Did you see any fights?`,
		['Yes', 'No']
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 4 - Video 3 Survey + Video 4 or Finish
{
	// set these to correct steps
	const step = step4;
	const nextStep = step5;
	const videoToPlay = video4;

	// form setup
	setupForm(step, "QS-Valorant",`
	<h1>Quality of Video</h1>
	<p>
		<b>Note:</b> Answer the following questions based on the video you have just viewed.
	</p>
	`);
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormQuestion(
		"Notice-Quality",
		`Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
		['Yes', 'No']
	);
	addFormQuestion(
		"shoot",
		`Did you see the main player to shoot?`,
		['Yes', 'No']
	);
	addFormContinue("submit survey");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				continueButton.disabled = true;
				submitData(surveyData);
				continueButton.textContent = "Data Sent!";
				//tryShowVideo(step, videoToPlay)
				//hide(step);
				//show(nextStep);
				//surveyData.push()
			}
		}
	});
}

// Step 5
{
	// set these to correct steps
	const step = step5;
	const nextStep = step6;
	const videoToPlay = video5;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 6
{
	// set these to correct steps
	const step = step6;
	const nextStep = step7;
	const videoToPlay = video6;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 7
{
	// set these to correct steps
	const step = step7;
	const nextStep = step8;
	const videoToPlay = video7;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 8
{
	// set these to correct steps
	const step = step8;
	const nextStep = step9;
	const videoToPlay = video8;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 9
{
	// set these to correct steps
	const step = step9;
	const nextStep = step10;
	const videoToPlay = video9;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 10
{
	// set these to correct steps
	const step = step10;
	const nextStep = step11;
	const videoToPlay = video10;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 11
{
	// set these to correct steps
	const step = step11;
	const nextStep = step12;
	const videoToPlay = video11;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 12
{
	// set these to correct steps
	const step = step12;
	const nextStep = step13;
	const videoToPlay = video12;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				tryShowVideo(step, videoToPlay)
				hide(step);
				show(nextStep);
				surveyData.push()
			}
		}
	});
}

// Step 13
{
	// set these to correct steps
	const step = step13;
	const nextStep = undefined;
	const videoToPlay = undefined;

	// form setup
	setupForm(step, "QS3");
	addFormRange(
		"experience",
		`How was your experience in watching the previous video?`,
		"Poor", ["1", "2", "3", "4", "5"], "Excellent"
	);
	addFormContinue("continue");

	//
	hide(step);
	const continueButton = step.querySelector(".continue");
	if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
	continueButton.addEventListener('click', function () {
		if (continueButton.disabled !== true) {
			if (validateFormData(step, surveyData)) {
				//tryShowVideo(step, videoToPlay)
				//hide(step);
				//show(nextStep);
				//surveyData.push()
				continueButton.disabled = true;
				submitData(surveyData);
				continueButton.textContent = "Data Sent!";
			}
		}
	});
}

downloadAllVideos();
