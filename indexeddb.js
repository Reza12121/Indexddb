const openRequest = indexedDB.open("videos", 1);

openRequest.addEventListener("upgradeneeded", function (event) {
    let db = openRequest.result;
    if (!db.objectStoreNames.contains("video")) {
        db.createObjectStore("video", { keyPath: "page" });
    }
});

const connection = new Promise(function (resolve, reject) {
    openRequest.addEventListener("success", () => {
        resolve(openRequest.result);
    });
});

export async function addVideoToDatabase(url, blob) {
    const db = await connection;
    const transaction = db.transaction("video", "readwrite");
    const objectStore = transaction.objectStore("video");
    objectStore.add({
        blob,
        page: url,
    });
}

export async function getVideoFromDatabase(url) {
    const db = await connection;
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("video", "readonly");
        const objectStore = transaction.objectStore("video");

        const data = objectStore.get(url);
        data.addEventListener("success", () => {
            if (data.result) {
                resolve(data.result.blob);
            } else {
                reject();
            }
        });
        db.addEventListener("error", function (event) {
            reject();
        });
    });
}