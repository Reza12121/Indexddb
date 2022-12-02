import {
  addFormContinue,
  addFormList,
  addFormPrompt,
  addFormPromptForID,
  addFormRange,
  downloadAllVideos,
  hide,
  queueVideoDownload,
  setEndTime,
  setStartTime,
  setupForm,
  show,
  submitData,
  tryShowVideo,
  validateFormData,
} from "../helpers.js";

const video1 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/Original.mp4", };
const video2 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/V_1S.mp4", };
const video3 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/V_3S.mp4", };
const video4 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/V_6S.mp4", };
const video5 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/V_6_1S.mp4", };
const video6 = { url: "https://survey-webserver-reza.s3.amazonaws.com/SSvLS/V_12s.mp4", };
const video7 = { url: "" };
const video8 = { url: "" };
const video9 = { url: "" };
const video10 = { url: "" };
const video11 = { url: "" };
const video12 = { url: "" };

const surveyData = [];

// Step 1 - Intro + Video 1
{
  const step = step1;
  const nextStep = step2;
  const videoToPlay = video1;

  // form setup
  setupForm(step);
  addFormPromptForID();
  addFormContinue("Continue");

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
  const step = step2;
  const nextStep = step3;
  const videoToPlay = video2;

  // form setup
  setupForm(
    step,
    "original",
    `
		<h1>Short Stall vs Long Stall</h1>
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
    "Shoot",
    `Did the main player shoot the gun during the video?`,
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
  const step = step3;
  const nextStep = step4;
  const videoToPlay = video3;

  // form setup
  setupForm(
    step,
    "1s",
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
    "Stall-Acceptable",
    `Was the stall event acceptable?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot the gun during the video?`,
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
  const step = step4;
  const nextStep = step5;
  const videoToPlay = video4;

  // form setup
  setupForm(
    step,
    "3s",
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
    "Stall-Acceptable",
    `Was the stall event acceptable?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot the gun during the video?`,
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

// Step 5 - Video 4 Survey + Video 5
{
  const step = step5;
  const nextStep = step6;
  const videoToPlay = video5;

  // form setup
  setupForm(step, "6s");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event acceptable?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot the gun during the video?`,
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

// Step 6 - Video 5 Survey + Video 6
{
  const step = step6;
  const nextStep = step7;
  const videoToPlay = video6;

  // form setup
  setupForm(step, "6-1s");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event acceptable?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot the gun during the video?`,
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

// Step 7 - Video 6 Survey
{
  const step = step7;

  // form setup
  setupForm(step, "12s");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event acceptable?<br>
		<small>(i.e. When watching, does the quality improve or deteriorate)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot the gun during the video?`,
    ["Yes", "No"],
  );
  addFormContinue("Submit Survey");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        setEndTime(surveyData);
        continueButton.disabled = true;
        submitData(surveyData, "/submit-ssvsls");
        continueButton.textContent = "Thank you for participating!";
      }
    }
  });
}

downloadAllVideos();
