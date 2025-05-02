import { ArrowBackOutlined, ArrowForwardOutlined, CheckBox, CopyAllOutlined, Label,CancelOutlined, CloseOutlined, Download} from '@mui/icons-material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AppBar, Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, LinearProgress, Toolbar, Tooltip, Typography,Paper,Select, MenuItem, FormControl, InputLabel,Box, Checkbox, 
  Dialog,FormControlLabel, DialogActions, DialogContent, Divider,Popover,Popper,Table, TableBody, TableCell, TableRow,tableCellClasses, TextField,Badge,Alert,Snackbar,Stack, Input, Slider, Accordion,AccordionSummary,AccordionDetails } from '@mui/material'
import { styled } from '@mui/material/styles';
import { doc, getDoc, orderBy, query,collection,onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import MainCard from 'ui-component/cards/MainCard'
import SubCard from 'ui-component/cards/SubCard'
import ExampleCanvas from 'views/RDkit/ExampleCanvas'
import { dig } from 'objectdigger'
import Subappbar from 'ui-component/subappbar/Subappbar'
import { purple } from '@mui/material/colors'
import { getStorage, ref, getDownloadURL } from '@firebase/storage';
import { getApp } from 'firebase/app'
import { auth, db, uid } from "index";
import { getAuth } from "firebase/auth";
import DownloadPdf from './DownloadM';
import html2pdf from 'html2pdf.js';
import { display, fontSize, fontWeight, textAlign } from '@mui/system';
import { useTheme } from '@mui/styles';
import {ExpandCircleDownOutlined} from '@mui/icons-material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import MoleculeStructure from "../../RDkit/MoleculeStructure";
import './d3tree.css'
import { indexOf } from 'lodash';



function RetrosynthesisOutput({Data,Uid,PV,clusterview,cluster,clustdata, viewclusterpaths,load}) {
  const [startingmaterials, setStartingmaterials] = useState({});
  const [referencedata, setReferencedata] = useState({});
  const [experimentname, setExperimentname] = useState({});
  const [copytext, setcopytext] = useState('');
  const [Loading,setLoading]  =useState(true)
  const [copytextloader, setcopytextloader] = useState(false);
  const [Sort, setSort]  = useState('0')
  const [yieldfilter,setyieldfilter] = useState('0')
  const [filteryield,setFilteryield] = useState({min:0,max:1})
  const [filterOpen, setfilterOpen] = useState(false)
  const [anchorEl,setanchorEl] = useState(null)
  const [Nosteps,setNosteps] = useState(15)
  const  [NoofFilters, setNoofFilters] =  useState(0)
  const [UID,setUID]  = useState('')
  const [smilesCopysnack,setsmilesCopysnack] = useState(false)
  const [PathSelect, setPathSelect]= useState([])
  const [Selectpaths, setSelectpaths]= useState(false)
  const [Dwnwin,setDwnWin]= useState(false)
  const [allselected,setallselected]= useState(false)
  const [ clusterArr, setClusterArr]= useState({})
  const [clusterView,setClusterView]  = useState(false)




  const handlecopytext=()=>{
    
  }

  const navigate = useNavigate();
  const { template, pid, eid, tid } = useParams()
  const digger = dig(startingmaterials);

const theme = useTheme()



const StyleSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: "#4a4aa0",
  },
  
}));
  
  const firebaseApp = getApp();
  const storage = getStorage(firebaseApp);

  const fetchJsonFile = async () => {
  
    // const  collect = []
    // await Promise.all(path.map(async (data) => {
    //     if(data!=null){
        
    //     const pathReference = ref(storage, data);
    //     const downloadURL = await getDownloadURL(pathReference);
    //     const response = await fetch(downloadURL).catch((err) => console.log(err));
    //     const finaljsonData = await response.json();
        
    //     const countarr = Object.keys(finaljsonData).map(key => finaljsonData[key]);
    //     collect.push(...countarr);}
    // }));
    setStartingmaterials({ ...Data });
    setReferencedata({...Data})
    setTimeout(()=>{setLoading(false)},50)
  }

  console.log(referencedata)


  // starting materials output
  const getstartingmaterials = async () => {
   
       
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
                 console.log(clustdata)
              
    
 }
  console.log(UID.clusters)
 

 useEffect(()=>{
  setClusterView(cluster)
  setClusterArr(clustdata)
 },[cluster,clustdata])

 useEffect(()=>{
   if(load){
    setTimeout(()=>setLoading(false),200)
   }
 },[load])

  
 const ClusterCard =(Data)=>{
  return(
    <div style={{boxShadow:'1px 1px grey', marginBottom:'50px', borderRadius:'20px'}}>
      <Accordion sx={{border:'2px solid #323259', borderRadius:'20px ! important', padding:'2%'}}>
      <AccordionSummary
         expandIcon={<ColorButton><ExpandMore/></ColorButton>}
        aria-controls="panel1-content"
        id="panel1-header"
      >
      <div style={{width:'100%'}}>
        
        <Grid container xl={12} sm={12} xs={12} md={12} sx={{justifyContent:'space-evenly'}} >
        {
                  Data.data[0][1].path.starting_materials?.slice(0,3).map((data, index) =>
                    <>
                      <Grid key={index} item xl={3} md={3} sm={4} xs={12} sx={{ width: '180px' }}>
                        <Card elevation={2} sx={{ padding: '0px' }}>
                          <CardContent key={data + index} sx={{ padding: '0px',marginBottom:'0px',maxHeight:'160px',maxWidth:'180px' }}>
                            <MoleculeStructure  width={150} height={100} svgMode structure={data} />
                            
                          </CardContent>
                          <CardActions sx={{ padding: '0px',display:'block',textAlign:'right' }}>
                            <Tooltip title="Copy smiles">
                              <IconButton onClick={()=>{navigator.clipboard.writeText(data);setsmilesCopysnack(true)}}><CopyAllOutlined sx={iconstyle2} /></IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    </>)
                }
        </Grid>
       
         <Typography sx={{fontSize:'1rem', marginTop:'20px', textAlign:'center',color:'#323259', fontWeight:500}}> No of similar paths:{Data.data.length}</Typography>
     
      </div>
      </AccordionSummary>
      <AccordionDetails>
      {
      Data.data.map((pdata, index)=>
      <div key={index}>
            <SubCard key={index} sx={{ borderTop: `2px solid ${theme.palette.secondary.dark}` }}>
              <Grid container spacing={2}>
                <AppBar position='static' sx={{ backgroundColor: 'white' }} elevation={0}>
                {/* { 
                              Selectpaths &&
                              <div style={{textAlign:'left'}}>
                              <Checkbox 
                                name="chk"
                                onChange={(event)=>{if(event.target.checked)
                                {
                                  setPathSelect((prev)=>[...prev,entry[1]])
                                }
                                else{
                                
                                 setPathSelect(PathSelect.filter((data)=>{
                                  return data.idx!=entry[1].idx}))
                                }
                                
                                }}
                              />
                              </div>
                      } */}
                  <Toolbar variant='dense' sx={{ display: 'flex' }}>
                         
                    <Typography variant="subtitle2" gutterBottom  sx={{ flexGrow: 1,...iconstyle2}}>Path : {pdata[1].idx+1}</Typography>
                    <Typography variant="subtitle2" gutterBottom  sx={{ flexGrow: 1,...iconstyle2}}>{`No.of Steps: ${pdata[1].path.num_steps}`}</Typography>
                    <Button 
                    variant='outlined' 
                    size='small' 
                    onClick={() => {
                      viewclusterpaths(index,Data.num)
                      }}
                     sx={iconstyle2}
                    >
                      view
                      </Button>
                     
                      
                  </Toolbar>
                  <div>
                  <Paper  sx={{display:'inline', borderRadius:'5px',float:'right',marginTop:'10px', marginRight:'10px'}} elevation={2}>
                       <Typography  sx={Typographstyle}> <span style={{...iconstyle2,fontWeight:'bold'}}>Estimated Cost : </span>${pdata[1].path.path_cost}</Typography>
                       <Typography  sx={{padding:'5px',display:'bloak'}}> <span style={{...iconstyle2,fontWeight:'bold'}}>Estimated yield : </span>{Number(pdata[1].path.path_yield).toFixed(3)}</Typography>
                       <Typography  sx={{padding:'5px',display:'bloak'}}> <span style={{...iconstyle2,fontWeight:'bold'}}>Pathway Score : </span>{Number(pdata[1].path.pathway_score).toFixed(3)}</Typography>
               </Paper> 
                  </div>
                </AppBar>
                

                {
                  pdata[1].path.starting_materials?.map((data, index) =>
                    <>
                      <Grid key={index} item xl={3} md={3} sm={4} xs={12} sx={{ width: '180px' }}>
                        <Card elevation={2} sx={{ padding: '0px' }}>
                          <CardContent key={data + index} sx={{ padding: '0px',marginBottom:'0px',maxHeight:'160px',maxWidth:'180px' }}>
                           <MoleculeStructure  width={150} height={100} svgMode structure={data} />
                            <Typography variant='subtitle1' color="text.secondary">{data}</Typography><br/>
                            
                          </CardContent>
                          <CardActions sx={{ padding: '0px',display:'block',textAlign:'right' }}>
                            <Tooltip title="Copy smiles">
                              <IconButton onClick={()=>{navigator.clipboard.writeText(data);setsmilesCopysnack(true)}}></IconButton>
                            </Tooltip>
                          </CardActions>
                        </Card>
                      </Grid>
                    </>)
                }
              </Grid>
              

            </SubCard>
          </div>)}
      </AccordionDetails>
      </Accordion>
      <div style={{position:'absolute'}}></div>
      <div style={{position:'absolute'}}></div>
    </div>

  )   
}

 
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'purple',
        color: theme.palette.common.white,
        padding:'10px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding:'10px'
    },
}));
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#501f84'),
  backgroundColor: '#501f84',
  '&:hover': {
    backgroundColor: '#7030b3',
  },
  '&:disabled': {
    backgroundColor: 'grey',
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

const Typographstyle={
color:"#323259",
fontSize:'0.6rem',
padding:'2px',
display:'flex',
alignItems:'center'

}


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
      border: 0,
  },
}));



const DownpdfM = async()=>{
 
     
     
    const printableContent = document.getElementById("DowndataM");
    const printWindow = window.open("", "", "height=1000,width=1000");
    
    try {
      if (printWindow === null || typeof printWindow === 'undefined') {
        throw new Error('Print window could not be opened.');
      }
    
      printWindow.document.head.innerHTML = `
        <style>
            @media print {
              .page_break {
                page-break-after: always;
              } 
              .step {
                page-break-inside: avoid;
              } 
              @page {
                margin-top: 1.5cm;
                size: auto;
                print-backgrounds: yes;
              }
              body {
                margin: 0;
                padding: 20px; 
              }
              header, footer {
                display: none;
              }
            }
        </style>
      `;
      printWindow.document.body.innerHTML = printableContent.innerHTML;
      setDwnWin(false);
      printWindow.print();
    } catch (error) {
      console.error(error.message);
      alert('Please allow Popups and try again');
      setPathSelect([]);
      setallselected(false);
    } finally {
      if (printWindow) {
        printWindow.close();
      }
      setPathSelect([]);
      setallselected(false);
    }
  }
    const handlefilterChange = (e)=>{
     if(e==1){setFilteryield({min:0,max:0.3})
    }else if(e==2){setFilteryield({min:0.3,max:0.6})
    }else if(e==3){setFilteryield({min:0.6,max:1})}
     else{setFilteryield({min:0,max:1})}
    }

  const badgeNo = ()=>{
    if ( yieldfilter!=0 && Nosteps!=15){setNoofFilters(2)}
    else if(yieldfilter!=0 || Nosteps!=15){setNoofFilters(1)}
    else {setNoofFilters(0)}
  }


  const Hstepyeild =(dat)=>{
   let path1 = dat.path
   const forwardscores =[]
   const findhighest= (paths)=>{
      forwardscores.push(paths?.fwd_score)
      if(paths?.children){
        paths.children.map((data)=>{
          findhighest(data)
        })
      }
   }
   findhighest(path1)
   console.log(forwardscores)
   return(
   forwardscores.sort((a,b)=>a -b)[0])}

  useEffect(()=>{
    setLoading(true)
    getstartingmaterials()
  },[Data])
  



  const filter = ()=>{
  badgeNo()
   var filteredData = {}
  
   
   Object.keys(referencedata).forEach((key)=>{
    console.log(referencedata[key].path.path_yield)
    var a = referencedata[key].path.path_yield
   if (referencedata[key].path.num_steps <= Nosteps ){
    filteredData[key] = referencedata[key]
   }
   
   })
   setStartingmaterials(filteredData)
  }
   
  const checkboxHandle =(event)=>{
    setallselected(!allselected)
    const checkboxElements = Array.from(document.getElementsByName("chk"));
    
   if(event.target.checked)
      {
        // checkboxElements.forEach((item)=>{
        //   item.click()
        // })
      const path=[]
      Object.entries(startingmaterials).map((data)=>
      {
        path.push(data[1])
      }
      )
      setPathSelect(path)
     
      }
       else{
        
        setPathSelect([])
      }
       }
  
  
  // useEffect(() => {
  //   var activesubscription=true;
  //   if(activesubscription){
  //     getstartingmaterials();
  //   }
  //   return () => {
  //     activesubscription=false;
  //   }
  // }, [])
  
  return (
    <>
      {/* sub Appbar */}
      <Subappbar
        icon1={<ArrowBackOutlined sx={iconstyle2} />}
        icon2={<ArrowForwardOutlined sx={iconstyle2} />}
        navigate1={      
                  (UID.uid == auth.currentUser.uid) ? 
                   () => navigate(`/Experiments/${pid}`):
                   () => {
                       navigate( `/SharedExperiments`)}}
        navigate2={() => {
          if(clusterView){
            viewclusterpaths(0,0)
          }
          PV(0)}}
        Switch={<FormControlLabel labelPlacement='start'   control={<StyleSwitch  checked={clusterView} onChange={()=>{
          setLoading(true)
          clusterview()}}  />} disabled={clusterArr.length<1} label="Cluster View"  color="#323259"  />}
        title="Starting materials"
      />
      
      
      {
        !clusterView && <div>
      {
        Selectpaths &&      
      <Paper sx ={{minWidth: '210px',minHeight: '181px',position:'fixed',zIndex:1,right:'10%',display:'flex',flexDirection:'column',justifyContent:'space-around',border:'solid',borderBlockColor:'#0000001a'}}>
      <Typography sx={{textAlign: 'center',...iconstyle2, position:'relative',top:'50%'}}>{PathSelect.length==0 ? 'please select paths': `${PathSelect.length} paths are selected`}</Typography> 
    <div style={{display:'flex', justifyContent:'space-around'}}>
    <ColorButton sx={PathSelect.length <= 0 && {backgroundColor:'grey'}} onClick={()=>{
        setDwnWin(true)

        setSelectpaths(false)
        setTimeout(()=>{document.getElementById("DBUTTON").click()},300)
      }} disabled={PathSelect.length <= 0}>Proceed</ColorButton>
      
      <ColorButton2 onClick={()=>{
        
        setSelectpaths(false)
        setallselected(false)
      }}>Cancel</ColorButton2>
      </div>
        </Paper>
      }
    
      <Box sx={{alignItems:'right',display:'flex', justifyContent:"space-between",alignItems:'center' }}>
      <div> 
      {
      Selectpaths &&
      <div style={{display:'flex',alignItems:'center'}}>
      
      <Checkbox 
        checked ={allselected}
        onClick={checkboxHandle}
       
       />
        <Typography sx={{fontWeight:500,fontSize:'16px',color:"#323259"}}>select all</Typography>
        </div>
     }

     
      </div>
      <Typography>Total Paths : {Object.entries(startingmaterials).length}</Typography>
      <div style={{display:'flex'}}>
      <Tooltip title='Download'>
          <Button 
                 onClick={(e)=>{
                  
                  setanchorEl(e.currentTarget)
                 setSelectpaths(true)}} sx={{backgroundColor: 'white', width: '26px', height: '39px',paddingLeft: '0px', paddingRight: '0px',  marginRight: '5px',marginTop: '19px', marginBottom:'10px',  '&:hover': { backgroundColor: 'white'}}}>
              <Download sx={iconstyle2}/>
        </Button>
      </Tooltip>
     
      <Tooltip title='filter'>
          <Button 
                 onClick={(e)=>{
                  
                  setanchorEl(e.currentTarget)
                 setfilterOpen(true)}} sx={{backgroundColor: 'white', width: '26px', height: '39px',paddingLeft: '0px', paddingRight: '0px',  marginRight: '5px',marginTop: '19px',  '&:hover': { backgroundColor: 'white'}}}>
              <Badge badgeContent={NoofFilters} sx={iconstyle2}>
              <FilterAltIcon sx={iconstyle2}/>
            </Badge>
        </Button>
      </Tooltip> 
     
     
     <div>
    
      <Typography sx={{ ...iconstyle2 , fontWeight:'bold'}}>Sort by:</Typography>
      <FormControl variant="outlined" fullWidth sx={{maxWidth:'170px', marginBottom:'10px'}} >
        <Select   id='SelectSort' sx={{backgroundColor:'rgb(255 255 255)', opocity:'0.8',...iconstyle2,  height:'40px'}}   value={Sort} onChange={(e)=>{
          setSort(e.target.value)}}>
          <MenuItem value='0'>None</MenuItem>
          <MenuItem value='1'>Cost : low to high</MenuItem>
          <MenuItem value='2'>Cost : high to low</MenuItem>
          <MenuItem value='3'>Yield: low to high</MenuItem>
          <MenuItem value='4'>Yield: high to low</MenuItem>
          <MenuItem value='5'>pathway_score: low to high</MenuItem>
          <MenuItem value='6'>pathway_score: high to low</MenuItem>
        </Select>
     </FormControl>
     </div>
      
      </div>
     </Box>
      <Popover open={filterOpen} anchorEl={anchorEl}>
      <Paper sx ={{minWidth: '210px',minHeight: '181px'}}>
      <Typography sx={{textAlign: 'center', ...iconstyle2,backgroundColor:'#fff',fontSize: '20px',boxShadow:'0px 1px 5px 0px #323259'}}>Filter</Typography>
      <Table>
      <TableBody>
       {/* <StyledTableRow>
          <StyledTableCell><Typography sx={{...iconstyle2,fontSize: '15px'}}>Yield :</Typography></StyledTableCell>
          <StyledTableCell>
           <FormControl>
           <Select id='filterYield' labelId='yieldlabel' sx={{...iconstyle2,  height:'40px'}} value={yieldfilter}
           onChange={(e)=>{
            setyieldfilter(e.target.value)
            handlefilterChange(e.target.value)}}>
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={1}>low</MenuItem>
              <MenuItem value={2}>medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
           </Select>
          </FormControl></StyledTableCell>
        </StyledTableRow> */}
        <StyledTableRow>
          <StyledTableCell  sx={{width:'80px'}}><Typography sx={{...iconstyle2,fontSize: '15px'}}>Maximum Steps :</Typography></StyledTableCell>
          <StyledTableCell>
          <Slider fullWidth value={Nosteps} min={3} max={15} step={3}  valueLabelDisplay="auto" marks size='small' sx={{maxWidth:'80px'}} id='maxsteps'   onChange={(e)=>{
             setNosteps(e.target.value)}}  /> 
            </StyledTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledTableCell><ColorButton  onClick={()=>{
            filter()
            setfilterOpen(false)}}>Apply</ColorButton></StyledTableCell>
          <StyledTableCell><ColorButton2  onClick={()=>{
            setyieldfilter(0)
            setNosteps(15)
            setNoofFilters(0)
            setStartingmaterials(referencedata)
            setfilterOpen(false)}}>Clear</ColorButton2></StyledTableCell>
        </StyledTableRow>
        
        </TableBody></Table>
        </Paper>

      </Popover>
     </div>
      }
      {
        Loading ?<LinearProgress color="secondary" />
       : !clusterView ?
      <MainCard contentClass='retro_Allpath_main' contentSX={{height:'100vh', overflow:'scroll'}}>
        {
          (Object.entries(startingmaterials).length<=0&& NoofFilters==0)?
          <LinearProgress color='secondary'/>
          :
          (Object.entries(startingmaterials).length<=0  && NoofFilters>0) ?
          <Typography>NO results found,try removing filters </Typography>:
          Object.entries(startingmaterials).sort(function(a,b){
            if (Sort==1){return a[1].path.path_cost-b[1].path.path_cost}
            else if (Sort==2){return b[1].path.path_cost-a[1].path.path_cost}
            else if (Sort==3){return a[1].path.path_yield-b[1].path.path_yield}
            else if (Sort==4){return b[1].path.path_yield-a[1].path.path_yield}
            else if (Sort==5){return a[1].path.pathway_score-b[1].path.pathway_score}
            else if (Sort==6){return b[1].path.pathway_score-a[1].path.pathway_score}
            else {return a[1].idx-b[1].idx}
          
            }).map((entry, index) =>
         
            <div key={index}>
              <SubCard key={index} sx={{ borderTop: `2px solid ${theme.palette.secondary.dark}` }}>
                <Grid container spacing={2}>
                  <AppBar position='static' sx={{ backgroundColor: 'white' }} elevation={0}>
                  { 
                                Selectpaths &&
                                <div style={{textAlign:'left'}}>
                                <Checkbox 
                                  name="chk"
                                  checked={PathSelect.indexOf(entry[1])>-1}
                                  onChange={(event)=>{if(event.target.checked)
                                  {
                                    setPathSelect((prev)=>[...prev,entry[1]])
                                  }
                                  else{
                                  
                                   setPathSelect(PathSelect.filter((data)=>{
                                    return data.idx!=entry[1].idx}))
                                  }
                                  
                                  }}
                                />
                                </div>
                        }
                    <Toolbar variant='dense' sx={{ display: 'flex' }}>
                           
                      <Typography variant="subtitle2" gutterBottom  sx={{ flexGrow: 1,...iconstyle2}}>Path : {Data.indexOf(entry[1])+1}</Typography>
                      <Typography variant="subtitle2" gutterBottom  sx={{ flexGrow: 1,...iconstyle2}}>{`No.of Steps: ${entry[1].path.num_steps}`}</Typography>
                      <Button 
                      variant='outlined' 
                      size='small' 
                      onClick={() => {
                       console.log(entry[1].idx)
                        PV(Data.indexOf(entry[1]))
                        }}
                       sx={iconstyle2}
                      >
                        view
                        </Button>
                       
                        
                    </Toolbar>
                    <div>
                    <Paper  sx={{display:'inline', borderRadius:'5px',float:'right',marginTop:'10px', marginRight:'10px'}} elevation={2}>
                         <Typography  sx={Typographstyle}> <span style={{...Typographstyle,fontWeight:'bold'}}>Estimated Cost : </span>${entry[1].path.path_cost.toFixed(3)}</Typography>
                         <Typography  sx={Typographstyle}> <span style={{...Typographstyle,fontWeight:'bold'}}>Estimated yield : </span>{Number(entry[1].path.path_yield).toFixed(3)}</Typography>
                         <Typography  sx={Typographstyle}> <span style={{...Typographstyle,fontWeight:'bold'}}>Pathway Score : </span>{Number(entry[1].path.pathway_score).toFixed(3)}</Typography>
                         <Typography  sx={Typographstyle}> <span style={{...Typographstyle,fontWeight:'bold'}}>Least Forward Score : </span>{Number(Hstepyeild(entry[1])).toFixed(2)}</Typography>
                 </Paper>
                    </div>
                  </AppBar>
                  
                  
                  <Grid className='REflist' container sx={{gap:'10px',width:'80%', overflowX:'scroll',flexWrap:'nowrap', padding:'5px'}}>
                  {
                    entry[1].path.starting_materials?.map((data, index) =>
                      <>
                        <Grid key={index} item xl={3} md={3} sm={4} xs={12} sx={{ width: '180px' }}>
                          <Card elevation={2} sx={{ padding: '0px' }}>
                          <div style={{width:'100%',textAlign:'right'}}><Tooltip title="Copy smiles">
                                <IconButton onClick={()=>{navigator.clipboard.writeText(data);setsmilesCopysnack(true)}}><CopyAllOutlined sx={iconstyle2} /></IconButton>
                              </Tooltip>
                              </div>
                            <CardContent key={data + index} sx={{ padding: '0px',marginBottom:'0px',maxHeight:'160px',maxWidth:'180px' }}>
                            <MoleculeStructure  width={150} height={100} svgMode structure={data} />
                            </CardContent>
      
                          </Card>
                        </Grid>
                      </>)
                  }
                  </Grid>
                </Grid>
                

              </SubCard>
            </div>
        )}

      </MainCard>
      :
      <MainCard>
  {Object.entries(clusterArr).map((entry, index) => (
    <ClusterCard key={index}  data={entry[1]}  num={entry[0]} />
  ))}
      </MainCard>
      }
       <Dialog  open={Dwnwin} sx={{visibility:'hidden'}}  onClose={()=>{ 
        setallselected(false)
        setPathSelect([])
        }}>
                <DialogContent >
                   {Dwnwin && <DownloadPdf id="downloaddialog" tdata={PathSelect} template={template}/> }
                </DialogContent>
                <Divider />
                <DialogActions id='DWNACTIONS'>
                    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
                        
                        <Grid item sm={6} xs={12}>
                            <ColorButton  id="DBUTTON" endIcon={<Download/> } fullWidth={true} onClick={() => {
                              DownpdfM()
                             
                             }}>
                                Download PDF
                            </ColorButton>
                        </Grid>
                        <Grid item sm={10} xs={12} >
                            <ColorButton endIcon={<CancelOutlined />}  onClick={() => {
                            setDwnWin(false)
                            setPathSelect([])
                            
                           }}
                            padding={12} >
                                cancel   
                            </ColorButton>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

      <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={smilesCopysnack} autoHideDuration={2000} onClose={() => { setsmilesCopysnack(false) }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    <Alert onClose={() => setsmilesCopysnack(false)} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        SMILES copied to clipboard
                    </Alert>
                </Snackbar>
      </Stack>
    </>

  )
}

export default RetrosynthesisOutput
