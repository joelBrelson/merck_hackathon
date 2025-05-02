import express from "express";

import {
    UpdateDoc,
    DeleteDoc,
    AddDoc,
    GetDoc,
    Docarrayunion,
    GetAgentchatlist,
    Messageinsert,
    Filedownload

  } from "./controllers/multicontroller.js";


const router = express.Router();

router.put("/updatedoc",UpdateDoc)
router.put("/updatedocarray",Docarrayunion)
router.delete("/deletedoc",DeleteDoc)
router.post("/adddoc",AddDoc)
router.get("/getdoc/:id",GetDoc)
router.get("/getchats",GetAgentchatlist)
router.put("/messageinsert",Messageinsert)
router.get("/downloadfile",Filedownload )

export default router;