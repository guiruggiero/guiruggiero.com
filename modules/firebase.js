import {getApp, getApps, initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, addDoc, collection, doc, updateDoc, Timestamp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore-lite.js"

// Initializations
const firebaseConfig = {
    apiKey: "AIzaSyDOa3qhxiNI_asmIo1In1UF_qNjO1qllBE",
    authDomain: "guiruggiero.firebaseapp.com",
    projectId: "guiruggiero",
    storageBucket: "guiruggiero.appspot.com",
    messagingSenderId: "49247152565",
    appId: "1:49247152565:web:eb614bed7a4cf43ed611fc"
}
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);
const env = "v1";

// Create the chat log with the first turn
export async function createLog(chatStart, turnHistory) {
    const chatRef = await addDoc(collection(db, env), {
        origin: "guiruggiero.com",
        start: chatStart,
        turnCount: 1,
        turns: turnHistory
    });
    
    return chatRef.id;
}

// Log subsequent turns
export async function logTurn(chatID, turnCount, duration, turnHistory) {
    const chatRef = doc(db, env, chatID);
    await updateDoc(chatRef, {
        turnCount: turnCount,
        duration: duration,
        turns: turnHistory
    });
}

export {Timestamp};