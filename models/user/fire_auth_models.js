const  firebase = require('../../services/firebase');
const fireAuth = firebase.auth();
fireAuth.languageCode = 'zh_tw';

module.exports = fireAuth;