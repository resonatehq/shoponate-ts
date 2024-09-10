export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookie = parts.pop()?.split(";").shift();
    console.log(`Found cookie: ${cookie}`);
    return cookie;
  }
};

export const checkForCookie = (name: string): string => {
  let cookie = getCookie(name);
  if (!cookie) {
    const id = Math.random().toString(36).substr(2, 9);
    cookie = `${name}=${id}; path=/`;
    document.cookie = cookie;
    console.log(`Created cookie: ${cookie}`);
    return id;
  }
  return cookie;
};

export function timeStamp() {
  return Math.floor(Date.now() / 1000);
}
