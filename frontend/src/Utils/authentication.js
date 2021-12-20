const API = "http://localhost:8000"


 /**
* Gets a cookie.
* 
* @param {String} cname Cookie name
* @returns The cookie value
*/
 const getCookie = (cname) => {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for(let i = 0; i <ca.length; i++) {
     let c = ca[i];
     while (c.charAt(0) == ' ') {
       c = c.substring(1);
     }
     if (c.indexOf(name) == 0) {
       return c.substring(name.length, c.length);
     }
   }
   return "";
 }

export const authentication = (form) => {
  const request = (form) => {
    console.log(form)
    // alert(1)
    fetch(`${API}/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form
      }
    ).then(function(res){ return res.json(); })
    .then(function(data){ })
    .catch(e => {
      console.log("error", e)
    })
    }

  const parse = (form) => {    
    return [form.target[0].value, form.target[1].value];
  }

  const buildForm = (username, password) => {
    return `username=${username}&password=${md5(password)}`;
  }

  const md5 = (string) => {
    var MD5 = require("crypto-js/md5");
    var hash = MD5(string);
    return hash.toString()
  }

  var [username, password] = parse(form);
  form = buildForm(username, password);
  request(form)
}
