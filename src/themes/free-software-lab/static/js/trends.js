let hcaptchaToken = null;

let generateImage = function (examplePrompt) {
    console.log('generate image');
    console.log(hcaptchaToken)


    let promptInput = document.getElementById('prompt');
    let amountInput = document.getElementById('amount');
    let resolutionInput = document.getElementById('resolution');

    let amount = amountInput.value
    let prompt = promptInput.value
    let resolution = resolutionInput.value

    if (examplePrompt != undefined) {
        console.log('example');

        promptInput.value = examplePrompt;

        let url = `https://1006.org/sd-ws/addJob?prompt=${examplePrompt}&number=${amount}&resolution=${resolution}&hcaptcha=${hcaptchaToken}`;
        console.log(url);

        //   fetch(url).then(function(response) {
        //     return response.json();
        //   }).then(function(data) {
        //     console.log(data);
        //   }).catch(function() {
        //     console.log('Booo');
        //   });
    }
    else {
        console.log('user');

        let url = `https://1006.org/sd-ws/addJob?prompt=${prompt}&number=${amount}&resolution=${resolution}&hcaptcha=${hcaptchaToken}`;
        console.log(url);

    }
}

function captchaVerify (token){
    hcaptchaToken = token

    //enable buttons
    document.getElementById('generate_button').disabled = false
    document.getElementById('example_button_1').disabled = false
    document.getElementById('example_button_2').disabled = false
    document.getElementById('example_button_3').disabled = false
    document.getElementById('example_button_4').disabled = false

}

function captchaExpiered (){
    hcaptchaToken = null

    // disable buttons
    document.getElementById('generate_button').disabled = true
    document.getElementById('example_button_1').disabled = true
    document.getElementById('example_button_2').disabled = true
    document.getElementById('example_button_3').disabled = true
    document.getElementById('example_button_4').disabled = true
}