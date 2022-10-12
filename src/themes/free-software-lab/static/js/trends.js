const API_URL = "https://api.1006.org/524e45354e44326a67750a/0.95/";
const S3_URL = "http://noi-sd.s3-website-eu-west-1.amazonaws.com/";
const GET_STATUS_POLL_TIMEOUT = 1000

let hcaptchaToken = null;



const generateImage = async function (type, examplePrompt = undefined) {
    console.log('generate image');
    console.log(hcaptchaToken)

    showProgress();

    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value

    const resolution = type == 'portrait' ? "576x768" : "768x576";
    const amount = type == 'portrait' ? 9 : 5;

    const encodedPrompt = examplePrompt != undefined ? encodeURI(examplePrompt) : encodeURI(prompt)

    // set prompt input to example value
    if (examplePrompt != undefined)
        promptInput.value = examplePrompt;

    const url = API_URL + `addJob?prompt=${encodedPrompt}&number=${amount}&resolution=${resolution}&captcha=${hcaptchaToken}`;
    console.log(url);

    try {
        const res = await fetch(url);
        console.log(res);
        const imageToken = await res.json();
        // const imageToken = "test-" + type;
        await pollStatus(imageToken, amount);
    } catch (e) {
        console.error("addJob error", e);
        resetProgress();
    }
}

async function pollStatus(token, amount) {
    const url = API_URL + `getJobStatus?token=${token}`;

    let response;
    try {
        const res = await fetch(url);
        console.log(res);
        response = await res.json();
        console.log(response);
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

    let expectedWaitTime = ((6 * 7 * queueLength) + (6 * 7))
    // update progress bar using average 7 images and 6 seconds for every image generation in the queue and itself
    let width = (age) / ((6 * 7 * queueLength) + (6 * 7)) * 100;
    // max 100
    width = width > 100 ? 100 : width

    console.log("progress bar witdh: " + width + "%");
    progressBar.style.width = width + "%";
    progressBarGallery.style.width = width + "%";

    if (queueLength > 1)
        progressStatus.innerHTML = `${queueLength} other jobs are currently in the queue. Ready in ${expectedWaitTime} seconds`;
    else if (queueLength == 1)
        progressStatus.innerHTML = `1 other job is currently in the queue ${age}/${expectedWaitTime}. Ready in ${expectedWaitTime} seconds`;
    else
        progressStatus.innerHTML = `Generating your images now...`;

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

        galleryImage.setAttribute("src", `http://noi-sd.s3-website-eu-west-1.amazonaws.com/${token}/${i}.png`);
        galleryImage.setAttribute("height", "90");
        galleryImage.setAttribute("width", "60");
        galleryImage.setAttribute("class", "gallery_image");
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
    image.setAttribute("src", `http://noi-sd.s3-website-eu-west-1.amazonaws.com/${token}/${id}.png`);
    image.setAttribute("height", "448");
    image.setAttribute("width", "986");
    image.setAttribute("id", "generated_image");
    image.setAttribute("alt", `Generated image number 0`);
    document.getElementById("generated_image_container").appendChild(image);
}

function captchaVerify(token) {
    hcaptchaToken = token

    //enable buttons
    document.getElementById('generate_portrait').disabled = false
    document.getElementById('generate_landscape').disabled = false
    document.getElementById('example_button_1').disabled = false
    document.getElementById('example_button_2').disabled = false
    document.getElementById('example_button_3').disabled = false
    document.getElementById('example_button_4').disabled = false

}

function captchaExpiered() {
    hcaptchaToken = null

    // disable buttons
    document.getElementById('generate_portrait').disabled = true
    document.getElementById('generate_landscape').disabled = true
    document.getElementById('example_button_1').disabled = true
    document.getElementById('example_button_2').disabled = true
    document.getElementById('example_button_3').disabled = true
    document.getElementById('example_button_4').disabled = true
}

function resetProgress() {
    let progressBar = document.getElementById("progress_bar");
    let progressBarGallery = document.getElementById("progress_bar_gallery");
    let progressStatus = document.getElementById("progress_status");
    progressBar.style.width = "0%";
    progressBarGallery.style.width = "0%";
    progressStatus.innerHTML = "";
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