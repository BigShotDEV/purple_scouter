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

export const isAuthenticated = (path) => {
  const request = (path) => {
    return new Promise(resolve => {
      fetch(`${API}${path}`, {
        method: "GET",
        credentials: "include",
        }
      ).then(res => {
        console.log(res.status);
        if (res.status == 400) {
          // if this running means the user tryied to access a page he doesn't allowed.
          // window.location.replace("/login");
          resolve(false);
        } else if(res.status == 200) {
          // means the user can access the page he wants to access.
          
        resolve(true);
        }
    })
    .catch(e => {
      console.log("error", e)
    })
    })
  }

  var access_token = getCookie("access_token");
  if (access_token === undefined) return new Promise(resolve => {resolve(false)});

  return request(path);
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
      credentials: "include",
      body: form
      }
    )
    .then(res => {
        if (res.status == 400) {
          // if this running means the user's login attempt failed (username or password is wrong).
          // Dan add here your shit to inform the user in a proper way.
          alert("Username or Password is wrong.");
  
        } else if(res.status == 200) {
          // if this running means the user's login attempt succeded.
          
          window.location.replace("/"); // redirect the user to the home page.
        }
    })
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
