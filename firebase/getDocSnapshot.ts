import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, collection, onSnapshot, query, doc } from "firebase/firestore";

export default async function getDocShapshot(colllection, docId){
    const db = getFirestore(firebase_app)

    console.log('woot',docId);

    const [fbData, setFBData] = useState();

    //console.log('docId', docId);
    //console.log('docId-ID', docId.battleID);
    //console.log('colllection', colllection);
    
    useEffect(() => {
        //const collectionRef = collection(db, colllection);
        //const q = query(collectionRef);//, orderBy('createdAt','desc'));

        const unsubscribe = onSnapshot(doc(db, colllection, docId), (doc) => {
            setFBData((prev) => {
                return { ...prev, fbData: doc.data() }
              })
            //setFBData(fbData: doc.data());
            console.log("Current data: ", doc.data());
            return {
                ...doc.data(),
                id: doc.id
            }
        });

        return unsubscribe;
    },[])

    console.log('docData', fbData.fbData);
    return(fbData);   
}