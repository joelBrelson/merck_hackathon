
import AgentChats from "../models/Agentchats.js";
import AgentConversationLogs from "../models/AgentConversationLogs.js";
import { Storage } from '@google-cloud/storage';
import { firebasebucket } from "../config.js";

import { Model } from "mongoose";
import mongoose from 'mongoose';

import { MongoClient } from 'mongodb';



const storage = new Storage({
  keyFilename: '/home/ubuntu/project-2-main/keys/rebolt-c97b2-firebase-adminsdk-p2gme-afa0f0a315.json',
});

const { Schema } = mongoose;


const saltRounds = 10;

const ModelName = (keyword) => {
  console.log(keyword)
  if (keyword === "Agentchats") {
    return AgentChats;
  }
  else if (keyword === "AgentConversationLogs") {
    return AgentConversationLogs;
  }
  else {
    return null;
  }
};

export const UpdateDoc = async (req ,res)=> {
  try {
    // Extract id and defpath (field and value) from the request body
    const { id, Pathstring, value, collection } = req.body;

    // Get the token from the authorization header
  

    const model = ModelName(collection);
    if (!model) {
      res
        .status(400)
        .json({ message: "Invalid collection name", status: false });
      return;
    }


    const documentdata = await model.findById(id);

    
      // Use $set to update nested field
      const updatedata = { $set: { [Pathstring]: value } };

      // Update the document by its ID using $set
      const result = await model.findByIdAndUpdate(id, updatedata, {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      });


      if (!result) {
        res
          .status(404)
          .json({ message: "Document not found", status: false });
        return;
      }
      // Success response
      res
        .status(200)
        .json({ data: { message: 'Updated successfully' }, status: true, message: "Success" });
    }
    catch (error) {
    console.error("Error updating data:", error);
    res
      .status(500)
      .json({ message: "Failed to update data", error: error.message, status: false });
  }
};

export const DeleteDoc = async (req, res) => {
  try {
    const { id, collection } = req.body;

    const model = ModelName(collection);
    if (!model) {
      res
        .status(400)
        .json({ message: "Invalid collection name", status: false });
      return;
    }

    const documentdata = await model.findById(id);

   

      await model.findByIdAndDelete(id);

      res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to delete", error });
  }
};










export const AddDoc = async (req, res) => {
  const schema = {};
  try {
    const { collection, data } = req.body;



    // schema[collection] = new mongoose.Schema({}, { strict: false });

    // const modelz = mongoose.model(collection, schema[collection]);

    const model = ModelName(collection);
    if (!model) {
      res
        .status(400)
        .json({ message: "Invalid collection name", status: false });
      return;
    }

    const record = new model(data);
    await record.save();

    res.status(201).json({ id: record._id, status: true, message: "Record created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Record creation failed", error });
  }
}

export const GetDoc = async (req, res) => {

  try {
    // Extract the dataset ID from request parameters
    const { collection } = req.query;


   


    const id = req.params.id;

    const model = ModelName(collection);

    if (!model) {
      res
        .status(400)
        .json({ message: "Invalid collection name", status: false });
      return;
    }

    // Find dataset by ID
    const Docdata = await model.findById(id);


    // Check if dataset exists
    if (!Docdata) {
      res.status(404).json({ status: false, message: "Data not found" });
      return;
    }



      res.status(200).json({ data: Docdata, status: true, message: "Success" });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get Data", error: error, status: false });
  }
};



export const Docarrayunion = async (req, res) => {
  try {
    const { id, collectionsUsed, fieldname, data } = req.body;


    // ✅ Validate Token
    

   

    // ✅ Validate Input
    if (!id || typeof collectionsUsed !== "string") {
      res.status(400).json({ message: "Invalid input parameters", status: false });
      return;
    }

    // ✅ Get Collection Model
    const model = ModelName(collectionsUsed);
    if (!model) {
      res.status(404).json({ message: "Collection not found", status: false });
      return;
    }

    // ✅ Find Document
    const Document = await model.findById(id);
    if (!Document) {
      res.status(404).json({ message: "Document not found", status: false });
      return;
    }

    // ✅ Check Permissions
    

    // ✅ Perform Array Union Update
    const updatedDoc = await model.findByIdAndUpdate(
      id,
      { $addToSet: { [fieldname]: data } }, // ✅ Use bracket notation for dynamic field name
      { new: true }
    );

    if (!updatedDoc) {
      res.status(500).json({ message: "Update failed", status: false });
      return;
    }

    res.status(200).json({ message: "Document updated successfully", status: true, updatedDoc });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Failed to update document", error: error.message, status: false });
  }
};


export const GetAgentchatlist = async (req, res) => {
  try {
    const { collection } = req.query;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorized: Token not provided", status: false });
      return;
    }

   
    


    const model = ModelName("Agentchats");
    if (!model) {
      res
        .status(400)
        .json({ message: "Invalid collection name", status: false });
      return;
    }

    const datasets = await model.find({ uid: userId });

    let exps = [];

    await datasets.forEach((exp) => {
      exps.push({ id: exp._id, chatname: exp.chatname, createdDate: exp.createdDate, Chatfiles: exp.Chatfiles })
    })

    res.status(200).json({ data: exps, status: true, message: "Success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get data", error: error, status: false });
  }
};


export const Messageinsert = async (req, res) => {
  try {
    const { id, data, activerequest } = req.body;

    // ✅ Validate Token
   

  


    // ✅ Get Collection Model
    const model = ModelName("AgentConversationLogs");
    if (!model) {
      res.status(404).json({ message: "Collection not found", status: false });
      return;
    }

    // ✅ Find Document
    const Document = await model.findById(id);
    if (!Document) {
      res.status(404).json({ message: "Document not found", status: false });
      return;
    }

    // ✅ Perform Array Union Update
    const updatedDoc = await model.findByIdAndUpdate(
      id,
      { $addToSet: { conversation: data }, active_request: activerequest }, // ✅ Use bracket notation for dynamic field name
      { new: true }
    );

    if (!updatedDoc) {
      res.status(500).json({ message: "Update failed", status: false });
      return;
    }

    res.status(200).json({ message: "Document updated successfully", status: true, updatedDoc });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Failed to update document", error: error.message, status: false });
  }
};
export const Filedownload =  async (req, res) => {
  
  const { filePath } = req.query; 
  const bucketName = firebasebucket;

  try {
    const [url] = await storage 
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 2 * 60 * 1000, // 15 minutes
      });

    res.json({ url });
  } catch (err) {
    console.error('Error generating signed URL:', err);
    res.status(500).json({ error: 'Failed to generate download link' });
  }
};

