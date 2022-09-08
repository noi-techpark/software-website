
let generateImage = function (prompt) {
    console.log("generate image");
    let input = document.getElementById("prompt");
    if (prompt != undefined) {
        console.log("example");

        input.value = prompt

        let generatedImage = document.getElementById("generated_image").value;

        let src = 'https://api.lorem.space/image?w=1024&h=512';
        let img = document.createElement('img');

        img.src = src
        generateImage.style = "background-image: url(https://api.lorem.space/image?w=1024&h=512)"
    }
    else {
        console.log("user");
        console.log(prompt.value)

        let generatedImage = document.getElementById("generated_image").value;

        let src = 'https://api.lorem.space/image?w=1024&h=512';
        let img = document.createElement('img');

        img.src = src
        generateImage.style = "background-image: url(https://api.lorem.space/image?w=1024&h=512)"
    }


}