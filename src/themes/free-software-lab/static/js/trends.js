let hcaptchaToken = null;

let generateImage = function (prompt) {
    console.log("generate image");
    console.log(hcaptchaToken)
    let input = document.getElementById("prompt");
    if (prompt != undefined) {
        console.log("example");

        input.value = prompt

        let src = 'https://api.lorem.space/image?w=1024&h=512';
        let img = document.createElement('img');

        img.src = src
        generateImage.style = "background-image: url(https://api.lorem.space/image?w=1024&h=512)"
    }
    else {
        console.log("user");
        console.log(prompt.value)

        let src = 'https://api.lorem.space/image?w=1024&h=512';
        let img = document.createElement('img');

        img.src = src
        generateImage.style = "background-image: url(https://api.lorem.space/image?w=1024&h=512)"
    }
}

function captchaVerify (token){
    hcaptchaToken = token
}

function captchaExpiered (){
    hcaptchaToken = null
}