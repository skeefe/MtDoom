import { useState, useEffect } from "react";
import firebase_app from "./config";
import { getFirestore, collection, getDocs} from "firebase/firestore";


// ##NOT CURRENTLY IN USE
// - Using the getSnapshot method instead.
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