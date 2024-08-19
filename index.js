const express = require("express")
const app = express()
const connectDatabase = require("./config/database")
const methodOverride = require("method-override");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const { google } = require('googleapis');


// -------------------- For Local Storage --------------------

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  
  filename: (req, file, cb) => {
    const fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },

});

const upload = multer({ storage });


// -------------------- Automated Emails --------------------

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'tk839587@gmail.com',
      pass: 'hskgrfautpgpaabk'
  }
});










// --------------------- File Upload Drive API  ---------------------

const GOOGLE_DRIVE_FOLDER_ID = '1CbO11lCNlmam55uIUemNHWC_QuNPYxQW';

const USER_EMAIL = 'F2021266625@umt.edu.pk';

const auth = new google.auth.GoogleAuth({
    
    credentials: {
        type: "service_account",
        project_id: "file-upload-427811",
        private_key_id: "d391df159dae3fe4fb4d75e94079dbadf8e7f3ce",
        private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFUQtw/W0CY7AY\nEVhlecq0HFJ5v4p2CG7AZjchwrArjngOnPzX5nmMLMAendGm/wr5CRSrTQe7lP2s\nlhWx5GPMEo/87ZGPP3C93PRveilGNVPHS2S+0m4ui95UDa4SPXuuNpKsXFJ6dIOX\nKv4jFVQYvx44dFXs5L/DN7EqDHGF2TXXl3dAeJyWTMZYcSVzpRXEgtqhWu6G7Bn5\nk8cH8uuHhYE26ioOCvpbNQzL0+badMLF/yYIRyEA/eVGKlzYNmIHXRVZcHOtK4hO\n0c0t9kNncVUre1iDMsNZaTo/fYe0zgwPgRMuX2IHL6ysvAC/SgF9OzkAzKL6udF9\nofgaDqAfAgMBAAECggEAANLNQuvz1AI5fmg4H7hJ5cWGfJaVi9eOKsRib4Qh+xSN\noLX8AiSmljSrmpUbBmDjGVX13Z8lLJ27D0jTD1p+JiBftHUDWf8wR8KPzJVMbcwU\nLO0+HuO+7PfNdjlWZCIYjYoRw6FhALzSvcNCqz/QCYhmpmKp5yKvQC/Pz/acVKwp\nAI0Oh97JEAuFDuzuAdetLad1g8p050LFWBcDzRLYkdePcLW0GADRfk2rdoJkaxbn\n9N9OGQt/rgV9K03EFr8igYdeGakXnZUuNF5NoOjlYQcd/RY4Vn3ZbPe2QlKYPKFR\nfiqW/gcsIdK2OwtZAL+GW15vw09v0I6ozLSM9QFadQKBgQD2rNQv6u22RdPUnGIL\nB8xV1ayEJr+lfvWblN1Qk9rVqqhsLtI6H+VcPtRLVtqfP5ETU9jw52kUuCh5fnZ2\nnY/X87D70U+i8TO7u41F1/Uox0ivsw7bcRYqSXnGv9QvYl+g9Gd7OJjx34q8Ib+S\nUFVLtCobZJg6Al73ZDbC5gwWrQKBgQDMxo3Za7YE5MDrs6VlhALZ1PfgTqP+4eQk\nqpPupgiBy+TGJ1DAAAN0z/CnFLMldSUpzaJB564Z1ntinSy+55qaTdLS1hrw3Otc\nrQAz1M+xZTGF7EtUn74jS7YkX4GCO3KD7LCch6On2hnkIowQvgXtk+hGkFFPPD2A\nXlskxUUHewKBgFpdJb4ICdzj553TS/dOfARVqkUfDMXLpJ3CAvEpuNjdE6XN4SV5\n2cPZIFwZDS2ZU8QIy0g0/cGhVPJs6Wi6f59UnlkhbFL8mT8EjdQwMJcnqfDzX1X0\nL3J+SCYOz+Qr3WxRHDd/nEe+5EvW8R7gXt7EuUgfqcRWagOmqojrTTJhAoGBAJoo\nS7dHMBMFBvsqFbSTqfXFLwotCaai9bZot88sLTFRhptqE49HM1LoC9osaiUjyGNt\nC96jhFytK9v0STA6eRf6yGCykDuNhJ4TGxjp96UrchnI5nkBfQljQO6m+39IM5B/\nSgG81wZQ2bb2Dw23kAznkTA2CxAkYIRYBDNtUucrAoGAYI0kxCs4CRW0foZUlYCJ\nKR0uIChuSQwjwF8shFq117+ndO1D8B7XTPybm3t+iey9ww95vw1Uh2qjqvygAZYV\n1WzPR2CK4uccsGiREUaldtbSPDZ1QKKFEFLWV5OXTK0fAKBv05AIteuyM3dVvgWD\nYM0sH2Zhw8exKwPQQSAdSo0=\n-----END PRIVATE KEY-----\n`,
        client_email: "talha-khalid@file-upload-427811.iam.gserviceaccount.com",
        client_id: "103160677148251988136",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/talha-khalid%40file-upload-427811.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
    },

    scopes: ['https://www.googleapis.com/auth/drive.file']

});

const drive = google.drive({ version: 'v3', auth });










const session = require("express-session");
const port = 5000
 

const Login = require('./models/Login')
const { Officer, Arrest, Crime, Criminal, Criminal_Alias, Jail, Sentence, Cases, Victim, Witness, Suspect, Evidence, Investigation } = require('./models/Blog')


connectDatabase()


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs")
app.use(
  session({
    secret: "cooltk20Pakistan1947COOLTK20",
    resave: false,
    saveUninitialized: false,
  })
);






//      ----------- All Routing and Logics Starts from here -----------






// Login/Sign-Up route ---> login/signup.ejs 
app.get("/",(req,res)=>{
  res.render("app-main/login-signup")
})




// home.ejs
app.get("/home",(req,res)=>{
  res.render("app-main/home")
})




// login route
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const securityKey = req.body.securityKey;
  const predefinedSecurityKey = '012azqa***p&<QA/';

  try{
    
    if(securityKey === predefinedSecurityKey){
    
      const foundUser = await Login.findOne({ email: email, password: password });

      if(foundUser){
        res.render('app-main/home', { user: foundUser });
      } 
      
      else{
        res.render('app-main/login-signup', { error: 'Invalid email or password.' });
      }
    } 
    
    else{
      res.render('app-main/login-signup', { error: 'Invalid security key.' });
    }
  } 
  
  catch(err){
    console.error(err);
    res.sendStatus(500);
  }

});




// signup route
app.post('/signup', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const securityKey = req.body.securityKey;
  const predefinedSecurityKey = '012azqa***p&<QA/';

  try{
    
    if(securityKey === predefinedSecurityKey){
      const newUser = new Login({
        name: name,
        email: email,
        password: password,
      });
      
      await newUser.save();
      
      res.render('app-main/home', { user: newUser });
    } 
    
    else{
      res.render('app-main/login-signup', { error: 'Invalid security key.' });
    }
  } 
  
  catch(err){
    console.error(err);
    res.sendStatus(500);
  }
});




// reset-password route
app.post('/reset-password', async (req, res) => {
  const email = req.body.email;
  const securityKey = req.body.securityKey;

  try{
    console.log('Reset password request received for email:', email);

    const predefinedSecurityKey = '012azqa***p&<QA/';

    if(securityKey === predefinedSecurityKey){
      const foundUser = await Login.findOne({ email: email });
      console.log('Found user:', foundUser);

      if(foundUser){
        const resetToken = crypto.randomBytes(20).toString('hex');
        console.log('Generated reset token:', resetToken);

        foundUser.resetToken = resetToken;
        foundUser.resetTokenExpiration = Date.now() + 3600000; // 1 hour

        await foundUser.save();

        const mailOptions = {
          from: 'tk839587@gmail.com',
              to: foundUser.email,
              subject: 'Password Reset Request for pakPOL Account',
              html: `
                <p>Dear User,</p>
                
                <p>I hope this email finds you well. We wanted to inform you that a password reset request has been received for your <b>pakPOL account – the advanced criminal management system</b>.</p>
                
                <p>To ensure the security of your account, we take all password-related matters seriously. If you did not initiate this request, kindly disregard this email, and your account remains safe and protected.</p>
                
                <p>However, if you indeed requested a password reset, we have provided a secure link below for you to proceed with resetting your password. Please click on the link to create a new password:</p>
                
                <a href="http://localhost:5000/reset-password/${resetToken}">Reset Password</a>
                
                <p>We are committed to maintaining a safe and efficient environment for managing criminal data, and your security remains our utmost priority.</p>
                
                <p>Thank you for choosing <b>PakPOL</b> to be your partner in crime management. We appreciate your trust and ongoing support in making our platform a reliable tool for law enforcement professionals.</p>
                
                <p><b>Best regards,<b></p>
                
                <p><b>Talha Khalid</b></p>
                
                <p><b>Founder and Head of pakPOL</b></p> 

              `
        };

        console.log('Sending password reset email to:', foundUser.email);
        await transporter.sendMail(mailOptions);

        res.render('app-main/reset-password', { success: true, error: null });
      } 
      
      else{
        res.render('app-main/reset-password', { error: 'Invalid email.' });
      }
    } 
    
    else{
      res.render('app-main/reset-password', {  error: 'Invalid security key.', securityKeyError: true });
    }
  } 
  
  catch(err){
    console.error(err);
    res.sendStatus(500);
  }
});




// /reset-password/:resetToken route
app.get('/reset-password/:resetToken', async (req, res) => {
  const resetToken = req.params.resetToken;

    try{
      console.log('Reset token:', resetToken);

      const foundUser = await Login.findOne({ resetToken: resetToken });
      console.log('Found user:', foundUser);

      if(foundUser && foundUser.resetTokenExpiration > Date.now()){
          res.render('app-main/reset-password', { resetToken: resetToken, user: foundUser, error: null, success: false });
      } 
      
      else{
          res.render('app-main/reset-password', { resetToken: resetToken, user: null, error: 'Invalid or expired reset token.', success: false });
      }
    } 
  
    catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
});




// Handle the password update
app.post('/reset-password/:resetToken', async (req, res) => {
  const resetToken = req.params.resetToken;
  const newPassword = req.body.newPassword;

  try{
      console.log('Reset token:', resetToken);

      const foundUser = await Login.findOne({ resetToken: resetToken });
      console.log('Found user:', foundUser);

      if(foundUser && foundUser.resetTokenExpiration > Date.now()){
        foundUser.password = newPassword;
        foundUser.resetToken = null;
        foundUser.resetTokenExpiration = null;
        await foundUser.save();

        res.render('app-main/password-reset-success', { message: 'Your password has been successfully reset.' });
      } 
      
      else{
          res.render('app-main/reset-password', { resetToken: null, user: null, error: 'Invalid or expired reset token.', success: false });
      }
  } 
  
  catch(err){
      console.error(err);
      res.sendStatus(500);
  }
});




 // Define GET route for rendering the login form
app.get("/login", (req, res) => {
  res.render("app-main/login-signup");  
});




// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    
    if(err){
      console.error('Error while destroying session:', err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/login');

  });

});










// -------------------- CRIMINAL'S SECTION --------------------


// Display all criminal ---> index.ejs
app.get("/criminal",async (req,res)=>{
  const criminal = await Criminal.find({})
  res.render("criminal/index",{criminal})
})




// Form to create new criminal  ---> new.ejs
app.get("/criminal/new",(req,res)=>{
  res.render("criminal/new")
})




// Create new criminal  ---> POST
app.post("/criminal", upload.single("Criminal_Image"), async (req, res) => {
  const { Criminal_Id, Criminal_Name, Criminal_CNIC, Criminal_Gender, Criminal_Height, Criminal_Weight,    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL } = req.body;
  
  const newCriminal = {
    Criminal_Id,
    Criminal_Name,
    Criminal_CNIC,
    Criminal_Gender,
    Criminal_Height,
    Criminal_Weight,
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image: req.file ? "/uploads/" + req.file.filename : null,
    Criminal_Image_URL
  };

  const criminal = new Criminal(newCriminal);
  await criminal.save();
  res.redirect("/criminal");

});




// Show details of a specific criminal ---> show.ejs
app.get("/criminal/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/show", { foundcriminal });
});




// Form to edit specific criminal ---> edit.ejs
app.get("/criminal/:id/edit",async (req,res)=>{
  const {id} = req.params
  const foundcriminal = await Criminal.findById(id)

  function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  const formattedDate = formatDateForInput(foundcriminal.Criminal_Published);  
  res.render("criminal/edit",{foundcriminal, formattedDate})
});




// Update specific criminal
app.patch("/criminal/:id", upload.single("Criminal_Image"), async (req, res) => {
  const { id } = req.params;
  
  const { Criminal_Id, Criminal_Name, Criminal_CNIC, Criminal_Gender, 
    Criminal_Height, 
    Criminal_Weight, 
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL } = req.body;
  
    let updatedCriminal = {
    Criminal_Id,
    Criminal_Name,
    Criminal_CNIC,
    Criminal_Gender,
    Criminal_Height,
    Criminal_Weight,
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL
  };

  if(req.file){
    updatedCriminal.Criminal_Image = "/uploads/" + req.file.filename;
  }

  await Criminal.findByIdAndUpdate(id, updatedCriminal);
  res.redirect("/criminal");
});




// Delete specific criminal
app.delete("/criminal/:id",async (req,res)=>{
  const {id} = req.params
  await Criminal.findByIdAndDelete(id)
  res.redirect("/criminal")
})




// Searching in Criminal portion
app.get("/search", async (req, res) => {
  const { searchName, searchType, searchId, searchRank } = req.query;

  try{
    const criminal_results = await Criminal.find({ Criminal_Name: { $regex: searchName, $options: 'i' } });

    const crime_results = await Crime.find({ Crime_Id: { $eq: searchId }, Crime_Type: { $regex: searchType, $options: 'i' } });

    const officer_results = await Officer.find({ Officer_Name: { $regex: searchName, $options: 'i' }, Officer_Rank: { $regex: searchRank, $options: 'i' } });

    const criminalalias_results = await Criminal_Alias.find({ Criminal_Alias_Name: { $regex: searchName, $options: 'i' } });

    const investigation_results = await Investigation.find({ Investigation_Id: { $eq: searchId } });

    const witness_results = await Witness.find({ Witness_Name: { $regex: searchName, $options: 'i' } });

    const suspect_results = await Suspect.find({ Suspect_Name: { $regex: searchName, $options: 'i' } });

    const jail_results = await Jail.find({ Jail_Name: { $regex: searchName, $options: 'i' } });

    const sentence_results = await Sentence.find({ Sentence_Id: { $eq: searchId } });

    const victim_results = await Victim.find({ Victim_Name: { $regex: searchName, $options: 'i' } });

    const case_results = await Cases.find({ Case_Name: { $regex: searchName, $options: 'i' }, Case_Id: { $eq: searchId } });

    const arrest_results = await Arrest.find({ Arrest_Id: searchId });

    const evidence_results = await Evidence.find({ Evidence_Type: { $regex: searchId, $options: 'i' }, Evidence_Id: { $eq: searchId } });

    const results = [
      ...criminal_results,
      ...officer_results,
      ...witness_results,
      ...criminalalias_results,
      ...suspect_results,
      ...evidence_results,
      ...sentence_results,
      ...jail_results,
      ...crime_results,
      ...arrest_results,
      ...investigation_results,
      ...case_results,
      ...victim_results
    ];

    res.render("app-main/search", { results });

  } 
  
  catch(error){
    console.error(error);
    res.status(500).send("An error occurred while searching.");
  }

});




app.get("/criminal/gallery/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/gallery-section", { foundcriminal });
});




app.get("/criminal/gallery/upload/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/upload-section/upload", { foundcriminal });
});




app.get("/criminal/gallery/upload/video/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/upload-section/upload-video", { foundcriminal });
});




app.get("/criminal/gallery/upload/image/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/upload-section/upload-image", { foundcriminal });
});




app.get("/criminal/gallery/explore/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/explore-section/explore", { foundcriminal });
});




app.get("/criminal/gallery/explore/video/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/explore-section/explore-video", { foundcriminal });
});




app.get("/criminal/gallery/explore/image/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("criminal/gallery/explore-section/explore-image", { foundcriminal });
});




app.post('/submit-interrogation-video/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  console.log('Request params:', req.params);  // Check if id is here
  const filePath = path.join(__dirname, 'public/uploads/', req.file.filename);
  const mimeType = req.file.mimetype;

  try {
    console.log('Searching for Criminal ID:', id);

      const foundcriminal = await Criminal.findById(id);
      if (!foundcriminal) {
          return res.status(404).json({ message: 'Criminal not found' });
      }

      const response = await drive.files.create({
          requestBody: {
              name: req.file.originalname,
              mimeType: mimeType,
          },
      
          media: {
              mimeType: mimeType,
              body: fs.createReadStream(filePath),
          },
      });

      const fileId = response.data.id;

      await drive.permissions.create({
          fileId: fileId,
          requestBody: {
              role: 'reader',
              type: 'anyone',
          },
      });

      const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

      const fileDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      Criminal_Interrogation_Video_Download_URL = fileDownloadUrl;

      Criminal_Interrogation_Video_View_URL = fileUrl;

      foundcriminal.Criminal_Interrogation_Video_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Interrogation_Video_View_URL = fileUrl;

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('criminal/gallery/explore-section/explore', { Criminal_Interrogation_Video_Download_URL, Criminal_Interrogation_Video_View_URL, foundcriminal  });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }
});




app.listen(port,() => {
  console.log(`Server listening at port ${port}`);
})

