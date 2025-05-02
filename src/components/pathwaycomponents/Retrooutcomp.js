

import D3tree from "./D3tree"
import RetrosynthesisOutput from "./RetrosynthesisOutput";
import ExampleCanvas from "views/RDkit/ExampleCanvas";
import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router";
import { useCenteredTree, useCenteredTree2 } from "./helpers";
import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";
import {LinearProgress} from  '@mui/material'
import { addDoc, collection, doc, getDoc,getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { auth, db, uid } from "index";
import Subappbar from "ui-component/subappbar/Subappbar";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from '@firebase/storage';
import { getApp } from 'firebase/app'



const Retrooutcomp=({eid,template,Agsc,pid,uid})=>{

    const [UID,setUID] = useState('')
    const [MSG,setMSG] = useState('')
    const [DataP,setDataP]= useState([])
    const [Datast,setDatast]=useState([])
    const [allP,setallP] = useState(false)
    const [currentpath,setcurrentPath]= useState(0)
    const [Loadoff,setLoadoff] = useState(false)
    const [Cluster,setCluster] = useState(false)
    const [clusterNUM,setclusterNUM]= useState([])
    const [currentCluster,setCurrentcluster] =useState(null)
    const [clusterArr, setClusterArr] =useState([])

    console.log(template,eid)
    // const { eid, template, pid, idx } = useParams();
    const q = doc(db, template, eid);
    const q3 = doc(db, template, eid);
    const collectionref = collection(db, "intermediates");
    const q2 = query(collectionref, where("experiment_id", "==", eid));
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp);

 

  const clustering  =async(dats,uid)=>{
       let clustered = {}
       let startingmaterials= dats
       console.log(uid?.clusters?.length)
       if(uid?.clusters?.length>0){
      
       Promise.all(
        Object.entries(startingmaterials).map((data)=>{
          const val = Number(data[0])
       
          const value =uid.clusters[val]
          
          if (!clustered[value]) {
            clustered[value] = [];
        }
        clustered[value].push({...data})
      
         })
        )
         setClusterArr(clustered)
         setclusterNUM(Object.keys(clustered))
    }
       }
    



   console.log(uid)



    const fetchJsonFile =  async ({path,uid,status}) => {
        console.log(path)
       
         
        const  collect = []
        await Promise.all(path.map(async (data) => {
            console.log(path)
            if(data!=null){
            if(setMSG!=''){
                setMSG('')
            }
            const pathReference = ref(storage, data);
            const downloadURL = await getDownloadURL(pathReference);
            const response = await fetch(downloadURL).catch((err) => console.log(err));
            const finaljsonData = await response.json();
            console.log(data,finaljsonData)
            
            const countarr = Object.keys(finaljsonData).map(key => finaljsonData[key]);
            collect.push(...countarr);
            collect.sort(((a, b) => a.idx - b.idx))
            setDataP((prev)=>[...prev,...countarr.sort(((a, b) => a.idx - b.idx))])
        }
        }));
          setDatast(collect)
          if(status=='100% completed'){
          clustering(collect,uid)
          }
      }


  const viewclusterpaths= async(pathnum,clusternum)=>{
    const CPS = []

    Promise.all(clusterArr[clusternum].map((dat)=>{
        CPS.push(dat[1])
    }))
    setDataP(CPS)
    setCurrentcluster(clusternum)
    setcurrentPath(pathnum)
    setallP(false)
  }

   const getref = async () => {
       
           const querySnapshot = await onSnapshot(q,(data)=>{
            
            if(data.data().output?.info){
                setMSG(data.data().output?.info) 
            }
            else if(data.data().status=="100% completed" && data.data().paths.length==0){setMSG('No paths found for the molecule or molecule already in building blocks')}
            else if(!data.data().paths?.includes(!null)){setMSG('No paths have been Found yet')}
           let patharr = []
           setUID({...data.data()})
           console.log(data.data().status)
           console.log({...data.data()})
           if(data.data().scores){
           if(data.data().paths){
           fetchJsonFile({path:data.data().paths,uid:data.data(),status:data.data().status})
           }
           }
           else{
            if(data.data().paths){
                fetchJsonFile({path:data.data().paths,uid:data.data(),status:data.data().status})
                }
           }
            } )
          
        }


const viewall = ()=>{
    setallP(true)
    setLoadoff(true)
    setTimeout(()=>{
    setLoadoff(false)
    },200)
}

const clusterview=()=>{
    setLoadoff(true)
    if(Cluster==true){
        setDataP(Datast)
    }
    setCluster(!Cluster)
    setTimeout(()=>{
    setLoadoff(false)
    },200)
}

const PV = (pathnum)=>{
    setcurrentPath(pathnum)
    setallP(false)
}




  



   useEffect(()=>{
     getref()
   },[])



    return(
        <>
            {
            !allP?<D3tree Data={DataP} Uid={UID} cpath={currentpath} viewall={viewall}  Msg={MSG} cluster={Cluster} clusterNUM={clusterNUM} currentCluster={currentCluster}  viewclusterpaths={viewclusterpaths} Agsc={Agsc} eid={eid} template={template} pid={UID?.project_id}/>
            :
            <RetrosynthesisOutput Data={Datast} Uid={UID} PV={PV} clusterview={clusterview} cluster={Cluster} clustdata={clusterArr} viewclusterpaths={viewclusterpaths} load={Loadoff}  />
            
            }
            
        </>
    )
}
export default Retrooutcomp