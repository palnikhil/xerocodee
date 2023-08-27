let utils = new Object();


utils.getCookie=(name) =>{
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
  
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
  
    return null;
}

utils.setCookie=(name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
  
    const cookieValue = encodeURIComponent(value) + (days ? `; expires=${expirationDate.toUTCString()}` : '');
  
    document.cookie = `${name}=${cookieValue}; path=/`;
  }
  
export default utils;