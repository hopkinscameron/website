
function validEmail(email) { // see:
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
// get all data in form and return object
function getFormData() {
    var elements = document.getElementById("contact-form").elements; // all form elements
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
        }
    }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function (k) {
        data[k] = elements[k].value;
    });
    console.log(data);
    return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData();         // get the values submitted in the form

    // if there is no value for the first name 
    if (!data.firstname) {
        alert("Enter your first name please.");
        return false;
    }
    // if there is no value for the last name 
    else if (!data.lastname) {
        alert("Enter your last name please.");
        return false;
    }
    // if there is no value for the email
    else if (!data.email) {
        alert("Enter your email please.");
        return false;
    }
    // if the email doesn't match the pattern
    else if (!validEmail(data.email)) {
        alert("Sorry, the email address isn't valid");
        return false;
    }
    // if there is no value for the subject
    else if (!data.subject) {
        alert("Enter a subject please.");
        return false;
    }
    // if there is no value for the message
    else if (!data.message) {
        alert("Enter a message please.");
        return false;
    }
    else {
        var url = event.target.action;  //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        // xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            console.log(xhr.status, xhr.statusText)
            console.log(xhr.responseText);
            document.getElementById('contact-form').style.display = 'none'; // hide form
            document.getElementById('thank-you-message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
    }
}
function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    var form = document.getElementById('contact-form');
    form.addEventListener("submit", handleFormSubmit, false);
};
loaded();