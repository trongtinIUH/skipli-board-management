const admin = require('firebase-admin');

const servicesAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(servicesAccount)
});

//khởi tạo database firestore
const db = admin.firestore();
console.log('Firebase Admin Connected Successfully!');

module.exports = {admin, db};