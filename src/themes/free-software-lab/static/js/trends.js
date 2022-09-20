const API_URL = "https://api.1006.org/524e45354e44326a67750a/0.95/";
const GET_STATUS_POLL_TIMEOUT = 2000

let hcaptchaToken = null;


const generateImage = function (type, examplePrompt = undefined) {
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

    // start job and poll/show status until complete
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        const imageToken = data

        // start polling
        const imageUrl = pollStatus(imageToken);
        showImages(imageUrl);
    }).catch(function (error) {
        console.log(error);
    });
}

function pollStatus(token) {
    const url = API_URL + `getJobStatus?token=${token}`;

    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);

        if (data["State"] == "complete") {
            return data["ImageUrl"];
        } else {
            updateState(data["Age"], data["QueueLength"]);
            setTimeout(getStatus, GET_STATUS_POLL_TIMEOUT);
        }
    }).catch(function (error) {
        console.log(error);
    });
    return null;
}

function updateState(age, queueLength) {
    console.log(`age: ${age} queueLength: ${queueLength}`)
}

function showImages(url) {
    console.log(`show images from ${url} coming soon...`)
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