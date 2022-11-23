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

const video1 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4" };
const video2 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/LOL_QS.mp4" };
const video3 = { url: "https://survey-webserver-reza.s3.amazonaws.com/QS/Valorant-QS.mp4" };
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
    "QS-GTA",
    `
      <h1>Quality Switching Evaluation</h1>
      <p>
        <b>Note:</b> Answer the following questions based on the video you have just viewed.
      </p>
    `
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
    "Fights",
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

// Step 4 - Video 3 Survey
{
  const step = step4;

  // form setup
  setupForm(
    step,
    "QS-Valorant",
    `
      <h1>Quality of Video</h1>
      <p>
        <b>Note:</b> Answer the following questions based on the video you have just viewed.
      </p>
    `
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
    "Shoot",
    `Did you see the main player to shoot?`,
    ["Yes", "No"],
  );
  addFormContinue("submit survey");

  //
  hide(step);
  const continueButton = step.querySelector(".continue");
  continueButton.addEventListener("click", function () {
    if (continueButton.disabled !== true) {
      if (validateFormData(step, surveyData)) {
        setEndTime(surveyData);
        continueButton.disabled = true;
        submitData(surveyData, "/submit-qs");
        continueButton.textContent = "Thank you for participating!";
      }
    }
  });
}



downloadAllVideos();
