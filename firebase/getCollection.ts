//import React, { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, collection, getDocs, onSnapshot} from "firebase/firestore";
//onSnapshot, doc - https://stackoverflow.com/questions/71214563/how-to-get-all-documents-in-a-collection-in-firestore

/*
async function getBattles(colllection) {
    const db = getFirestore(firebase_app)
    const colRef = collection(db, colllection);
    const docsSnap = await getDocs(colRef);
    try {
        if(docsSnap.docs.length > 0) {
            docsSnap.forEach(doc => {
                console.log(doc.data());
            })
        }
    } catch (error) {
        console.log(error);
    }
}
*/

export default function getCollection(colllection) {
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const db = getFirestore(firebase_app)
            const colRef = collection(db, colllection);
            const docsSnap = await getDocs(colRef);

            let data = [];
            try {
                if(docsSnap.docs.length > 0) {
                    docsSnap.forEach(doc => {
                        data.push(doc.data());
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
            setdata(data)
            setLoading(false)

            console.log(data);
        }
        getData();
        return () => {
            data
        }
      },[])
  
      if (loading) {
        //return "...Loading"
      }
  
      return (
        data
      )
  }






    //const battles = use(getBattles(colllection));

    //console.log(colRef);

    //return colllection;//JSON.stringify(battleList);
//}

//export default async function getCollection(colllection) {
/*
let result = null;
let error = null;
*/

    //let battleList = [];
    //const querySnapshot = await getDocs(collection(db, colllection));
    //console.log(querySnapshot);
   // querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
    //    battleList.push(doc.data());
    //});

/*
try {
  result = await getDocs(doc(db, colllection), {
      merge: true,
  });
} catch (e) {
  error = e;
}
*/

/*
// construct a query to get up to 10 undone todos 
const todosQuery = query(todosCollection,where('done','==',false),limit(10));
// get the todos
const querySnapshot = await getDocs(todosQuery);

// map through todos adding them to an array
const result: QueryDocumentSnapshot<DocumentData>[] = [];
querySnapshot.forEach((snapshot) => {
result.push(snapshot);
});
// set it to state
setTodos(result);
*/