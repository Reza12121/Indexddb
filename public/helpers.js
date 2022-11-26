import { addVideoToDatabase, getVideoFromDatabase } from "./indexeddb.js";

export function hide(el) {
  el.style.display = "none";
}

export function show(el) {
  el.style.removeProperty("display");
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

export async function queueVideoDownload(video, button) {
  downloadQueue.push({ video, button });
}

async function downloadVideo(video, button) {
  const buttonText = button.textContent;

  button.textContent = "Please Wait, Loading Video (0%)";
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
    const contentLength = Number.parseInt(
      response.headers.get("Content-Length"),
    );
    const contentType = response.headers.get("Content-Type");
    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      button.textContent = `Please Wait, Loading Video (${toInteger(receivedLength / contentLength * 100)}%)`;
    }

    video.blob = new Blob(chunks, { type: contentType });
    addVideoToDatabase(video.url, video.blob);
    console.log(`stored video into indexeddb: ${video.url}`);
  } finally {
    button.textContent = buttonText;
    button.disabled = false;
  }
}

export async function downloadAllVideos() {
  for (const { video, button } of downloadQueue) {
    await downloadVideo(video, button);
  }
}

// Survey Container
const surveyContainer = document.getElementById("survey-container");

// Video Container
const videoContainer = document.getElementById("video-container");
const videoPlayButton = videoContainer.querySelector(".play-video");
const videoExitButton = videoContainer.querySelector(".exit-video");
const videoPlayer = videoContainer.querySelector("video");

// Survey Termination Screen
const surveyTermination = document.getElementById("survey-termination");
hide(surveyTermination);

function terminateSurvey() {
  show(surveyTermination);
}

function centerButton(el, parent) {
  const e = el.getBoundingClientRect();
  const p = parent.getBoundingClientRect();
  el.style.left = `${p.x + p.width / 2 - e.width / 2}px`;
  el.style.top = `${p.y + p.height / 2 - e.height / 2}px`;
}
function checkScreenSize() {
  return window.innerWidth > 1280 && window.innerHeight > 720;
}
async function showVideoPlayer(video) {
  //try {
  //  await enterFullscreen();
  //} catch (error) {
  //  // handle this error if needed
  //  console.log("Could not enter fullscreen.");
  //}

  hide(surveyContainer);
  hide(videoPlayButton);
  hide(videoExitButton);

  if (checkScreenSize()) {
    videoPlayer.src = URL.createObjectURL(video.blob);
    videoPlayer.style.opacity = "25%";

    show(videoContainer);

    setTimeout(() => {
      show(videoPlayButton);
      centerButton(videoPlayButton, videoPlayer);
    }, 100);

    videoPlayer.addEventListener("pause", function showExitButton(e) {
      videoPlayer.removeEventListener("pause", showExitButton);
      videoPlayer.style.opacity = "25%";
      show(videoExitButton);
      centerButton(videoExitButton, videoPlayer);
    });
  } else {
    terminateSurvey();
  }
}
export function tryShowVideo(step, videoToPlay) {
  if (videoToPlay !== undefined) {
    if (videoToPlay.blob !== undefined) {
      showVideoPlayer(videoToPlay);
    } else alert(`Missing video for ${step.getAttribute("id")}`);
  }
}

function hideVideoPlayer() {
  show(surveyContainer);
  hide(videoContainer);
}

videoPlayButton.addEventListener("click", async function () {
  hide(videoPlayButton);
  //if (document.fullscreenElement === null) {
  //  await enterFullscreen();
  //}
  videoPlayer.style.opacity = "100%";
  videoPlayer.play();
});

videoExitButton.addEventListener("click", async function () {
  hideVideoPlayer();
  //if (document.fullscreenElement !== null) {
  //  await exitFullscreen();
  //}
});

hideVideoPlayer();

function getFormData(form) {
  const formData = new FormData(form);
  const keys = new Set();
  for (const input of form.querySelectorAll("input")) {
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
  el.style.border = "1px solid red";
  el.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function unhighlight(el) {
  el.style.removeProperty("border");
}

export function validateFormData(step, dataStorage) {
  const form = step.querySelector("form");
  const data = getFormData(form);
  for (const [key, value] of Object.entries(data)) {
    const fieldset = form.querySelector(`fieldset[name="${key}"]`);
    if (value === undefined || value === "") {
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
  element: undefined,
};
export function setupForm(element, groupName = "", HTML) {
  formInfo.groupName = groupName;
  formInfo.element = element.querySelector("form");
  formInfo.innerHtml = HTML;
}

export function addFormList(fieldName, message, choices) {
  let HTML = `
		<fieldset class="options-list" name="${formInfo.groupName}-${fieldName}">
			<div class="description">
				<label for="${formInfo.groupName}-${fieldName}">${message}</label>
			</div>
	`;
  for (let index = 0; index < choices.length; ++index) {
    const value = choices[index];
    HTML += `
      <label for="${formInfo.groupName}-${fieldName}${index}"><input type="radio" id="${formInfo.groupName}-${fieldName}${index}" name="${formInfo.groupName}-${fieldName}" value="${value}">${choices[index]}</label>
    `;
  }
  HTML += `
		</fieldset>
	`;
  formInfo.element.innerHTML += HTML;
}

export function addFormRange(fieldName, message, textL, choices, textR) {
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
    HTML += `
      <label for="${formInfo.groupName}-${fieldName}${index}"><input type="radio" id="${formInfo.groupName}-${fieldName}${index}" name="${formInfo.groupName}-${fieldName}" value="${value}">${choices[index]}</label>
    `;
  }
  HTML += `
			<span>${textR}</span>
			</div>
		</fieldset>
	`;
  formInfo.element.innerHTML += HTML;
}

export function addFormPromptForID() {
  let HTML = `
  <fieldset class="options-prompt" name="mturk-id">
    <div class="description">
      <label for="mturk-id">Please provide your Mturk ID:<input type="text" name="mturk-id"></input></label>
    </div>
  </fieldset>
`;
  formInfo.element.innerHTML += HTML;
}

export function addFormPrompt(fieldName, message) {
  let HTML = `
		<fieldset class="options-prompt" name="${formInfo.groupName}-${fieldName}">
			<div class="description">
				<label for="${formInfo.groupName}-${fieldName}">${message}<input type="text" name="${formInfo.groupName}-${fieldName}"></input></label>
			</div>
		</fieldset>
	`;
  formInfo.element.innerHTML += HTML;
}

export function addFormContinue(text) {
  formInfo.element.innerHTML +=
    `<button type="button" class="continue">${text}</button>`;
}

export function setStartTime(dataStorage) {
  dataStorage.push({ "start-time": new Date() });
}

export function setEndTime(dataStorage) {
  dataStorage.push({ "end-time": new Date() });
}

// generates a uuid and shows it on the screen
function generateUUID() {
  hide(surveyContainer);
  const randomUUID = self.crypto.randomUUID();
  const pElement = document.createElement("p");
  pElement.innerHTML = `
    Thank you for your participation. Please use this code to redeem your reward:
    <br>
    <span style="color:red">${randomUUID}</style>
  `;
  pElement.style.textAlign = "center";
  document.body.append(pElement);
}

let dataSubmitted = false;
export async function submitData(dataObjects, endpoint) {
  if (dataSubmitted === false) {
    let finalData = {};
    for (const data of dataObjects) {
      finalData = { ...finalData, ...data };
    }
    console.log(finalData);
    // send to server
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      dataSubmitted = true;
      generateUUID();
    } catch (err) {
    }
  }
}
