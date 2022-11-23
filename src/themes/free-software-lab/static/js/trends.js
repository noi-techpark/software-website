const API_URL = "https://stable-diffusion.opendatahub.com";

/**
 * Since the service is currently on disabled, example images are loaded from the bucket of the site itself are used
 * If you want to reenable it, put your s3 bucket url as S3_URL and uncomment buttons etc. in trends.html
 */
// const S3_URL = "https://noi-sd.s3-eu-west-1.amazonaws.com";
const S3_URL = "/trends";

const GET_STATUS_POLL_TIMEOUT = 1000;

const AMOUNT_PORTRAIT = 8;
const AMOUNT_LANDSCAPE = 6;

// depends on which GPU machine is used in the backend
const AVERAGE_SINGLE_LANDSCAPE_DURATION = 13;
const AVERAGE_SINGLE_PORTRAIT_DURATION = 11;


const AVERAGE_JOB_DURATION_LANDSCAPE = AVERAGE_SINGLE_LANDSCAPE_DURATION * AMOUNT_LANDSCAPE;
const AVERAGE_JOB_DURATION_PORTRAIT = AVERAGE_SINGLE_PORTRAIT_DURATION * AMOUNT_PORTRAIT;

const AVERAGE_JOB_DURATION = (AVERAGE_JOB_DURATION_PORTRAIT + AVERAGE_JOB_DURATION_LANDSCAPE) / 2;



let hcaptchaToken = null;
let expectedWaitTime = null;

async function generateImage(type) {
    resetImages();
    showProgress();

    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value

    const resolution = type == 'portrait' ? "576x768" : "768x576";
    const amount = type == 'portrait' ? AMOUNT_PORTRAIT : AMOUNT_LANDSCAPE;

    const encodedPrompt = encodeURI(prompt);

    if (encodedPrompt.length == 0) {
        alert("Please enter a prompt");
        return;
    }

    const url = `${API_URL}/addJob?prompt=${encodedPrompt}&number=${amount}&resolution=${resolution}&captcha=${hcaptchaToken}`;

    try {
        const res = await fetch(url);
        const imageToken = await res.json();
        setExpectedTime(imageToken, type);
        // disable captcha and buttons
        captchaExpired();
        await pollStatus(imageToken, amount);
    } catch (e) {
        console.error("addJob error", e);
        resetProgress();
    }
}

async function setExpectedTime(token, type) {
    const url = `${API_URL}/getJobStatus?token=${token}`;

    let response;
    try {
        const res = await fetch(url);
        response = await res.json();
    } catch (e) {
        console.error("getStatus error", e);
        resetProgress();
    }

    const own_job_timing = type == "portrait" ? AVERAGE_JOB_DURATION_PORTRAIT : AVERAGE_JOB_DURATION_LANDSCAPE;
    expectedWaitTime = (response["QueueLength"] * AVERAGE_JOB_DURATION) + (own_job_timing);
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
        progressStatus.innerHTML = `${queueLength - 1} other jobs are currently in the queue  ${age} / ${expectedWaitTime}`;
    else if (queueLength == 1)
        progressStatus.innerHTML = `1 other job is currently in the queue  ${age} / ${expectedWaitTime}`;
    else
        progressStatus.innerHTML = `Generating your images now  ${age} / ${expectedWaitTime}`;
}

function showExample(examplePrompt, token, type) {
    resetImages();

    const promptInput = document.getElementById('prompt');

    promptInput.value = examplePrompt;

    const amount = type == 'portrait' ? AMOUNT_PORTRAIT : AMOUNT_LANDSCAPE;
    showImages(token, amount);
}


function showImages(token, amount) {
    // reset progress bar again
    resetProgress();
    hideProgress();

    // image
    showImage(token, 0)
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
    // remove previous image
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
}

function captchaExpired() {
    hcaptcha.reset();
    hcaptchaToken = null

    // disable buttons
    document.getElementById('generate_portrait').disabled = true
    document.getElementById('generate_landscape').disabled = true
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

document.addEventListener("DOMContentLoaded", function (event) {
    showExample('Portrait of Reinhold Messner, oil painting', 'messner', 'portrait');
});
