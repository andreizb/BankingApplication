function historyFunc() {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener("error", function(event) {
        window.location.href = "index.html"
    });

    const url = `http://localhost:8080/oauth/check_token?token=${localStorage.getItem("access_token")}`;
    XHR.open("POST", url);
    XHR.send();

    const xml = new XMLHttpRequest();
    xml.addEventListener("load", function(event) {
        const response = JSON.parse(xml.responseText);
        loadDiv(response);
    });

    const hrl = `http://localhost:8080/transaction/get/all`;
    xml.open("GET", hrl);
    const bearer = "Bearer " + localStorage.getItem("access_token");
    xml.setRequestHeader("Authorization", bearer);
    xml.send();
}

function loadDiv(data) {
    document.getElementById("container").innerHTML = '';

    data.forEach(x => {
        var color;
        
        if (x.status == "ACCEPTED") {
            color = "#8FBC8F";
        } else if (x.status == "PENDING") {
            color = "#FFFACD";
        } else {
            color = "#FA8072";
        }

        var div = `<div class="transaction"  style="background-color: ${color};">
                <div class="content">
                    <span>${x.senderName} > ${x.receiverName}</span>
                    <span>Amount: "${x.amount}"</span>
                    <span>Date: "${x.date}"</span> 
                    <span>Description: "${x.description}"</span>
                    <span>Type: "${x.type}"</span>
                </div>
                <div class="buttons" id="${x.id}">
        `;

        if (x.status == "ACCEPTED") {
            div += `<i class="material-icons" style="font-size:60px;">check</i>`
        } else if (x.status == "REJECTED") {
            div += `<i class="material-icons" style="font-size:60px;">close</i>`
        } else {
            if (localStorage.getItem("name") == x.receiverName) {
                div += `<button onclick="approve(this)"><i class="material-icons" style="font-size:60px;">check</i></button>`;
                div += `<button onclick="reject(this)"><i class="material-icons" style="font-size:60px;">close</i></button>`
            } else {
                div += `<i class="material-icons" style="font-size:60px;">history_toggle_off</i>`;
            }
        }

        div += `</div></div>`;

        document.getElementById("container").insertAdjacentHTML("beforeend", div);
    });
}

function makeFunc() {
    window.location.href = "transaction.html"
}

function clearDiv() {
    document.getElementById("container").innerHTML = '';
}

function logoutFunc() {
    localStorage.setItem("name", "");
    localStorage.setItem("access_token", "");
    window.location.href = "index.html";
}

function approve(button) {
    const XHR = new XMLHttpRequest();

    const parent = button.parentNode;

    const id = parent.getAttribute("id");

    const borderParent = parent.parentNode;

    borderParent.style["background-color"] = "#8FBC8F";

    const url = `http://localhost:8080/transaction/update/` + id  + `?status=ACCEPTED`;

    XHR.open("POST", url);

    const bearer = "Bearer " + localStorage.getItem("access_token");
    XHR.setRequestHeader("Authorization", bearer);

    XHR.send();

    parent.innerHTML = `<i class="material-icons" style="font-size:60px;">check</i>`;
}

function reject(button) {
    const XHR = new XMLHttpRequest();

    const parent = button.parentNode;

    const id = parent.getAttribute("id");

    const borderParent = parent.parentNode;

    borderParent.style["background-color"] = "#FA8072";

    const url = `http://localhost:8080/transaction/update/` + id + `?status=REJECTED`;
    XHR.open("POST", url);

    const bearer = "Bearer " + localStorage.getItem("access_token");
    XHR.setRequestHeader("Authorization", bearer);

    XHR.send();

    parent.innerHTML = `<i class="material-icons" style="font-size:60px;">close</i>`;
}
