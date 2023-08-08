const express = require('express');
const dotenv = require('dotenv');
const {google} = require('googleapis');
dotenv.config();
const app = express();
const port = 3005;

const auth = new google.auth.GoogleAuth({
    keyFile:'./credentials.json',
    scopes:'https://www.googleapis.com/auth/spreadsheets'
})
const client = auth.getClient();
const googleSheet = google.sheets({version:'v4',auth:client});
const spreadsheetId = "1qlfmCW52AiZ8wAfHYDsJRdrkq-ndk2oOk8QYBunr2yQ";
app.get('/', async (req, res) => {
    try{
        const getData = await googleSheet.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range:'A2:C5'
          });
        
          res.status(200).json(getData.data.values);
    }catch(err){
        return res.status(404).json({err:"Could not fetch the data"})
    }
   
  });
app.post('/create',async(req,res) => {
    try{
        const response = await googleSheet.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:'A6:C6',
            valueInputOption:'USER_ENTERED',
            requestBody:{
                values:[['Gilbert','Junior developer','1']]
            }
        })
        res.status(201).json(response);
    }catch(err){
        return res.status(500).json({err:"Cannot create the data"})
    }
    
})
app.put('/update',async(req,res) => {
    try{
        const response = await googleSheet.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range:'A6:C6',
        valueInputOption:'USER_ENTERED',
        requestBody:{
            values:[["Subham","Full Stack Developer","4"]]
        }
    })
    res.status(200).json(response)
    }catch(err){
        return res.status(500).json({err:"Sorry! could not be updated. Try Again!"})
    }
    
})
app.delete('/delete',async(req,res) => {
    try{
        const response = await googleSheet.spreadsheets.values.clear({
            auth,
            spreadsheetId,
            range:'A6:C6'
        })
        res.status(200).json({message:"Deleted the data"});
    }catch(err){
        return res.status(500).json({err:"Unable to delete!"})
    }
    
})
app.listen(port,() => {
    console.log(`Server is running on port: ${port}`);
})