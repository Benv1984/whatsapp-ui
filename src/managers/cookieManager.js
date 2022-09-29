import Cookies from "universal-cookie";

const cookies = new Cookies();

const setUserInfo = (userInfo) => {
  console.log(userInfo, 'cookie')
  cookies.set("userInfo", JSON.stringify(userInfo), { path: "/" });
};

const getUserInfo = () => {
  try {
    
    const userInfo = cookies.get("userInfo");
    if(typeof userInfo !== 'object') return null
    return userInfo
  } catch(err) {
    return null
  }
};

export const cookieManager = {
  setUserInfo,
  getUserInfo,
};
export default cookieManager;