var form = document.querySelector("form");

window.addEventListener("load", function () {
    function sendData() {
        const XHR = new XMLHttpRequest();

        const username = form.elements.username.value;
        const password = form.elements.password.value;

        if (!username) {
            alert("Username shouldn't be empty!");
            return;
        }

        if (!password) {
            alert("Password shouldn't be empty!")
            return;
        }

        XHR.addEventListener("load", function(event) {
            const response = JSON.parse(event.target.responseText);

            if (response['access_token'] != undefined) {
                localStorage.setItem('access_token', response['access_token']);

                window.location.href = "user.html"
            } else {
                alert('Username or password incorrect');
            }
        });

        XHR.addEventListener("error", function(event) {
            alert('Oops! Something went wrong.');
        });

        const url = `http://localhost:8080/oauth/token?grant_type=password&username=${username}&password=${password}&scope=webclient`
        XHR.open("POST", url);
        const base64 = "Basic " + btoa("ing-client" + ":" + "client-pwd");
        XHR.setRequestHeader("Authorization", base64);
        XHR.send();
    }

    const form = document.getElementById("myForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData();
    });
});
