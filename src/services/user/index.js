import jwt from'jsonwebtoken';
import firebase from '../firebase';

const login = async (email, password) => {
    await firebase.loginWithEmailAndPassword(email, password);
    const user = firebase.currentUser();

    return createCookie(user.uid, user.email);;
}

const register = async (email, password) => {
    await firebase.registerWithEmailAndPassword(email, password);
    const user = firebase.currentUser();

    return createCookie(user.uid, user.email);;
}

const logout = async () => {
    await firebase.logOut();

    return deleteCookie();
}

const generateToken = user => {
    const token = jwt.sign(user, process.env.REACT_APP_JWT_PRIVATE_KEY);

    return token;
}

const createCookie = (uId, email) => {
    const token = generateToken({
        uId: uId,
        email: email,
    });
    
    document.cookie = "aid=" + (token || "") + "; path=/";

    return token;
};

const deleteCookie = () => {
    document.cookie = "aid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

    return cookieValue ? cookieValue[2] : null;
}

const getEmailAndIdFromCookie = () => {
    const cookieValue = getCookie('aid');
    try {
        const decodeObject = jwt.verify(cookieValue, process.env.REACT_APP_JWT_PRIVATE_KEY);
        
        return {
            uid: decodeObject.uId,
            email: decodeObject.email
        }
    } catch (e) {
        return false;
    }
}

const isLoggedIn = () => {
    const cookieValue = getCookie('aid');
    try {
        jwt.verify(cookieValue, process.env.REACT_APP_JWT_PRIVATE_KEY);
        
        return true;
    } catch (e) {
        return false;
    }
};


export default {
    login,
    register,
    logout,
    isLoggedIn,
    getCookie,
    getEmailAndIdFromCookie
};