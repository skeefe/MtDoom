import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";


//NOT IN USE - moved to the form-battle-report.

export default async function getDocShapshot(collection, docId){
    //console.log("colllectionName: ", collection); //Working
    //console.log("docId: ", docId); //Working

    const db = getFirestore(firebase_app)

    const [report, setReport] = useState({});
    
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, collection, docId), (doc) => {
            setReport((prev) => {
                //console.log('doc.data(): ', doc.data()); //Working
                return { ...doc.data() }
            })
        });
        
        return unsubscribe;
    },[])

    //console.log('Report', report); //Working
    return(report);   
}