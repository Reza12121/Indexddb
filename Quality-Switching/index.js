import {
  addFormContinue,
  addFormList,
  addFormPrompt,
  addFormRange,
  downloadAllVideos,
  hide,
  queueVideoDownload,
  setupForm,
  show,
  validateFormData,
  setStartTime,
  setEndTime,
  tryShowVideo,
  submitData,
} from "../helpers.js";

const video1 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4" };
const video2 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/LOL_QS.mp4" };
const video3 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/Valorant-QS.mp4" };

//const video1 = { url: 'vid1.mp4' };
//const video2 = { url: 'vid1.mp4' };
//const video3 = { url: 'vid1.mp4' };
const video4 = { url: "" };
const video5 = { url: "" };
const video6 = { url: "" };
const video7 = { url: "" };
const video8 = { url: "" };
const video9 = { url: "" };
const video10 = { url: "" };
const video11 = { url: "" };
const video12 = { url: "" };

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
  setupForm(step, "QS");
  addFormPrompt("mturk-id", "Please provide your Mturk ID:");
  addFormContinue("continue");

  //
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        setStartTime(surveyData);
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
  setupForm(
    step,
    "QS-GTA",
    `
		<h1>Quality Switching Evaluation</h1>
		<p>
			<b>Note:</b> Answer the following questions based on the video you have just viewed.
		</p>
	`,
  );
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Notice-Quality",
    `Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Car",
    `Did you see a car in the video?`,
    ["Yes", "No"],
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
  setupForm(
    step,
    "QS-LoL",
    `
		<h1>Quality of Video</h1>
		<p>
			<b>Note:</b> Answer the following questions based on the video you have just viewed.
		</p>
	`,
  );
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Notice-Quality",
    `Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "fights",
    `Did you see any fights?`,
    ["Yes", "No"],
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        surveyData.push({
          'window-width': window.innerWidth,
          'window-height': window.innerHeight,
        });
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
  setupForm(
    step,
    "QS-Valorant",
    `
	<h1>Quality of Video</h1>
	<p>
		<b>Note:</b> Answer the following questions based on the video you have just viewed.
	</p>
	`,
  );
  addFormRange(
    "experience",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Notice-Quality",
    `Have you noticed any changes in quality while watching the video?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "shoot",
    `Did you see the main player to shoot?`,
    ["Yes", "No"],
  );
  addFormContinue("submit survey");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        setEndTime(surveyData);
        continueButton.disabled = true;
        submitData(surveyData);
        continueButton.textContent = "Data Sent!";
        //tryShowVideo(step, videoToPlay)
        //hide(step);
        //show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
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
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormContinue("continue");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  if (videoToPlay) queueVideoDownload(videoToPlay, continueButton);
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        //tryShowVideo(step, videoToPlay)
        //hide(step);
        //show(nextStep);
        //
        continueButton.disabled = true;
        submitData(surveyData);
        continueButton.textContent = "Data Sent!";
      }
    }
  });
}

downloadAllVideos();
