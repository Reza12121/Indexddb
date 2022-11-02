const elVideo = document.getElementById("video");
const buttonNextVideo = document.getElementById('next-video');

const urlList = [
    'https://survey-webserver-reza.s3.amazonaws.com/QS/GTA_QS.mp4',
    'https://survey-webserver-reza.s3.amazonaws.com/QS/LOL_QS.mp4',
    'https://survey-webserver-reza.s3.amazonaws.com/QS/Valorant-QS.mp4',
];

async function download(url) {
    const response = await fetch(url);
    return response.blob();
}

const blobJobs = [];
for (const url of urlList) {
    blobJobs.push(download(url));
}

function playVideo(index) {
    blobJobs[index]?.then(blob => {
        elVideo.src = URL.createObjectURL(blob);
    });
}

let index = 0;
buttonNextVideo.addEventListener('click', function () {
    playVideo(index++);
});
playVideo(index++);
