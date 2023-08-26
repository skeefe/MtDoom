import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore";

export default function getShapshot(colllection){
    const db = getFirestore(firebase_app)

    const [fbData, setFBData] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, colllection);
        const q = query(collectionRef);//, orderBy('createdAt','desc'));

    const unsubscribe = onSnapshot(q, querySnapshot =>{
        console.log('querySnapshot unsubscribe');
            setFBData(
                querySnapshot.docs.map((doc) => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    }
                })
            );
        });
    return unsubscribe;
    },[])

    //console.log(fbData);
    return(fbData);   
}