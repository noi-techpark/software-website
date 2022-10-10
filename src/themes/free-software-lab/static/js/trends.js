const API_URL = "https://api.1006.org/524e45354e44326a67750a/0.95/";
const GET_STATUS_POLL_TIMEOUT = 5000

let hcaptchaToken = null;
let progressBar = document.getElementById("progress_bar");
let progressStatus = document.getElementById("progress_status");



const generateImage = async function (type, examplePrompt = undefined) {
    console.log('generate image');
    console.log(hcaptchaToken)


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
        // const options = {
        //     method: 'GET',
        //     headers: new Headers({'Access-Control-Allow-Origin': '*'}),
        //     mode: 'no-cors'
        // };
        // const res = await fetch(url, options);
        const res = await fetch(url, { mode: 'cors'});
        console.log(res);
        const imageToken = await res.json();
        await pollStatus(imageToken);
    } catch (e) {
        console.error("addJob error", e);
        resetProgress();
    }
}

async function pollStatus(token) {
    const url = API_URL + `getJobStatus?token=${token}`;

    let response;
    try {
        // const options = {
        //     method: 'GET',
        //     headers: new Headers({'Access-Control-Allow-Origin': '*'}),
        //     mode: 'no-cors'
        // };
        // const res = await fetch(url, options);
        const res = await fetch(url, {headers: new Headers({'Access-Control-Allow-Origin': '*'})});
        console.log(res);
        response = await res.json();
        console.log(response);
    } catch (e) {
        console.error("getStatus error", e);
        resetProgress();
    }

    if (response && response["State"] == "complete") {
        // generating finished and showing image
        showImages(response["ImageUrl"]);
    } else {
        updateState(response["Age"], response["QueueLength"]);
        setTimeout(pollStatus, GET_STATUS_POLL_TIMEOUT, token);
    }
}

function updateState(age, queueLength) {
    console.log(`age: ${age} queueLength: ${queueLength}`);

    // update progress bar
    let width = (age * 100) / ((6 * 7 * queueLength) + (6 * 7));
    console.log("progress bar witdh: " + width + "%");
    progressBar.style.width = width + "%";

    progressStatus.innerHTML = `age: ${age} queue length: ${queueLength}`;
}

function showImages(url) {
    console.log(`show images from ${url} coming soon...`);
    // reset progress bar again
    resetProgress();
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

function resetProgress(){
    progressBar.style.width = "0%";
    progressStatus.innerHTML = "";
}