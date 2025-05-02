import Tree from "react-d3-tree";
import MainCard from "ui-component/cards/MainCard";
import './d3tree.css'
import { Accordion, AccordionDetails, AccordionSummary, Alert, AppBar, Button, CardActions, Checkbox, Chip, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, LinearProgress, Snackbar, Stack, TextField, Toolbar, Tooltip, Typography,Select,FormControl, Paper,DialogTitle,Table, TableBody,Tabs,Tab, CircularProgress,DialogContentText } from "@mui/material";
import { TableHead, TableRow, TableCell, tableCellClasses, TableContainer } from '@mui/material';
import { useLocation, useNavigate } from "react-router";
import { AddOutlined, ArrowBackOutlined, ArrowForwardOutlined, ArrowRightOutlined, CancelOutlined, CloseOutlined, Description, Download, HomeOutlined, RotateRight, Save, Visibility } from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import DwnPdf from "./Download";
import { Downpdf,DwnSVG} from "./Download";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Chemspace from '../../../assets/images/Vendorlogos/chemspace.png'
import Otava from '../../../assets/images/Vendorlogos/otava_logo.png'
import Mculelogo from '../../../assets/images/Vendorlogos/mculelogo.png'
import Chembl from '../../../assets/images/Vendorlogos/chembllogopng.png'
import Vitasm from '../../../assets/images/Vendorlogos/vitasmlablogo.png'
import Lifechemicals from '../../../assets/images/Vendorlogos/lifechemicals.png'
import Chemdiv from '../../../assets/images/Vendorlogos/chemdivlogo.webp'
import Apollo from '../../../assets/images/Vendorlogos/apollo-scientific-logo.png'
import emol from '../../../assets/images/Vendorlogos/emollogo.png'
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';

import uniqid from 'uniqid';
import Elncomponents from "./ELNcomponents/elncomponents";

//firebase imports
import ExampleCanvas from "views/RDkit/ExampleCanvas";
import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router";
import { useCenteredTree, useCenteredTree2 } from "./helpers";
import styled from "@emotion/styled";
import { purple } from "@mui/material/colors";
import { addDoc, collection, doc,updateDoc,arrayUnion, getDoc,getDocs,setDoc, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { auth, db, uid } from "index";
import Subappbar from "ui-component/subappbar/Subappbar";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from '@firebase/storage';
import { getApp } from 'firebase/app'
import { LoadingButton } from "@mui/lab";
import TotalIncomeCard from "ui-component/cards/Skeleton/TotalIncomeCard";
import { array, object } from "prop-types";
import { Box } from "@mui/system";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { prototype } from "events";



//tree node styling
const containerStyles = {
    width: "100%",
    height: '60vh',
    display: 'block',
    margin: 'auto'
};

/// template free tree
const renderForeignObjectNode2 = ({
    nodeDatum,
    foreignObjectProps2,
    ColorButton,
    handleCheckbox,
    handleintermdialog,
    handlenodedialog,
    checkboxstate,
    setcheckboxalertdialog,
    handlesmilesCopysnack,
    setSharexpdialog,
    getprojects,
    treeobj,
    UID

}) => (
    <>
    
        <foreignObject {...foreignObjectProps2}>
            <Card sx={{ backgroundColor: 'whitesmoke', border: `4px solid ${nodeDatum.color}` }}  raised={true}>
                  {/*  Copy smiles tool tip  */}
                  <Tooltip title='copy Smiles'>        
                                <ContentCopyRoundedIcon  sx={{opacity:'0.1', fontSize: '1.25rem' , position:'absolute', left:'163px'}}  
                                     onClick={()=>{navigator.clipboard.writeText(`${nodeDatum.smile}`);
                                        handlesmilesCopysnack(); }}/>
                           </Tooltip>
            <div onClick={(nodeDatum.id == 0) ? () => { } : () => handlenodedialog({ smile: nodeDatum.smile, building_block_path: nodeDatum.building_block_path,score:nodeDatum.score })}>           
                <ExampleCanvas structure={nodeDatum.smile}  />
            </div>
                <CardActions sx={{ padding: '0px' }}>
                {  
                        (nodeDatum.id != 0) &&
                            
                            <Grid container >
                                <Grid item  xs={12}  >
                                    <ColorButton size='small'   onClick={ (UID.uid == auth.currentUser.uid)?() => { handleintermdialog({ smile: nodeDatum.smile,nodeid:nodeDatum.id }) }
                                    :() => {setSharexpdialog(true)
                                            getprojects()}} 
                                    
                                    key={nodeDatum.smile + nodeDatum.id}
                                    style={{ width: '100%' }}
                                    >
                                        More Routes
                                    </ColorButton>
                                </Grid>
                            </Grid>
                    }
                </CardActions>
            </Card>

        </foreignObject>
    </>
)

// template based tree
const renderForeignObjectNode = ({
    nodeDatum,
    foreignObjectProps,
    referenceProps,
    handlereferencedialog,
    handlesmilesCopysnack,
    handlenodedialog,
    ColorButton,
    handleintermdialog,
    handleCheckbox,
    checkboxstate,
    setcheckboxalertdialog,
    setSharexpdialog,
    getprojects,
    previw,
    treeobj,
    Agsc,
    UID
}) => (
    <>
        {(nodeDatum.reference == "False") ?
            <>
                <foreignObject {...foreignObjectProps}>
                    <Card sx={{ backgroundColor: 'whitesmoke', border: `4px solid ${nodeDatum.color}` }} raised={true}>
                        {/*  Copy smiles tool tip  */}
                        <Tooltip title='copy Smiles' >        
                                <ContentCopyRoundedIcon  sx={{opacity:'0.1', fontSize: '1.25rem' , position:'absolute', left:'163px', WebkitAppearance:'none',}}  
                                     onClick={()=>{navigator.clipboard.writeText(`${nodeDatum.smile}`);
                                        handlesmilesCopysnack(); }}/>
                           </Tooltip>
                        <div onClick={(nodeDatum.id == 0) ? () => { } : () => handlenodedialog({ smile: nodeDatum.smile, building_block_path: nodeDatum.building_block_path,  score:nodeDatum.score })}>

                            <ExampleCanvas
                                onClick={(nodeDatum.id == 0) ? () => { alert('not valid') } :
                                    () => handlenodedialog({
                                        smile: nodeDatum.smile,
                                        uspto_link: nodeDatum.uspto_link,
                                        usid: nodeDatum.usid,
                                        building_block_path: nodeDatum.building_block_path,
                                        score:nodeDatum.score
                                    })
                                }
                                structure={nodeDatum.smile} />
                        </div>
                        {
                           (!previw && nodeDatum.reference=='False' && !Agsc) &&
                            <CardActions sx={{ padding: '0px' }}>
                                

                            {
                                    (nodeDatum.id == 0) ? <Grid container>
                                        <Grid item xl={8} md={8} xs={8} sm={8}>
                                            {
                                                !Agsc  &&<Button
                                                size='small'
                                                fullWidth={true}
                                                key={nodeDatum.smile + nodeDatum.id}
                                                disabled={true}
                                                sx={{ color: 'white' }}
                                            >
                                                More Routes
                                            </Button>}
                                        </Grid>
                                        {/* <Grid item xl={4} md={4} xs={4} sm={4} sx={{ textAlign: 'center', display: 'none' }}>
                                            <Checkbox
                                                disabled={true}
                                                sx={{ padding: '2px 0px 2px 2px' }} />
                                        </Grid> */}
                                    </Grid> :


                                        <Grid container>
                                            <Grid item  xs={12} minWidth={'100%'} >
                                                <ColorButton size='small' fullWidth={true}
                                                    onClick={
                                                        (UID.uid == auth.currentUser.uid)?() => { 
                                                            handleintermdialog({ smile: nodeDatum.smile ,nodeid:nodeDatum.id })
                                                              }
                                                        :() => {setSharexpdialog(true)
                                                                 getprojects()}}
                                                >More Routes</ColorButton>
                                            </Grid>
                                            
                                        </Grid>
                                
                            }
                            </CardActions>
                        }
                    </Card>

                </foreignObject>

            </>
            :
            <foreignObject {...referenceProps}>
            {
                ((UID.scores =='true'|| UID.scores== undefined)&& !Agsc) && <Button
                    variant="outlined"
                    sx={{
                        WebkitAppearance:'none',
                        backgroundColor: 'whitesmoke',
                        color: "#323259",
                        borderColor:"#323259",
                        '&:hover': {
                            backgroundColor: 'whitesmoke',
                        }
                    }}
                    onClick={() =>{

                        const reactants = []
                        nodeDatum.children.map((data)=>{
                            reactants.push(data.smile)
                        })
                        const reaction = `${reactants.join('.')}>>${nodeDatum.smile}`

                        handlereferencedialog({
                            title: nodeDatum.title,
                            route_score: nodeDatum.route_score,
                            rxn_score: nodeDatum.rxn_score,
                            procedure: nodeDatum.procedure,
                            usid: nodeDatum.usid,
                            reaction_class:nodeDatum.reaction_class,
                            reaction_name: nodeDatum.reaction_name,                                                 
                            step_yield:nodeDatum.step_yield, 
                            fwd_score:nodeDatum.fwd_score,  
                            uspto_link: nodeDatum.uspto_link,
                            reaction:reaction,
                            pathid:treeobj,
                            nodeid:nodeDatum.id
                        })}
                    }
                >
                    Reference
                </Button>
            }
            </foreignObject>

        }

    </>
);
var token;

export default function D3tree({Data,Uid,cpath,viewall,Loading,Msg,cluster,clusterNUM,currentCluster,viewclusterpaths,Agsc,eid,template,pid}) {
    {/*set tree translation */ }
    const [translate, containerRef] = useCenteredTree();
    const [translate2, containerRef2] = useCenteredTree2();
    const [treezoom, settreezoom] = useState(true);
    {/*data storage */ }
    const [referencedata, setReferenceData] = useState([]);
    const [nodedialogdata, setNodedialogData] = useState([]);
    const [Vendorsdata,setVendorsdata] = useState([])
    const [Pathsfound,setPathsfound] = useState('')
    {/*main tree output */ }
    {/*dialogs */ }
    const [referencedialog, setReferencedialog] = useState(false);
    const [refusid,setrefusid] = useState([])
    const [reftitle, setreftitle]  = useState([])
    const [refprocedure,setrefprocedure] = useState([])
    const [reflink, setreflink] = useState([])
    const [refdialog,setrefdialog] =useState(false)
    const[X,setX]=useState('')
    const [nodedialog, setnodedialog] = useState(false);
    const [intermdialog, setIntermdialog] = useState(false);
    const [advancedsearch, setAdvancedsearch] = useState(5);
    const [Dwndiag,setDwndiag] = useState(false)
    {/*massionary */ }
    const [intermsmile, setIntermsmile] = useState('');
    const [experimentname, setExperimentname] = useState('');
    const [buttonloading, setButtonloading] = useState(false);
    const [buttonloading2, setButtonloading2] = useState(false);
    {/*setinterm update object */ }
    const [treeobj, settreeobj] = useState({});
    const [checkboxstate, setCheckboxstate] = useState(null);
    const [updateobject, setUpdateobject] = useState({});
    const [inrespid, setinrespid] = useState('');
    const [intermoutput, setintermoutput] = useState([]);
    const [ShowmoreRoutes, setShowmoreRoutes] = useState(false)
    const [Pnodeid, setPnodeid] = useState('')
    const [runupdate,setrunupdate] = useState(false)
    const [previw, setPreviw] = useState(false)
    const [saveAlert, setsaveAlert] = useState(false)
    const [Minimize,setMinimize] = useState(false)

    {/*path count */ }
    // const [sampledata, setSampledata] = useState({});
    const [pathcount, setPathcount] = useState(0);
    const [pathdata, setPathdata] = useState([]);
    const [incrementbuttonstate, setincrementbuttonstate] = useState(false)
    // const [sampledataref, setSampledataref] = useState();

     {/*share experiments */ }
     const[ShareExpdialog,setSharexpdialog] = useState(false)
     const[projectsData ,setprojectsData]  = useState([])
     const [age, setAge] = useState('')
     const [projectid, setprojectid] = useState('')
     const [alertinit, setalertinit] = useState(false);
     const [Sexperimentname,setSexperimentname]  = useState('');
     const [Sexperimentsnack,setSexperimentsnack] = useState(false)
     const [UID,setUID] = useState('')
     const [MSG,setMSG] = useState('')
     const [reftab,setreftab]= useState('scores')
     const [Scorereqsend,setScorereqsend] = useState(false)
     const [Energyvalue,setEnergyvalue] = useState({})
     const [clusterval,setclusterval] = useState(null)
     const [ElNopen , setELNopen]= useState(false)
     const [ELNdata, setELNdata] = useState({name:'',description:''})
     const [showErrMsg,setshowerrMsg] = useState(false)
     const [errorMsg,setErrorMsg]= useState('')
     const [ELNPATH,setELNPATH] = useState({})
     const [Elsnack,setElsnack] =useState(false)
   
   
   
     {/*snack bar state*/ }
    const [savesnackstate, setsavesnackstate] = useState(false)
    const [experimentnamedialog, setexperimentnamedialog] = useState(false)
    const [smilesCopysnack,setsmilesCopysnack] = useState(false)
    {/*progress */ }
    const [progress, setprogress] = useState(false);
    const [checkboxalertdialog, setcheckboxalertdialog] = useState(false);
    const theme = useTheme()
    const navigate = useNavigate()
    // const { eid, template, pid, idx } = useParams();
    const location = useLocation();
    const nodeSize = { x: 190, y: 180 };
    const nodeSize2 = { x: 190, y: 180 }
    const foreignObjectProps = {
        width: nodeSize.x,
        height: nodeSize.y,
        x: -80,
        y: -17,
    };
    const foreignObjectProps2 = {
        width: nodeSize2.x,
        height: nodeSize2.y,
        x: -80,
        y: -10,
    };
    const referenceProps = {
        width: nodeSize.x,
        height: nodeSize.y,
        margin: '10px',
        x: -50,
        y: 70,
    };
    const referenceProps2 = {
        width: nodeSize2.x,
        height: nodeSize2.y,
        x: -120,
        y: -45,
    };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.secondary.light,
          color: "#323259",
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
    
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover, 
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
    
    
      const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText('#501f84'),
            backgroundColor: '#501f84',
            '&:hover': {
              backgroundColor: '#7030b3',
            },
      }));
    
      const ColorButton2 = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText('#0095ff'),
        backgroundColor:"black",
        '&:hover': { backgroundColor: '#000000bd'}
      }));
      const DelButton = styled(Button)(({ theme }) => ({
        color: 'white',
        backgroundColor:"red",
        '&:hover': { backgroundColor: '#ff0000a8'}
      }));

      const iconstyles = {
        color: 'white'
    }
    const iconstyle2 = {
        color: "#323259"
    }
    const iconstyle3 =  {
        color: "#323259",
        padding:'2px'
    }





    {/*get unique token function*/ }
    const func = async () => {
        const auth = await getAuth();
        const { currentUser } = auth;
        token = await currentUser.getIdToken(/* forceRefresh */ false);
    }
    const handlereferencedialog = ({ ...data }) => {
        console.log({...data })
        setReferencedialog(true);
        setReferenceData([{ ...data }]);
        setrefusid([...data.usid].slice(0,50))
        setreflink([...data.uspto_link.slice(0,50)])
        setrefprocedure([...data.procedure.slice(0,50)])
        setreftitle([...data.title.slice(0,50)])     
        
    }
    const handlenodedialog = ({ ...data }) => {
        setnodedialog(true)
        setNodedialogData([{ ...data }])
        console.log(data)
        if (template == 'retrosynthesis'){
        if (data.building_block_path!= "None"){
            setVendorsdata([...data.building_block_path])}}
        else{
            if (data.building_block_path!= "None"){
                setVendorsdata([...data.building_block_path])}} 
        }
        
        console.log(UID.scores)
        
   

   console.log(uid)



    const handleintermdialog = ({ smile, nodeid }) => {
        setIntermdialog(true)
        setIntermsmile(smile)
        setPnodeid(nodeid)
    }
    const handlezoom = () => {
        settreezoom(!treezoom)
    }
    const handleCheckbox = (data) => {
        setCheckboxstate(data);
    }

    const handlesmilesCopysnack = ()=>{
        setsmilesCopysnack(true);
    }

    console.log(template,eid)

    // experiment queries
    const q = doc(db, template, eid);
    const q3 = doc(db, template, eid);
    const collectionref = collection(db, "intermediates");
    const q2 = query(collectionref, where("experiment_id", "==", eid));

    //handle disabling check

     // handle ShareExperimentdialogue project
  
  const getprojects= () => {
    const q = query(collection(db, 'projects'), where("owner.uid", "==", auth.currentUser.uid));
    const projects = []
    getDocs(q).then((snapshot) => {
      snapshot.docs.forEach((doc) => { projects.push({ ...doc.data(), id: doc.id }) });
      setprojectsData(projects);
    }).catch((err) => console.log(err));
  }

  const handleChange = (event) => {
        setAge(event.target.value);
        setprojectid(event.target.value);
        setalertinit(false);
      };

 const SubmitExperiment  = async()=>{
    alert(Sexperimentname)


    let x = UID
    delete x.resid
    delete x.uid
    delete x.project_id
    delete x.createdAt
    delete x.expname

 
   await addDoc(collection(db, template), {
    expname:Sexperimentname,
   ...x,
   uid:auth.currentUser.uid,
   project_id:projectid,
   createdAt :serverTimestamp()
   }
  ).catch((err) => console.log(err))
  .then((resid)=>{console.log(resid)})
  .then(()=>{setSexperimentsnack(true)
            setSexperimentname('')
            setAge('');})
}
    

console.log(auth.currentUser.uid)


const ElNfunction = async()=>{
   
if(ELNPATH!={}){
   
  await  addDoc(collection(db, "elnprojects"), {
    "Project_name":ELNdata.name,
     "Description":ELNdata.description,
     "pathidx":ELNPATH.idx,
     "retroExperimentId":eid,
     "Expprojectid":pid,
     createdAt:serverTimestamp(),
     uid:auth.currentUser.uid
}).then(async(res)=>{
  const steps = await Elncomponents({treedata:ELNPATH})
  console.log(steps)
Promise.all(
    steps.reverse().map(async(data, index)=>{
       
        await addDoc(collection(db, "elnexperiments"), {
            "Experiment_name":ELNdata.name+"_"+index,
             "Product":data.Product,
             "reactants":data.reactants,
              "reaction":data.reaction,
             "procedure":data.procedure,
             createdAt:serverTimestamp(),
             projectid:res.id,
             uid:auth.currentUser.uid
        }
    )
    }
  )
)}).then(async()=>{
    console.log(ELNPATH.idx)
    if(ELNPATH?.path?.ELN==undefined){
      await setDoc(doc(db,'retrosynthesis',eid),{ElNrequested:[ELNPATH.idx]},{merge:true})
    }
    else{
       await updateDoc(doc(db,'retrosynthesis',eid), {
         ElNrequested: arrayUnion(ELNPATH.idx)
    })
  }
 }
)
}
setELNdata({})
setELNopen(false)
setElsnack(true)
setTimeout(()=>{
    setElsnack(false)
},2000)
}

console.log(ELNPATH)











console.log(referencedata)

    // experiment output
    const getExperimentoutput = async () => {
        setintermoutput([])
        await getDoc(q).then((snapshot) => {
            
             settreeobj({ ...snapshot.data().output.top_0.path });
        }).catch((err) => console.log(err));
    }

    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp);
    
    const fetchJsonFile =  async () => {
        // console.log(path)
       
         
        // const  collect = []
        // await Promise.all(path.map(async (data) => {
        //     console.log(path)
        //     if(data!=null){
        //     const pathReference = ref(storage, data);
        //     const downloadURL = await getDownloadURL(pathReference);
        //     const response = await fetch(downloadURL).catch((err) => console.log(err));
        //     const finaljsonData = await response.json();
        //     console.log(data,finaljsonData)
            
        //     const countarr = Object.keys(finaljsonData).map(key => finaljsonData[key]);
        //     collect.push(...countarr);
        //     collect.sort(((a, b) => a.idx - b.idx))
        // }
        // }));

        console.log(Data)
        console.log(cpath)

        if (Data.length>0){
         setPathdata(Data.sort((a,b)=>a.idx-b.idx))
         if (pathdata.length == 1) {
            setincrementbuttonstate(true)
         }
        setPathcount(cpath) 
        settreeobj(Data[cpath]) 
        setButtonloading(false)   
        }
        
      }


      useEffect(()=>{
       setUID(Uid)
      },[Uid])
      

   console.log(cpath)

   const getref = async () => {
    setButtonloading(true)
       
//            const querySnapshot = await onSnapshot(q,(data)=>{
//             console.log(data)
//             console.log(data.data().paths)
//             console.log(data.data())
//             if(data.data().output?.info){
//                 setMSG(data.data().output?.info) 
//             }
//             else if(data.data().status=="100% completed"){setMSG('No paths found for the molecule or molecule already in building blocks')}
//             else{setMSG('No paths have been Found yet')}
//            let patharr = []
//            setUID({...data.data()})
//            console.log(data.data().status)
//            if(data.data().paths){
//            fetchJsonFile({path:data.data().paths})
//            }
//             } )
           setUID(Uid)
           fetchJsonFile()
        }

    console.log(UID.uid)

    const getlocationdata = () => {
        if (location?.state?.path) {
            setUID({uid:location.state.uid})
            setPathcount(location.state.path.idx )
            getref()
        } else {
            // getExperimentoutput();

            getref()
        }
    }

    
    const incrementfun = () => {

        if (pathdata.length < 1) {
            setincrementbuttonstate(true)
        } else {
            let len = pathdata.length - 1
            if (pathcount < len || pathcount == 0) {
                let inc = pathcount + 1
                setPathcount(pathcount + 1)
                settreeobj(pathdata[inc])
            }
        }
    }
    const decrementfun = () => {
       
        if (pathcount > 0) {
            if (pathdata.length < 1) {
                setincrementbuttonstate(true)
            }
            setPathcount(pathcount - 1)
            let inc = pathcount - 1
            settreeobj(pathdata[inc])
        }
    }

   
  
    
    // get intermediet output
    const getintermoutput = async (resid) => {
        const docRef = onSnapshot(doc(db, "intermediates", resid),
            (doc) => {
                setintermoutput([{
                    output: { ...doc.data().output },
                    id: doc.id,
                    status: doc.data().status,
                    target_mol: doc.data().target_mol,
                    parentnodeid:doc.data().parentnodeid,
                    pathid:doc.data().pathid
                }]);
            })
    }

// submit intermsmile
const submitIntermsmile = async () => {
    
    
    setintermoutput([])
    if (template == 'retrosynthesis') {
        addDoc(collection(db, "intermediates"), {
        
      
            type: "intermediates",
            target_mol: intermsmile,
            max_steps: advancedsearch,
            single_step: true,
            createdAt: serverTimestamp(),
            experiment_id: eid,
            status: 'pending',
            uid:auth.currentUser.uid ,
            pathid:`${treeobj.idx}`,
            parentnodeid:`${Pnodeid}`
        })  
        
         .then(async (res) => {
              console.log(res.id)
            setinrespid(res.id);
            await axios.post('https://reboltapis.boltchem.com/v1/retrosynthesis/retrosyn_test', {
                "experiment_id": res.id,
              "target_mol": intermsmile,
              "single_step": "true",
              "max_steps": 5,
              "yield":"Yield",
              "mode":"all",
              "custom_starting_materials": "false",
              "file_path": ['none'],
              "tokenid": token,
              "cas": "false",
              "cas_no": "",
              "exclude_toxic": "false",
              "custom_toxic_materials": "false",
              "custom_toxic_materials_path": ""
            })
            getintermoutput(res.id)
        })
            .then(() => setIntermsmile(''))
            .catch((err) => { console.log(err) })
           
    }
    else if(template == "retrosynthesis_tf"){
        addDoc(collection(db, "intermediates"),{
            type: "intermediates",
            target_mol: intermsmile,
            max_steps: advancedsearch,
            single_step: true,
            createdAt: serverTimestamp(),
            experiment_id: eid,
            status: 'pending',
            parentnodeid:`${Pnodeid}`,
            pathid:`${treeobj.idx}`,
            uid: auth.currentUser.uid,
            "custom_starting_materials": "false",
            "file_path": ["none"],
            "tokenid": token,
            "cas": "false",
            "cas_no": "",
            "exclude_toxic": "false",
            "custom_toxic_materials": "false",
            "custom_toxic_materials_path": ""
        }).then((res) => {
            setinrespid(res.id);
             axios.post("https://reboltapis.boltchem.com/v1/retrosynthesis/retrosyn_tf_test",
              {
                "experiment_id": res.id,
                "target_mol": intermsmile,
                "single_step": "true",
                "mode": "all",
                "max_steps": 5,
                "tokenid": token,
                "custom_starting_materials": "false",
                "file_path": ['none'],
                "cas":  "false",
                "cas_no": "",
                "exclude_toxic":  "false",
               "custom_toxic_materials":  "false",
                "custom_toxic_materials_path":""
            })
            getintermoutput(res.id)
        })
            .then(() => setIntermsmile(''))
            .catch((err) => console.log(err))
    }
    else if(template == "retrosynthesis_st"){
        setintermoutput([])
       
        addDoc(collection(db, "intermediates"),{
            type: "intermediates",
            target_mol: intermsmile,
            max_steps: advancedsearch,
            single_step: "true",
            createdAt: serverTimestamp(),
            experiment_id: eid,
            status: 'pending',
            parentnodeid:`${Pnodeid}`,
            pathid:`${treeobj.idx}`,
            uid: auth.currentUser.uid,
            "custom_starting_materials": "false",
            "file_path": ["none"],
            "tokenid": token,
            "cas": "false",
            "cas_no": "",
            "exclude_toxic": "false",
            "custom_toxic_materials": "false",
            "custom_toxic_materials_path": ""
        }).then((res) => {
            setinrespid(res.id);
             axios.post("https://reboltapis.boltchem.com/v1/retrosynthesis/retrosyn_semitemplate",
              
                {
                    "experiment_id": res.id,
                    "target_mol": intermsmile,
                    "single_step": "true",
                    "mode": "all",
                    "max_steps": 5,
                    "tokenid": token,
                    "custom_starting_materials": "false",
                    "file_path": ['none'],
                    "cas":  "false",
                    "cas_no": "",
                    "exclude_toxic":  "false",
                   "custom_toxic_materials":  "false",
                    "custom_toxic_materials_path":""
                }
            )
            getintermoutput(res.id)
        })
            .then(() => setIntermsmile(''))
            .catch((err) => console.log(err))

    }
    setTimeout(() => {
        setIntermdialog(false);
    }, 3000);
} 




    const projectref = collection(db, 'copies');
    const projectref2 = collection(db, 'tfcopies');
    const projectref3 = collection(db,'stcopies')
    const savetree = async () => {
        if (experimentname != '' && experimentname != undefined) {
            if (template == 'retrosynthesis') {
                setButtonloading(true)
                await addDoc(projectref, {
                    createdAt: serverTimestamp(),
                    uid: auth.currentUser.uid,
                    pid: pid,
                    experiment_id: eid,
                    output: treeobj,
                    experimentname: experimentname
                })
                    .then(() => {

                        setexperimentnamedialog(false)
                        setExperimentname('')
                    })
                    .catch((err) => console.log(err))
                setButtonloading(false)
                setsavesnackstate(true)
            } 
            else if(template=='retrosynthesis_st') {
                {
                    setButtonloading(true)
                    await addDoc(projectref3, {
                        createdAt: serverTimestamp(),
                        uid: auth.currentUser.uid,
                        pid: pid,
                        experiment_id: eid,
                        output: treeobj,
                        experimentname: experimentname
                    })
                        .then(() => {
    
                            setexperimentnamedialog(false)
                            setExperimentname('')
                        })
                        .catch((err) => console.log(err))
                    setButtonloading(false)
                    setsavesnackstate(true)
                } 
            }
            else {
                setButtonloading(true)
                await addDoc(projectref2, {
                    createdAt: serverTimestamp(),
                    uid: auth.currentUser.uid,
                    pid: pid,
                    experiment_id: eid,
                    output: treeobj,
                    experimentname: experimentname
                })
                    .then(() => {

                        setexperimentnamedialog(false)
                        setExperimentname('')
                    })
                    .catch((err) => console.log(err))
                setButtonloading(false)
                setsavesnackstate(true)
            }

        } else {
            setexperimentnamedialog(true)
        }
    }
    const updateFinalsave = (data) => {
        setButtonloading2(true)
        let ids = [Pnodeid]
        let mainArray = [data]
        const childrentest = false
        mainArray
            .forEach(
                function iter(a) {
                    
                    if (ids.includes(`${a.id}`)) {
                        a.children = updateobject.children;
                        a.disabled = !childrentest
                    } else {
                        a.disabled = !childrentest
                        Array.isArray(a.children) && a.children.forEach(iter);
                    }
                }
            );
        settreeobj({...treeobj,path:{ ...mainArray[0] }});
        setrunupdate(false)
        setUpdateobject({})
        setTimeout(() => {
            setButtonloading2(false)
        }, 3000)
        // setPreviw(true)
    }

    useEffect(()=>{
        if(runupdate){
            updateFinalsave(treeobj.path)
        }
    },[updateobject])

    const handleupdateobject = ({data,parid,pathid}) => {
       
        if(pathid==treeobj.idx.toString()){
        setPnodeid(parid)
        setUpdateobject({})
        let dataupdateobject = [{ ...data }]
        dataupdateobject
            .forEach(
                function iter2(a) {
                    a.id = uniqid()
                    Array.isArray(a.children) && a.children.forEach(iter2);
                }
            );
        setrunupdate(true)
        setUpdateobject({ ...dataupdateobject[0] })}
        else{
            setcheckboxalertdialog(true)
        }

    }

    
   console.log(translate)

   const EBfunction = async(reaction)=>{
        setScorereqsend(true)
         await axios.post( 'https://energybarrier.boltzmann.co/ReactionBarrierPrediction',
            {
                mode: "cyclo",
                experiment_id: eid,
                tokenid: token,
                rxn_smile: reaction
              }
         ).then((response)=>{
            setEnergyvalue(response.data[0])
            setScorereqsend(false)
            console.log(response)})
   }

   const proreqsubmit= async()=>{
    try{
    await axios.post('https://reboltapis.boltchem.com/v2/retrosynthesis/PathwayProcedures',{
        "experiment_id": eid,
        "tokenid": token,
        "retro_flow": "tb",
        "pathway_idx": treeobj.idx,
        "path": treeobj
    })
    await updateDoc(doc(db,'retrosynthesis',eid), {
        paths_pro_req: arrayUnion(treeobj.idx)})
    }
    catch(err){
         console.log(err)
         console.log('there is an error submitting Request')
    }
   }

   const ProcedureReq= ({pathinfo,pathid})=>{
    console.log(pathinfo)
    if(pathinfo.paths_pro_req!=undefined){
    const pathReq =pathinfo.paths_pro_req
    const PathAvail=pathinfo.paths_pro_available
     if(pathReq.includes(pathid) && !PathAvail.includes(pathid)){
        return(
            <Typography sx={{marginLeft:'10px', color:'orange !important'}}>Requested</Typography>
        )
     }
     else if(pathReq.includes(pathid) && PathAvail.includes(pathid)){
        return(
            <Typography sx={{marginLeft:'10px',color:'green !important'}}>Available</Typography>
        )
     }
     else{
        return <Button size='small' onClick={proreqsubmit}  sx={{marginLeft:'10px'}}color='secondary' variant='outlined'>Request</Button>
     }
   }
}

console.log(UID)


  

 

   useEffect(()=>{
    getref()
    setclusterval(currentCluster)
   },[Data])
 
   console.log(Data)
   console.log(clusterval)

   useEffect(()=>{
    setMSG(Msg)
   },[Msg])

    useEffect(() => {
        // getExperimentoutput();
        // getintermoutput();
        // getref();
        var activesubscription = true;
        if (activesubscription) {
            getlocationdata();
            func();
        }
        return () => {
            activesubscription = false
        }
    }, [])
    // console.log(treeobj)
    // console.log(treeobj.idx)
     console.log(treeobj)
    return (
        <>
       
          <Subappbar
                icon1={!Agsc && <ArrowBackOutlined sx={iconstyle2} />}
                crexpicon={!Agsc? 'New Experiment':undefined}
                tooltip1="create new experiment"
                title="Retrosynthesis path view"
                navigate1={      
                  (UID.uid == auth.currentUser.uid) ? 
                   () => navigate( `/Experiments/${pid}`,{state:{template:template}}):
                   () => {
                       navigate( `/SharedExperiments`)}}
                navigate3={() => navigate('/Rebolt/Experimentsroot')}
            />

             <Grid container spacing={2}>
             <Grid item xl={(intermoutput.length > 0 && Minimize==false ) ? 8 : 12} md={(intermoutput.length > 0 && Minimize==false ) ? 6 : 12} style={{ transition: 'ease-in-out' }} sm={12} xs={12}>
                    <MainCard sx={{ position: 'sticky', top: '90px', display: 'block' }}>
                        <AppBar position="static" sx={{ margin: '0px', backgroundColor: 'white' }}>
                            <Toolbar variant="dense" sx={{ display: 'flex', verticalAlign: 'center' }}>
                                <Tooltip title='View all routes' >
                                    <Button variant='outlined' sx={Object.keys(treeobj).length==0 ? {display: 'none'}:{color: "#323259",borderColor:"#323259"}}
                                     onClick={viewall}>all Paths </Button>
                                </Tooltip>
                                <Box sx={{ flexGrow: '1', textAlign:'center' }}>
                                {
                                    cluster &&  
                                    <FormControl sx={{width:'200px'}}>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={clusterval}
                                    
                                    MenuProps = {{
                                            PaperProps: {
                                                style: {
                                                height:200,
                                                borderBottomLeftRadius:10,
                                                borderBottomRightRadius:10
                                                },
                                            },
                                            }}
                                    size='small'
                                    onChange={(event)=>{
                                        viewclusterpaths(0,Number(event.target.value))
                                    }}
                                >
                                {clusterNUM.map((data)=>
                                    <MenuItem value={data}>{`Cluster ${data}`}</MenuItem>
                                )}
                                    
                                </Select>
                                </FormControl>                         }
                                </Box>
                
                            
                                <Tooltip title="save experiment">

                                    <IconButton
                                        size="small"
                                        color="secondary"
                                        variant="contained"
                                        onClick={
                                            () =>{
                                                 savetree()}}
                                        disabled={Object.keys(treeobj).length > 0 ?  false:true}
                                    >
                                        <Save  sx={iconstyle2} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Download'>
                                <IconButton
                                    size="small"
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => {setDwndiag(true) }}
                                    disabled={Object.keys(treeobj).length != 0 ?  false:true}
                                
                                >
                                    <Download sx={iconstyle2} />
                                </IconButton>
                                </Tooltip>
                            </Toolbar>
                        </AppBar>
                        { (Object.keys(treeobj).length !=0 ) &&
                        <div style={{ containerStyles }}>
                        
                            <Tooltip title='previous path'>
                                <IconButton  sx={pathcount<1 ? {visibility: 'hidden'} :{visibility:'visible'}} onClick={() => decrementfun()} ><ArrowBackOutlined sx={iconstyle2} /></IconButton>
                            </Tooltip>
                            <Typography variant='subtitle1' sx={{ display: 'inline-block',...iconstyle2 }} >Path : {pathcount + 1}</Typography>
                            <Tooltip title='Next path'>
                                <IconButton  sx={pathcount> pathdata.length-2 ? {visibility: 'hidden'} :{visibility:'visible'}} onClick={() => incrementfun()} ><ArrowForwardOutlined sx={iconstyle2} /></IconButton>
                            </Tooltip>
                            {/* <Typography variant="subtitle" component='span' style={{ flexGrow: 1 }}>{pathcount + 1}</Typography> */}
                            {/* <IconButton color="secondary" onClick={() => decrementfun()}><RemoveOutlined /></IconButton> */}
                            {/* <IconButton color="secondary" onClick={() => incrementfun()}><AddOutlined /></IconButton> */}
      
                            { !(Object.keys(treeobj).length == 0 || treeobj == {} || template!='retrosynthesis'||Agsc) && <Paper fullWidth sx={{display:'inline', borderRadius:'5px',position:'absolute',right:'10px', marginTop:'10px', marginRight:'10px' }} elevation={2}>
                         <Typography  sx={{padding:'5px',display:'block'}}> <span style={{...iconstyle2,fontWeight:'bold'}}>Estimated Cost : </span>$ {treeobj.path.path_cost.toFixed(2)}</Typography>
                         {/* <Typography  sx={{padding:'5px',display:'block'}}> <span style={{...iconstyle2,fontWeight:'bold'}}>Estimated yield : </span>{Number(treeobj.path.path_yield).toFixed(2)}</Typography> */}
                         {/* {UID.paths_pro_req!= undefined && <Typography  sx={{padding:'5px',display:'block'}}> <span style={{...iconstyle2,fontWeight:'bold', display:'flex'}}>Procedure:<ProcedureReq pathinfo={UID} pathid={treeobj.idx}/></span>
                            </Typography>} */}
                         {
                            !UID?.ElNrequested?.includes(treeobj.idx) &&
                            <Button variant='outlined' sx={{display:'inline',color: "#323259",borderColor:"#323259", borderRadius:'5px',marginTop:'10px', marginRight:'10px' , width:'100%' }} onClick={()=>{
                            setELNPATH(treeobj)
                            setELNopen(true)
                         }}>Add to ELN</Button>}
                         </Paper> }
    
                         
                        </div>}
                        <div id="TREE" style={containerStyles} ref={ containerRef }>
                            { (MSG !='')? <Typography sx={{marginLeft:'30px', marginTop:'50px',color:'red'}}>{MSG}</Typography>:
                                (Object.keys(treeobj).length == 0 || treeobj == {}) ?
                                    <LinearProgress color="secondary" />
                                    :
                                    
                                    <Tree
                                        data={treeobj.path}
                                        nodeSize={nodeSize}
                                        translate={translate }
                                        pathFunc={ 'step'}
                                        leafNodeClassName="node_leaf"
                                        zoomable={true}
                                        zoom={Agsc ? 0.45/treeobj.path.num_steps:0.65/treeobj.path.num_steps}
                                        scaleExtent={{ max: 3, min: 0.15 }}
                                        depthFactor={ '180'}
                                        collapsible={false}
                                        separation= {{ siblings: 1.8, nonSiblings: 1.8 }}
                                        enableLegacyTransitions={true}
                                        renderCustomNodeElement={(rd3tProps) =>
                                                renderForeignObjectNode({
                                                    ...rd3tProps,
                                                    foreignObjectProps,
                                                    referenceProps,
                                                    handlereferencedialog,
                                                    handlenodedialog,
                                                    navigate,
                                                    ColorButton,
                                                    handleintermdialog,
                                                    handleCheckbox,
                                                    checkboxstate,
                                                    setcheckboxalertdialog,
                                                    handlesmilesCopysnack,
                                                    UID,
                                                    Agsc,
                                                    getprojects,
                                                    setSharexpdialog,
                                                    

                                                }) 
                                                // : renderForeignObjectNode2({
                                                //     ...rd3tProps,
                                                //     foreignObjectProps2,
                                                //     referenceProps2,
                                                //     handlenodedialog,
                                                //     handleintermdialog,
                                                //     ColorButton,
                                                //     handlereferencedialog,
                                                //     foreignObjectProps,
                                                //     handleCheckbox,
                                                //     checkboxstate,
                                                //     setcheckboxalertdialog,
                                                //     handlesmilesCopysnack,
                                                //     UID,
                                                //     getprojects,
                                                //     setSharexpdialog,
                                                // })
                                        }
                                        orientation="vertical"
                                    />
                            }
                        </div>
                       { (intermoutput.length>0 && Minimize==true) &&
                        <Tooltip title="Show">
                            <IconButton
                            onClick={() => { setMinimize(false) }}
                              style={{
                              position: 'sticky',
                              bottom: '200px', 
                              left: '100%',
                              transform: 'translateX(-50%)',
                              zIndex: 1,
                             }}
                             >
                 <ArrowBackIosRoundedIcon sx={{backgroundColor:'white',...iconstyle2}}/> 
              </IconButton> 
              </Tooltip>}
                        

                    </MainCard>
                </Grid>
                {
                    (intermoutput.length>0 && Minimize==false) &&
                    <Grid item xl={4} md={6} sm={12} xs={12}>
                    <MainCard >
                         {  (intermoutput.length!= 0)?

                            
                                intermoutput.map((data) => <>
                                    <Chip color={(data.status == 'pending') ? 'warning' : 'success'} variant='outlined' label={data.status} />
                                    <TotalIncomeCard
                                        outputid={data.target_mol} outputdata={data} template={template} updateobject={(data) => handleupdateobject(data)} />
                                </>)
                            : 'no intermediates were requested'}
                            </MainCard>
                            <Tooltip title="Hide">            
                              <IconButton
                                 onClick={() => { setMinimize(true) }}
                                   style={{
                                    position: 'sticky',
                                    bottom: '200px', 
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 1,
                                   }}
                                >
                            <ArrowForwardIosRoundedIcon sx={{backgroundColor:"white",...iconstyle2}}/> 
                            </IconButton>
                           </Tooltip> 
                            </Grid>
                              }
                           </Grid>


          
    <Dialog open={referencedialog} maxWidth={'lg'} disableEscapeKeyDown={false} sx={{ marginTop: '25vh'}} onClose={()=>{setEnergyvalue({})}}>
    <DialogTitle fullWidth={true} sx={{backgroundColor: theme.palette.secondary.light, ...iconstyle2, fontWeight: 'bold', 
                                        fontSize: '1.15rem', textAlign: 'center', paddingTop: '5px', paddingBottom: '5px', boxShadow: '0px 1px 5px 0px #323259'}}>
       <Tabs  value={reftab} onChange={(e,newvalue)=>setreftab(newvalue)}
        textColor="secondary"
        indicatorColor="secondary"
       aria-label="secondary tabs example"
       >
        <Tab label ='Scores' value='scores'/>
        <Tab label ='References' value='reference'/>
       </Tabs>
    </DialogTitle>
    <DialogContent className='REflist' sx={{overflowY:'scroll', overflowX:'hidden'}}>
       
        <>
        {
        reftab=='scores' &&
        <div>
                <TableContainer elevation='4' sx={{ paddingTop: '10px' }}>
                    <Table aria-label="customized table">
                        <TableBody>
                            {["reaction_class", "reaction_name", 'fwd_score', 'step_yield'].map((data, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{data}</StyledTableCell>
                                        <StyledTableCell>
                                            <Typography sx={{padding:'9px'}}>{referencedata.length > 0 ? referencedata[0][data] : ''}</Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{display:'flex', width:'100%', gap:'20px'}}>
            <Button variant="outlined" size="small" onClick={()=>{EBfunction(referencedata[0].reaction)}} sx={{width:'20%'}}>Show Scores</Button>
            {
                Scorereqsend && Object.keys(Energyvalue).length  <=0 && 
                
                <div style={{width:'100%',textAlign:'center'}}><CircularProgress /></div>
            }
            { 
             Object.keys(Energyvalue).length>0 && <div style={{display:'flex', width:'70%', justifyContent:'space-between'}} >
                {Object.keys(Energyvalue).map((data)=><p ><span style={{fontWeight:'bold'}}>{`${data} :`}</span><span>{Energyvalue[data].toFixed(2)}</span></p>)}
            </div>}
            </div>
        </div>
        }          
    {referencedata?.length > 0 && reftab=='reference' &&
                <TableContainer className='REflist' elevation='4' sx={{ paddingTop: '10px', marginLeft: '16px' }}>
                    <Table aria-label="customized table">
                        <TableBody>
                            {refusid.map((data, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{index + 1}</StyledTableCell>
                                        <StyledTableCell>
                                            <Typography>{data}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <ColorButton onClick={() => {
                                                setrefdialog(true)
                                                setX(refusid.indexOf(data))
                                            }}>view</ColorButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
    }
           
            </>
    </DialogContent>
    <Divider />
    <DialogActions>
        <Grid container display='block' spacing={2}>
            <Grid item>
                <ColorButton2 fullWidth={true} onClick={() => {
                    setReferencedialog(false)
                    setReferenceData([]);
                    setrefusid([])
                    setreflink([])
                    setrefprocedure([])
                    setreftitle([])
                    setEnergyvalue({})
                }} endIcon={<CloseOutlined />}>Close</ColorButton2>
            </Grid>
        </Grid>
    </DialogActions>
</Dialog>



            {/*reference dialog */}
            <Dialog open={refdialog} maxWidth={'md'} disableEscapeKeyDown={false} >
            <DialogTitle fullWidth={true} sx={{backgroundColor:theme.palette.secondary.light,...iconstyle2,boxShadow:'0px 1px 5px 0px #323259', textAlign:'center',fontWeight:'bold', 
                                            fontSize:'1rem',paddingTop:'5px',paddingBottom:'5px'}}>
                                       <IconButton color="primary"  sx={X<1 && {visibility: 'hidden'}} onClick={()=>setX(X-1)}><ArrowBackOutlined  sx={iconstyle2} /></IconButton>
                                         Reference no: {X+1}
                                       <IconButton color="primary"  sx={X >= refusid.length-1 && {visibility: 'hidden'}} onClick={()=>setX(X+1)}><ArrowForwardOutlined  sx={iconstyle2} /></IconButton>
                                            </DialogTitle>
                <DialogContent sx={{maxHeight:'400px', minHeight:'400px'}} >
                    { 
                        referencedata.length>0 &&
                            <>
                                <Typography variant="h5" component='h5' sx={{paddingTop:'10px'}}>
                                <span style={{fontWeight:'bold',fontSize:'1rem',color:'black'}}> USPTOID :</span> {refusid[X]}
                                </Typography>
                                <Accordion defaultExpanded={true}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography  sx={{fontWeight:'bold',fontSize:'1rem',color:'black' }}>Title</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {reftitle[X]}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded={true}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography  sx={{fontWeight:'bold',fontSize:'1rem',color:'black'}}>
                                            Procedure
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{textAlign:'justify'}}>
                                            {refprocedure[X]}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Grid container spacing={2}>
                                    <Grid item sm={6}>
                                        <Typography variant="h6" component='h6'>
                                            
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={6} >
                                        <Typography variant="h6" component='h6'>
                                            
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                    }
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={6}>
                            <ColorButton2 endIcon={<CancelOutlined />} fullWidth={true} onClick={() => setrefdialog(false)}>
                                Close
                            </ColorButton2>
                        </Grid>
                        <Grid item sm={6} xs={6}>
                           
                                    <div style={{ display: 'block', textAlign: 'center' }}>
                                        <Typography variant="h3" component='a' sx={iconstyle2} target="blank" href={reflink[X]}>Open Link</Typography>
                                    </div>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/*node dialog*/}
            <Dialog open={nodedialog} maxWidth='xl' >
                <DialogContent>
                    <Grid container spacing={2} sx={{ width: '500px' }}>
                        <Grid item sm={6} md={6} xl={6}>
                            {
                                nodedialogdata.map((data) =>
                                    <>
                                        <ExampleCanvas structure={data.smile} />
                                    </>
                                )
                            }
                        </Grid>
                        <Grid item sm={6} md={6} xl={6}>
                        {nodedialogdata.length>0 &&
                            <p><span style={{fontWeight:'bold'}}>SA score : </span>{isNaN(nodedialogdata[0]?.score)?nodedialogdata[0]?.score:nodedialogdata[0]?.score.toFixed(3)}</p>}
                            { 
                                Vendorsdata.map((data) => {
                                    console.log(data)
                                    var Vname = data.split('/')[2]
                                     let SRC 

                              
                                    switch(Vname){
                                        case  'mcule.com' : SRC= Mculelogo;
                                        break;
                                        case 'www.vitasmlab.biz': SRC=Vitasm;
                                        break;
                                         case 'www.ebi.ac.uk':  SRC =Chembl;
                                        break; 
                                        case 'otavachemicals.com': SRC=Otava;
                                        break;
                                        case 'chem-space.com': SRC= Chemspace;
                                        break;
                                        case 'shop.lifechemicals.com': SRC=Lifechemicals;
                                        break;
                                        case 'www.chemdiv.com': SRC = Chemdiv;
                                        break;
                                        case 'search.emolecules.com': SRC = emol;
                                        break;
                                        case 'store.apolloscientific.co.uk': SRC = Apollo;
                                     }
                                     
                                
                                   
                                return(
                                    
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            <Grid item xs={6}>
                                                       <img src={SRC} style={{height:'20px',maxWidth:'100%'}} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                     <Typography variant="h3" component='a' sx={{ ...iconstyle2, fontSize:'1rem' }} target="blank" href={data}>Buy Chemical</Typography>    
                                            </Grid>
                                    </Grid>              
                                )
                                })
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Grid container spacing={2} sx={{ width: '500px' }}>
                        <Grid item sm={6} xs={12}>
                            <ColorButton2 endIcon={<CancelOutlined />} fullWidth={true} onClick={() =>{ setnodedialog(false);setVendorsdata([])}}>
                                Close
                            </ColorButton2>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* intrm dialog */}
            <Dialog open={intermdialog}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xl={12} sm={12}>
                            <TextField fullWidth={true} value={intermsmile} id="outlined-basic" label="Intermediate route" variant="outlined" onChange={(e) => setIntermsmile(e.target.value)} />
                        </Grid>
                        <Grid item xl={12} sm={12}>
                            <TextField type="number" fullWidth={true} value={advancedsearch} id="outlined-basic" label="advanced_search" variant="outlined" onChange={(e) => setAdvancedsearch(e.target.value)} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={12}>
                            <ColorButton2 endIcon={<CancelOutlined />} fullWidth={true} onClick={() => setIntermdialog(false)}>
                                Close
                            </ColorButton2>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<ArrowRightOutlined />} fullWidth={true} onClick={() => submitIntermsmile(intermsmile)}>
                                Submit
                            </ColorButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            <Dialog open={experimentnamedialog}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ width: '400px' }}>
                        <Grid item xl={12} sm={12}>
                            <TextField fullWidth={true} value={experimentname} id="outlined-basic" label="Path Name" placeholder="Enter a name for the path " variant="outlined" onChange={(e) => setExperimentname(e.target.value)} />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<CancelOutlined />} fullWidth={true} onClick={() => setexperimentnamedialog(false)}>
                                Close
                            </ColorButton>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<ArrowRightOutlined />} fullWidth={true} onClick={() => savetree(treeobj, experimentname)}>
                                Submit
                            </ColorButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            {/* save routes dialogue */}
 
            <Dialog open={experimentnamedialog}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ width: '400px' }}>
                        <Grid item xl={12} sm={12}>
                            <TextField fullWidth={true} value={experimentname} id="outlined-basic" label="Path Name" placeholder="Enter a name for the path " variant="outlined" onChange={(e) => setExperimentname(e.target.value)} />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={12}>
                            <ColorButton2 endIcon={<CancelOutlined />} fullWidth={true} onClick={() => setexperimentnamedialog(false)}>
                                Close
                            </ColorButton2>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<ArrowRightOutlined />} fullWidth={true} onClick={() => savetree(treeobj, experimentname)}>
                                Submit
                            </ColorButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

 {/* // show intermediate routes dialog */}
            <Dialog open={ShowmoreRoutes}> 
               <DialogTitle fullWidth={true} >
               <Subappbar
                                icon1={<ArrowBackOutlined sx={iconstyles} />}
                                navigate1={() => navigate(-1)}
                                title="Intermediates"
                            />              
               </DialogTitle> 
              
                <DialogContent>
                <Grid item xl={4} md={6} sm={12} xs={12}>
                        <MainCard >
                         {  (intermoutput.length!= 0)?

                            
                                intermoutput.map((data) => <>
                                    <Chip color={(data.status == 'pending') ? 'warning' : 'success'} variant='outlined' label={data.status} />
                                    <TotalIncomeCard
                                        outputid={data.target_mol} outputdata={data} updateobject={(data) => handleupdateobject(data)} />
                                </>)
                            : 'no intermediates were requested'}
                        </MainCard>
                    </Grid>
                </DialogContent>
                <DialogActions>
                <ColorButton2 endIcon={<CancelOutlined />} fullWidth={true} onClick={() => {
                    
                   settreeobj(pathdata[pathcount])
                  setShowmoreRoutes(false)}}>
                                Close
                </ColorButton2>
                </DialogActions>
            </Dialog>
  
     


            {/*geneating routes requirement error*/}
            <Dialog
                open={checkboxalertdialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Alert severity="error">cant connect to this path, intermediates are for path </Alert>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="contained" size="small" onClick={() => setcheckboxalertdialog(false)} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            

            {/* Download dialog */}

            <Dialog  open={Dwndiag} >
                <DialogContent 
                 sx={{display:'none'}} 
                 >
                   {Dwndiag && <DwnPdf  treedata={treeobj} template={template}/> }
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<Download />}  onClick={() => {setDwndiag(false)
                            DwnSVG()}}>
                                Download SVG
                            </ColorButton>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ColorButton endIcon={<Download/> } fullWidth={true} onClick={() => {
                                Downpdf({treeobj:treeobj.path})
                                setDwndiag(false)}}>
                                Download PDF
                            </ColorButton>
                        </Grid>
                        <Grid item sm={10} xs={12} >
                            <ColorButton endIcon={<CancelOutlined />}  onClick={() => {
                            setDwndiag(false)
                           }}
                            padding={12} >
                                cancel   
                            </ColorButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>



              {/*shared experiments dialogue*/}
              <Dialog
                open={ShareExpdialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <Grid>  
                <Grid item xl={6} md={6} xs={12} sm={12} marginTop='16px'>    
                      <Alert severity="info">Please Add experiment to Make changes</Alert>
                 </Grid> 
                 <Grid item xl={12} sm={12} marginTop='16px'>
                     <TextField fullWidth={true} value={Sexperimentname} id="outlined-basic" label="Experiment Name" variant="outlined" onChange={(e) => setSexperimentname(e.target.value)} />
                 </Grid>    
 
                     <Grid item xl={6} md={6} xs={12} sm={12} marginTop='16px'>
                         <FormControl fullWidth>
                         <InputLabel id="demo-simple-select-label">Select project</InputLabel>
                             <Select
                               labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Select project"
                                onChange={handleChange}
                             >
                            {
                             projectsData.map((data, index) => {
                               return <MenuItem value={data.id} index={index} key={data.id}>{data.projectname}</MenuItem>
                              }) }

                          </Select>
                      </FormControl>
                      </Grid>
                      </Grid>

             </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="contained" fullWidth={true} size="small" onClick={() =>{setSharexpdialog(false)
                    SubmitExperiment()
                    }} autoFocus>
                    Submit
                    </Button>
                </DialogActions>
                <DialogActions>
                    <Button color="secondary" variant="contained" fullWidth={true} size="small" onClick={() =>{setSharexpdialog(false)
                    setSexperimentname('')
                    setAge('')}} autoFocus>
                    cancel
                    </Button>
                </DialogActions>
            </Dialog>

            
            
            
        <Dialog open={ElNopen} onClose={()=>{
            setELNopen(false)
        }} maxWidth={'xl'}>
          <DialogContent>
            <DialogContentText sx={{marginBottom:'20px',color:'#323259',fontWeight:'bold'}}>
              Create New ELN 
            </DialogContentText>
            <Grid container spacing={2} component={Paper}>
              <Grid item sm={12} xs={12} md={12} xl={6} sx={{ width: '200px' }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="ELN Project Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="projectname"
                  onChange={(e)=>{
                    if(showErrMsg){
                        setshowerrMsg(false);
                        setErrorMsg('')
                    }
                    setELNdata((prevData) => ({
                       ...prevData,
                    name: e.target.value}));}}
                  value={ELNdata.name}
                />

              </Grid>
              <Grid item sm={12} xs={12} md={12} xl={6} sx={{ width: '200px' }}>
                <TextField
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="projectdesc"
                  onChange={(e)=>{
                    if(showErrMsg){
                        setshowerrMsg(false);
                        setErrorMsg('')
                    }
                    setELNdata((prevData) => ({
                       ...prevData,
                    description: e.target.value}));}}
                  value={ELNdata.description}
                />

                {showErrMsg && <p>{errorMsg}</p>}
              </Grid>

            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12} md={6} xl={6}>
                <ColorButton2 endIcon={<CancelOutlined />} onClick={()=>{
                    setELNdata({name:'',description:''})
                    setELNPATH({})
                    setELNdata(false)
                }} fullWidth={true} variant='outlined'>Close</ColorButton2>
              </Grid>
              <Grid item sm={6} xs={12} md={6} xl={6}>
                <ColorButton endIcon={<SubdirectoryArrowRightOutlinedIcon />} onClick={()=>{ElNfunction()}} fullWidth={true} variant='outlined'>Create</ColorButton>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>


            {/*save success snack bars */}
            {/* <Snackbar
                open={savesnackstate}
                autoHideDuration={6000}
                message={'successfully saved experiment'}
                action={
                    <>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={() => setsavesnackstate(false)}
                        >
                            <CloseOutlined />
                        </IconButton>
                    </>
                }
            /> */}

            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={savesnackstate} autoHideDuration={2000} onClose={() => { setsavesnackstate(false) }} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                    <Alert onClose={() => setsavesnackstate(false)} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        Copy of the tree was successfully saved
                    </Alert>
                </Snackbar>
            </Stack>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={smilesCopysnack} autoHideDuration={2000} onClose={() => { setsmilesCopysnack(false) }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    <Alert onClose={() => setsmilesCopysnack(false)} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        SMILES copied to clipboard
                    </Alert>
                </Snackbar>
            </Stack>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={Sexperimentsnack} autoHideDuration={2000} onClose={() => { setSexperimentsnack(false) }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    <Alert onClose={() => setsavesnackstate(false)} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        Experiment was successfully added 
                    </Alert>
                </Snackbar>
            </Stack>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={Elsnack} autoHideDuration={2000} onClose={() => { setSexperimentsnack(false) }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    <Alert onClose={() => setsavesnackstate(false)} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        ELN project successfully added 
                    </Alert>
                </Snackbar>
            </Stack>

        </>
    );
}

