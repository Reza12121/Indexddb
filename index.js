const elVideo = document.getElementById("video");
const buttonNextVideo = document.getElementById('next-video');

const urlList = [
    'vid0.mp4',
    'vid1.mp4',
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
