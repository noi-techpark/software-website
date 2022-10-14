const API_URL = "https://stable-diffusion.opendatahub.com";
const S3_URL = "https://noi-sd.s3-eu-west-1.amazonaws.com";
const GET_STATUS_POLL_TIMEOUT = 1000

let hcaptchaToken = null;
let expectedWaitTime = null;



async function generateImage(type) {
    showProgress();

    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value

    const resolution = type == 'portrait' ? "576x768" : "768x576";
    const amount = type == 'portrait' ? 9 : 5;

    const encodedPrompt = encodeURI(prompt);

    if (encodedPrompt.length == 0) {
        alert("Please enter a prompt");
        return;
    }

    const url = `${API_URL}/addJob?prompt=${encodedPrompt}&number=${amount}&resolution=${resolution}&captcha=${hcaptchaToken}`;

    try {
        const res = await fetch(url);
        const imageToken = await res.json();
        setExpectedTime(imageToken, amount);
        await pollStatus(imageToken, amount);
    } catch (e) {
        console.error("addJob error", e);
        resetProgress();
    }
}

async function setExpectedTime(token, amount) {
    const url = `${API_URL}/getJobStatus?token=${token}`;

    let response;
    try {
        const res = await fetch(url);
        response = await res.json();
    } catch (e) {
        console.error("getStatus error", e);
        resetProgress();
    }
    expectedWaitTime = ((6 * 7 * response["QueueLength"]) + (amount * 7));
}

async function pollStatus(token, amount) {
    const url = `${API_URL}/getJobStatus?token=${token}`;

    let response;
    try {
        const res = await fetch(url);
        response = await res.json();
    } catch (e) {
        console.error("getStatus error", e);
        resetProgress();
    }

    if (response && response["State"] == "complete") {
        // generating finished and showing image
        showImages(token, amount);
    } else {
        updateState(response["Age"], response["QueueLength"]);
        setTimeout(pollStatus, GET_STATUS_POLL_TIMEOUT, token, amount);
    }
}

function updateState(age, queueLength) {
    let progressBar = document.getElementById("progress_bar");
    let progressBarGallery = document.getElementById("progress_bar_gallery");
    let progressStatus = document.getElementById("progress_status");

    age = Math.ceil(age)

    // update progress bar using average 7 images and 6 seconds for every image generation in the queue and itself
    let width = age / expectedWaitTime * 100;
    // max 100
    width = width > 100 ? 100 : width

    progressBar.style.width = width + "%";
    progressBarGallery.style.width = width + "%";

    if (queueLength > 1)
        progressStatus.innerHTML = `${queueLength} other jobs are currently in the queue  ${age} / ${expectedWaitTime}`;
    else if (queueLength == 1)
        progressStatus.innerHTML = `1 other job is currently in the queue  ${age} / ${expectedWaitTime}`;
    else
        progressStatus.innerHTML = `Generating your images now  ${age} / ${expectedWaitTime}`;
}

function showExample(examplePrompt, token, amount) {
    const promptInput = document.getElementById('prompt');

    promptInput.value = examplePrompt;
    showImages(token, amount);
}

function showImages(token, amount) {
    // reset progress bar again
    resetProgress();
    hideProgress();

    resetImages();

    // image
    showImage(token, 0)

    // amount == 9 means portrait; keep width to correct aspect ratio of 1.33 
    width = amount == 9 ? 67.66 : 119.7;

    // gallery
    for (let i = 0; i < amount; i++) {
        let galleryImage = document.createElement("img");

        galleryImage.setAttribute("src", `${S3_URL}/${token}/0000${i}.png`);
        galleryImage.setAttribute("height", "100%");
        galleryImage.setAttribute("width", "100%");
        galleryImage.setAttribute("class", "gallery_image contain-aspect");
        galleryImage.setAttribute("alt", `Generated image number ${i}`);
        galleryImage.setAttribute("onclick", `showImage("${token}",${i})`);
        document.getElementById("generated_gallery").appendChild(galleryImage);
    }
}

function showImage(token, id) {
    // remove image if exist
    if (document.getElementById("generated_image"))
        document.getElementById("generated_image").remove();

    // show image
    let image = document.createElement("img");
    image.setAttribute("src", `${S3_URL}/${token}/0000${id}.png`);
    image.setAttribute("height", "100%");
    image.setAttribute("width", "100%");
    image.setAttribute("id", "generated_image");
    image.setAttribute("class", "contain-aspect");
    image.setAttribute("alt", `Generated image number 0`);
    document.getElementById("generated_image_container").appendChild(image);
}

function captchaVerify(token) {
    hcaptchaToken = token

    //enable buttons
    document.getElementById('generate_portrait').disabled = false
    document.getElementById('generate_landscape').disabled = false
    // document.getElementById('example_button_1').disabled = false
    // document.getElementById('example_button_2').disabled = false
    // document.getElementById('example_button_3').disabled = false
    // document.getElementById('example_button_4').disabled = false

}

function captchaExpiered() {
    hcaptchaToken = null

    // disable buttons
    document.getElementById('generate_portrait').disabled = true
    document.getElementById('generate_landscape').disabled = true
    // document.getElementById('example_button_1').disabled = true
    // document.getElementById('example_button_2').disabled = true
    // document.getElementById('example_button_3').disabled = true
    // document.getElementById('example_button_4').disabled = true
}

function resetProgress() {
    let progressBar = document.getElementById("progress_bar");
    let progressBarGallery = document.getElementById("progress_bar_gallery");
    let progressStatus = document.getElementById("progress_status");
    progressBar.style.width = "0%";
    progressBarGallery.style.width = "0%";
    progressStatus.innerHTML = "";
    expectedWaitTime = null;
}

function resetImages() {
    // empty the gallery
    const galleryImages = document.querySelectorAll('.gallery_image');
    galleryImages.forEach(galleryImage => {
        galleryImage.remove();
    });

    // remove generated image
    if (document.getElementById("generated_image"))
        document.getElementById("generated_image").remove();
}

function hideProgress() {
    document.getElementById("progress_bar_gallery").style.display = 'none';
    document.getElementById("progress_bar").style.display = 'none';
}

function showProgress() {
    document.getElementById("progress_bar_gallery").style.display = 'block';
    document.getElementById("progress_bar").style.display = 'block';
}