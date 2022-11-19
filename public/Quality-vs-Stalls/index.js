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

const video1 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/GTA_N_Q.mp4", };
const video2 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/GTA_N_6S.mp4", };
const video3 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/GTA_A_Q.mp4", };
const video4 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/GTA_A_6S.mp4", };
const video5 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/Valorant_N_Q.mp4", };
const video6 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/Valorant_N_6S.mp4", };
const video7 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/Valorant_A_Q.mp4", };
const video8 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/Valorant_A_6S.mp4", };
const video9 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/LOL_N_Q.mp4", };
const video10 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/LOL_N_6S.mp4", };
const video11 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/Q/LOL_A_Q.mp4", };
const video12 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QvS/S/LOL_A_6S.mp4", };

const surveyData = [];

// Step 1 - Intro + Video 1
{
  const step = step1;
  const nextStep = step2;
  const videoToPlay = video1;

  // form setup
  setupForm(step);
  addFormPromptForID();
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
  const step = step2;
  const nextStep = step3;
  const videoToPlay = video2;

  // form setup
  setupForm(
    step,
    "QvS-GTA-Normal-Quality",
    `
		<h1>Quality Switching Evaluation vs Stall Evenets</h1>
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
    "Quality-Acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Yellow-Plane",
    `Did you see a yellow plane in the video?`,
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
    "QvS-GTA-Normal-Stall",
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
    `Was the stall event (buffering) acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current stall event?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Yellow-Plane",
    `Did you see a yellow plane in the video?`,
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
    "QvS-GTA-A",
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
    "Quality-acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
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

// Step 5
{
  const step = step5;
  const nextStep = step6;
  const videoToPlay = video5;

  // form setup
  setupForm(step, "QvS-GTA-Action-Stall");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event (buffering) acceptable??<br>
		<small>(i.e. would you continue to watch longer with the current stall event?)</small>`,
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

// Step 6
{
  const step = step6;
  const nextStep = step7;
  const videoToPlay = video6;

  // form setup
  setupForm(step, "QvS-Valorant-Normal-Quality");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Quality-Acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot??`,
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

// Step 7
{
  const step = step7;
  const nextStep = step8;
  const videoToPlay = video7;

  // form setup
  setupForm(step, "QvS-Valorant-Normal-Stall");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event (buffering) acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current stall?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot?`,
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

// Step 8
{
  const step = step8;
  const nextStep = step9;
  const videoToPlay = video8;

  // form setup
  setupForm(step, "QvS-Valorant-Action-Quality");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Quality-Acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot??`,
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

// Step 9
{
  const step = step9;
  const nextStep = step10;
  const videoToPlay = video9;

  // form setup
  setupForm(step, "QvS-Valorant-Action-Stall");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event (buffering) acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current stall?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did the main player shoot?`,
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

// Step 10
{
  const step = step10;
  const nextStep = step11;
  const videoToPlay = video10;

  // form setup
  setupForm(step, "QvS-LOL-Normal-Quality");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Quality-Acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
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
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
      }
    }
  });
}

// Step 11
{
  const step = step11;
  const nextStep = step12;
  const videoToPlay = video11;

  // form setup
  setupForm(step, "QvS-LoL-Normal-Stall");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event (buffering) acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current stall?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
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
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
      }
    }
  });
}

// Step 12
{
  const step = step12;
  const nextStep = step13;
  const videoToPlay = video12;

  // form setup
  setupForm(step, "QvS-LOL-Action-Quality");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Quality-Acceptable",
    `Was the quality acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current quality?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
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
        tryShowVideo(step, videoToPlay);
        hide(step);
        show(nextStep);
      }
    }
  });
}

// Step 13
{
  const step = step13;

  // form setup
  setupForm(step, "QvS-LoL-Action-Stall");
  addFormRange(
    "QoE",
    `How was your experience in watching the previous video?`,
    "Poor",
    ["1", "2", "3", "4", "5"],
    "Excellent",
  );
  addFormList(
    "Stall-Acceptable",
    `Was the stall event (buffering) acceptable?<br>
		<small>(i.e. would you continue to watch longer with the current stall?)</small>`,
    ["Yes", "No"],
  );
  addFormList(
    "Shoot",
    `Did you see any fights?`,
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
        submitData(surveyData, "/submit-qvss");
        continueButton.textContent = "Thank you for participating!";
      }
    }
  });
}

downloadAllVideos();
