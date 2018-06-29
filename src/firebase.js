import firebase from 'firebase/app';
import 'firebase/database';

const configs = {
    production: {
        apiKey: "AIzaSyApfdJ5NSzY0R_3H2zcBZ4PyQodQvhYYR8",
        authDomain: "fifa-84646.firebaseapp.com",
        databaseURL: "https://fifa-84646.firebaseio.com",
        projectId: "fifa-84646",
        storageBucket: "fifa-84646.appspot.com",
        messagingSenderId: "20654199598"
    },

    development: {
        apiKey: "AIzaSyC_tBSFSTBaYdZUIEP06pITrPGo9QagUDI",
        authDomain: "fifa-84646-test.firebaseapp.com",
        databaseURL: "https://fifa-84646-test.firebaseio.com",
        projectId: "fifa-84646-test",
        storageBucket: "fifa-84646-test.appspot.com",
        messagingSenderId: "1059361993151"
    },
};

firebase.initializeApp(configs[process.env.NODE_ENV]);

export default firebase;