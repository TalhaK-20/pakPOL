const express = require("express")
const app = express()
const connectDatabase = require("./config/database")
const methodOverride = require("method-override");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');
const math = require('mathjs');




const helmet = require('helmet'); 
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "https://drive.google.com"],
  },
}));




// Very Important to display Images from DRIVE
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-src 'self' https://drive.google.com");
  next();
});




// -------------------- For Local Storage --------------------




const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/app-main/uploads/");
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
 

const Login = require('./models/admin-login-app-main')
const { Officer, Arrest, Crime, Criminal, Criminal_Alias, Jail, Sentence, Cases, Victim, Witness, Suspect, Evidence, Investigation } = require('./models/crime-related-app-main')


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






//      ----------- All Routing and Logic Starts from here -----------






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
  const predefinedSecurityKey = '20';

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




// sign-up route
app.post('/signup', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const securityKey = req.body.securityKey;
  const predefinedSecurityKey = '20';

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

    const predefinedSecurityKey = '20';

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




// Download Image From Drive ----> Function

async function downloadImageFromDrive(fileId, destPath) {
  const drive = google.drive({ version: 'v3', auth });
  const dest = fs.createWriteStream(destPath);

  await new Promise((resolve, reject) => {
      drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' },
      (err, res) => {
          if (err) {
              return reject(err);
          }
          res.data
              .on('end', resolve)
              .on('error', reject)
              .pipe(dest);
      });
  });
}




// Display all criminal ---> index.ejs
app.get("/criminal",async (req,res)=>{
  const { filterType, filterDate, filterGender, filterDangerous } = req.query;
  const criminal = await Criminal.find({})
  res.render("crime-related-app-main/criminal/index",{criminal, filterType, filterDate, filterGender, filterDangerous})
})




// Form to create new criminal  ---> new.ejs
app.get("/criminal/new",(req,res)=>{
  res.render("crime-related-app-main/criminal/new")
})




// Create new criminal  ---> POST
app.post("/criminal", upload.single('file'), async (req, res) => {
  const {
    Criminal_Name, 
    CNIC, 
    Criminal_Gender, 
    Criminal_Height, 
    Criminal_Weight, 
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL } = req.body;

    const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);

    const mimeType = req.file.mimetype;

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

  const fileUrl = `https://drive.google.com/thumbnail?id=${fileId}`;


// ******************************************************************


// Download the image from Google Drive for face embedding extraction - Local Host Logic

const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

try {
    await downloadImageFromDrive(fileId, localFilePath);
} 

catch (error) {
    console.error('Error downloading image from Google Drive:', error);
    return res.status(500).send('Error downloading image from Google Drive.');
}


let faceEmbedding = [];

try {
    const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
        image_path: localFilePath
    });

    faceEmbedding = embeddingResponse.data.embedding;
} 

catch (error) {
    console.error('Error extracting face embedding:', error.response.data);
    return res.status(500).send('Error extracting face embedding.');
}


// ******************************************************************


fs.unlinkSync(localFilePath);


  async function getNextCriminalId() {
    const lastCriminal = await Criminal.findOne({}, {}, { sort: { Criminal_Id: -1 } });
    return lastCriminal ? lastCriminal.Criminal_Id + 1 : 1;
  }

  const newCriminalId = await getNextCriminalId();

  const newCriminal = {
    Criminal_Id: newCriminalId,
    Criminal_Name,
    CNIC,
    Criminal_Gender,
    Criminal_Height,
    Criminal_Weight,
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image: fileUrl,
    Criminal_Image_URL,

    filename: req.file.originalname,
    mimeType: mimeType,
    googleDriveId: fileId,
    fileUrl: fileUrl,

    face_embedding: faceEmbedding
  };

  const criminal = new Criminal(newCriminal);

  await criminal.save();
  fs.unlinkSync(filePath);

  res.redirect("/criminal");

});




// -------------------- Face Detection Based Search --------------------


// Threshold for similarity (0.6 is a good start; adjust based on tests)
const similarityThreshold = 1.0;


// Euclidean Distance Calculation
function euclideanDistanceFace(vector1, vector2) {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
        sum += (vector1[i] - vector2[i]) ** 2;
    }
    return Math.sqrt(sum);
}




app.get('/advanced-face-recognition-search', (req, res) => {
  res.render('app-main/face-search', { results: null });
});




app.post("/advanced-face-recognition-search", upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);

  const response = await drive.files.create({
      requestBody: {
          name: req.file.originalname,
          mimeType: req.file.mimetype,
      },
      
      media: {
          mimeType: req.file.mimetype,
          body: fs.createReadStream(filePath),
      },
  });


  const fileId = response.data.id;
  const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

  try {
    await downloadImageFromDrive(fileId, localFilePath);
  } 
  
  catch (error) {
      console.error('Error downloading image from Google Drive:', error);
      fs.unlinkSync(localFilePath);
      
      return res.render('app-main/error-face-recognition', {
          message: 'Error downloading image from Google Drive. There may be network issues or internal errors.'
      
      });
  }

  let faceDetectionResponse;
  
  try {
      faceDetectionResponse = await axios.post('http://127.0.0.1:5001/detect-face', {
          image_path: localFilePath
      });

      const faceCount = faceDetectionResponse.data.face_count;

      if (faceCount === 0) {
          fs.unlinkSync(localFilePath);
          return res.render('app-main/error-face-recognition', {
              message: 'No face detected in the uploaded image. Please upload an image with a clear face.'
          });
      }
  } 
  
  catch (error) {
      console.error('Error detecting face:', error.response?.data || error.message);
      
      fs.unlinkSync(localFilePath);
      return res.render('app-main/error-face-recognition', {
          message: 'Error detecting face. There may be network issues or internal server errors.'
      });
  }

  let queryEmbedding;

  try {
      const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
          image_path: localFilePath,
          enforce_detection: true
      });

      queryEmbedding = embeddingResponse.data.embedding;
  } 
  
  catch (error) {
      console.error('Error extracting face embedding:', error.response?.data || error.message);
      fs.unlinkSync(localFilePath);
      
      return res.render('app-main/error-face-recognition', {
          message: 'Error extracting face embedding. May be the face in the image is not clear or some network connectivity problem exist'
      });
  }

  fs.unlinkSync(localFilePath);

  const criminals = await Criminal.find({});
  const matches = criminals.filter(criminal => {
      const dbEmbedding = criminal.face_embedding;
      const distance = euclideanDistanceFace(queryEmbedding, dbEmbedding);
      return distance < similarityThreshold;
  });

  res.render('app-main/face-search', { results: matches });

});




// -------------------- Fingerprint Pattern Based Search --------------------


app.get('/advanced-fingerprint-recognition-search', (req, res) => {
  res.render('app-main/fingerprint-search', { results: null });
});




function euclideanDistance(vecA, vecB) {
  if (vecA.length !== vecB.length) {
      throw new Error('Feature length mismatch between query and database');
  }
  
  const diff = vecA.map((val, idx) => val - vecB[idx]);
  const sumOfSquares = diff.reduce((sum, val) => sum + val * val, 0);
  return Math.sqrt(sumOfSquares);
}




function compareMinutiae(minutiae1, minutiae2, similarityThreshold = 10.0) {
  if (minutiae1.length === 0 || minutiae2.length === 0) return false;

  let matchCount = 0;

  minutiae1.forEach(m1 => {
      minutiae2.forEach(m2 => {
          if (m1.type === m2.type) {
              const distance = Math.sqrt(
                  Math.pow(m1.position[0] - m2.position[0], 2) +
                  Math.pow(m1.position[1] - m2.position[1], 2)
              );

              // Optional: Consider orientation differences
              // const orientationDiff = Math.abs(m1.orientation - m2.orientation);
              // if (distance < similarityThreshold && orientationDiff < orientationThreshold) {

              if (distance < similarityThreshold) {
                  matchCount++;
              }
          }
      });
  });

  const requiredMatches = Math.floor(0.4 * minutiae1.length);
  return matchCount >= requiredMatches;
}




app.post("/advanced-fingerprint-recognition-search", upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);

  let response;
  
  try {
      response = await drive.files.create({
          requestBody: {
              name: req.file.originalname,
              mimeType: req.file.mimetype,
          },
          
          media: {
              mimeType: req.file.mimetype,
              body: fs.createReadStream(filePath),
          },
      });
  } 
  
  catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      return res.render('app-main/error-fingerprint-recognition', {
          message: 'Error uploading file to Google Drive. Please try again later.'
      });
  }

  const fileId = response.data.id;
  const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

  try {
      await downloadImageFromDrive(fileId, localFilePath);
  } 
  
  catch (error) {
      console.error('Error downloading image from Google Drive:', error);
      return res.render('app-main/error-fingerprint-recognition', {
          message: 'Error downloading image from Google Drive. Please check your network connection.'
      });
  }

  let queryMinutiae;
  
  try {
      const featureResponse = await axios.post('http://127.0.0.1:5002/extract-fingerprint-features', {
          image_path: localFilePath,
          enforce_detection: true
      });

      queryMinutiae = featureResponse.data.minutiae;
  } 
  
  catch (error) {
      console.error('Error extracting fingerprint minutiae:', error.response?.data || error.message);
      return res.render('app-main/error-fingerprint-recognition', {
          message: 'Error extracting fingerprint minutiae. Please ensure the image is clear and try again.'
      });
  }

  fs.unlinkSync(localFilePath);
  fs.unlinkSync(filePath);

  const criminals = await Criminal.find({});
  const validCriminals = criminals.filter(criminal => {
      const minutiae = criminal.Criminal_Fingerprint_Image_1_Minutiae;
      return minutiae && minutiae.length > 0;
  });

  const similarityThreshold = 10.0;

  const matches = validCriminals.filter(criminal => {
      const dbMinutiae = criminal.Criminal_Fingerprint_Image_1_Minutiae;

      return compareMinutiae(queryMinutiae, dbMinutiae, similarityThreshold);
  });

  if (matches.length === 0) {
      return res.render('app-main/error-fingerprint-recognition', {
          message: 'No matching fingerprints found. Please try with a different fingerprint image.'
      });
  }

  res.render('app-main/fingerprint-search', { results: matches });

});




// Show details of a specific criminal ---> show.ejs
app.get("/criminal/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/show", { foundcriminal });
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
  res.render("crime-related-app-main/criminal/edit",{foundcriminal, formattedDate})
});




// Update specific criminal
app.patch("/criminal/:id", upload.single("Criminal_Image"), async (req, res) => {
  
  const { id } = req.params;
  
  const {
    Criminal_Name, 
    CNIC, 
    Criminal_Gender, 
    Criminal_Height, 
    Criminal_Weight, 
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL,
  } = req.body;

  const existingCriminal = await Criminal.findById(id);

  let updatedCriminal = {
    Criminal_Name,
    CNIC,
    Criminal_Gender,
    Criminal_Height,
    Criminal_Weight,
    Criminal_Crime,
    Criminal_WantedByCountry,
    Criminal_Nationality,
    Criminal_SpokenLanguages,
    Criminal_StateOfCase,
    Criminal_Published,
    Criminal_Image_URL,
  };

  if (req.file) {
    const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
    
    const mimeType = req.file.mimetype;

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

    const fileUrl = `https://drive.google.com/thumbnail?id=${fileId}`;

    updatedCriminal = {
      ...updatedCriminal,
      Criminal_Image: fileUrl,
      filename: req.file.originalname,
      mimeType: mimeType,
      googleDriveId: fileId,
      fileUrl: fileUrl,
    };

    fs.unlinkSync(filePath);
  } 
  
  else {
    updatedCriminal = {
      ...updatedCriminal,
      Criminal_Image: existingCriminal.Criminal_Image,
      filename: existingCriminal.filename,
      mimeType: existingCriminal.mimeType,
      googleDriveId: existingCriminal.googleDriveId,
      fileUrl: existingCriminal.fileUrl,
    };
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

  const { searchName, searchType, searchId, searchRank, searchCrime } = req.query;

  try {
    const searchNameRegex = searchName ? { $regex: searchName, $options: 'i' } : null;
    
    const searchCrimeRegex = searchCrime ? { $regex: searchCrime, $options: 'i' } : null;
    
    const searchTypeRegex = searchType ? { $regex: searchType, $options: 'i' } : null;
    
    const searchRankRegex = searchRank ? { $regex: searchRank, $options: 'i' } : null;
    
    const criminal_results = searchNameRegex 
      ? await Criminal.find({ Criminal_Name: searchNameRegex })
      : [];
    
    const criminal_crime_results = searchCrimeRegex 
      ? await Criminal.find({ Criminal_Crime: searchCrimeRegex }) 
      : [];

    const crime_results = searchId 
      ? await Crime.find({ Crime_Id: searchId, Crime_Type: searchTypeRegex || undefined })
      : [];

    const officer_results = searchNameRegex 
      ? await Officer.find({ Officer_Name: searchNameRegex, Officer_Rank: searchRankRegex || undefined })
      : [];

    const criminalalias_results = searchNameRegex 
      ? await Criminal_Alias.find({ Criminal_Alias_Name: searchNameRegex })
      : [];

    const investigation_results = searchId 
      ? await Investigation.find({ Investigation_Id: searchId })
      : [];

    const witness_results = searchNameRegex 
      ? await Witness.find({ Witness_Name: searchNameRegex })
      : [];

    const suspect_results = searchNameRegex 
      ? await Suspect.find({ Suspect_Name: searchNameRegex })
      : [];

    const jail_results = searchNameRegex 
      ? await Jail.find({ Jail_Name: searchNameRegex })
      : [];

    const sentence_results = searchId 
      ? await Sentence.find({ Sentence_Id: searchId })
      : [];

    const victim_results = searchNameRegex 
      ? await Victim.find({ Victim_Name: searchNameRegex })
      : [];

    const case_results = searchId 
      ? await Cases.find({ Case_Name: searchNameRegex || undefined, Case_Id: searchId })
      : [];

    const arrest_results = searchId 
      ? await Arrest.find({ Arrest_Id: searchId })
      : [];

    const evidence_results = searchId 
      ? await Evidence.find({ Evidence_Type: searchTypeRegex || undefined, Evidence_Id: searchId })
      : [];

    const results = [
      ...criminal_results,
      ...criminal_crime_results,
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
  
  catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while searching.");
  }

});










// -------------------- CRIMINAL'S GALLERY SECTION --------------------


app.get("/criminal/gallery/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/gallery-section", { foundcriminal });
});




app.get("/criminal/gallery/upload/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/upload-section/upload", { foundcriminal });
});




app.get("/criminal/gallery/upload/video/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/upload-section/upload-video", { foundcriminal });
});




app.get("/criminal/gallery/upload/image/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/upload-section/upload-image", { foundcriminal });
});




app.get("/criminal/gallery/explore/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/explore-section/explore", { foundcriminal });
});




app.get("/criminal/gallery/explore/video/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/explore-section/explore-video", { foundcriminal });
});




app.get("/criminal/gallery/explore/image/:id", async (req, res) => {
  const { id } = req.params;
  const foundcriminal = await Criminal.findById(id);
  res.render("crime-related-app-main/criminal/gallery/explore-section/explore-image", { foundcriminal });
});




app.post('/submit-interrogation-video/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);
  
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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

      Criminal_Interrogation_Video_Uploading_Date = Date.now();

      foundcriminal.Criminal_Interrogation_Video_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Interrogation_Video_View_URL = fileUrl;

      foundcriminal.Criminal_Interrogation_Video_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Interrogation_Video_Download_URL, Criminal_Interrogation_Video_View_URL, Criminal_Interrogation_Video_Uploading_Date, foundcriminal });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }
});




app.post('/submit-confession-video/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);
  
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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

      Criminal_Confession_Video_Download_URL = fileDownloadUrl;

      Criminal_Confession_Video_View_URL = fileUrl;

      Criminal_Confession_Video_Uploading_Date = Date.now();

      foundcriminal.Criminal_Confession_Video_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Confession_Video_View_URL = fileUrl;

      foundcriminal.Criminal_Confession_Video_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Confession_Video_Download_URL, Criminal_Confession_Video_View_URL, Criminal_Confession_Video_Uploading_Date, foundcriminal });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }
});




app.post('/submit-old-image-1/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);
  
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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




// ****************************************************************

// Download the image from Google Drive for face embedding extraction
const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

try {
    await downloadImageFromDrive(fileId, localFilePath);
} 

catch (error) {
    console.error('Error downloading image from Google Drive:', error);
    return res.status(500).send('Error downloading image from Google Drive.');
}

let faceEmbedding = [];

try {
    const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
        image_path: localFilePath
    });
    
    faceEmbedding = embeddingResponse.data.embedding;
} 

catch (error) {
    console.error('Error extracting face embedding:', error.response.data);
    return res.status(500).send('Error extracting face embedding.');
}

fs.unlinkSync(localFilePath);

// ****************************************************************

      Criminal_Old_Image_1_Download_URL = fileDownloadUrl;

      Criminal_Old_Image_1_View_URL = fileUrl;
      
      Criminal_Old_Image_1_Face_Embedding = faceEmbedding;

      Criminal_Old_Image_1_Uploading_Date = Date.now();

      foundcriminal.Criminal_Old_Image_1_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Old_Image_1_View_URL = fileUrl;

      foundcriminal.Criminal_Old_Image_1_Face_Embedding = faceEmbedding

      foundcriminal.Criminal_Old_Image_1_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Old_Image_1_Download_URL, Criminal_Old_Image_1_View_URL, Criminal_Old_Image_1_Uploading_Date, foundcriminal, Criminal_Old_Image_1_Face_Embedding });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }

});




app.post('/submit-old-image-2/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);
  
  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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




// ****************************************************************

// Download the image from Google Drive for face embedding extraction
const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

try {
    await downloadImageFromDrive(fileId, localFilePath);
} 

catch (error) {
    console.error('Error downloading image from Google Drive:', error);
    return res.status(500).send('Error downloading image from Google Drive.');
}

let faceEmbedding = [];

try {
    const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
        image_path: localFilePath
    });
    
    faceEmbedding = embeddingResponse.data.embedding;
} 

catch (error) {
    console.error('Error extracting face embedding:', error.response.data);
    return res.status(500).send('Error extracting face embedding.');
}

fs.unlinkSync(localFilePath);

// ****************************************************************

      Criminal_Old_Image_2_Download_URL = fileDownloadUrl;

      Criminal_Old_Image_2_View_URL = fileUrl;

      Criminal_Old_Image_2_Face_Embedding = faceEmbedding;

      Criminal_Old_Image_2_Uploading_Date = Date.now();

      foundcriminal.Criminal_Old_Image_2_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Old_Image_2_View_URL = fileUrl;

      foundcriminal.Criminal_Old_Image_2_Face_Embedding = faceEmbedding;

      foundcriminal.Criminal_Old_Image_2_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Old_Image_2_Download_URL, Criminal_Old_Image_2_View_URL, Criminal_Old_Image_2_Uploading_Date,  foundcriminal, Criminal_Old_Image_2_Face_Embedding });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }

});




app.post('/submit-latest-image-1/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);

  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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




// ****************************************************************

// Download the image from Google Drive for face embedding extraction
const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

try {
    await downloadImageFromDrive(fileId, localFilePath);
} 

catch (error) {
    console.error('Error downloading image from Google Drive:', error);
    return res.status(500).send('Error downloading image from Google Drive.');
}

let faceEmbedding = [];

try {
    const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
        image_path: localFilePath  // Path to the downloaded image
    });
    
    faceEmbedding = embeddingResponse.data.embedding; // Extracted embedding
} 

catch (error) {
    console.error('Error extracting face embedding:', error.response.data);
    return res.status(500).send('Error extracting face embedding.');
}

fs.unlinkSync(localFilePath);

// ****************************************************************

      Criminal_Latest_Image_1_Download_URL = fileDownloadUrl;

      Criminal_Latest_Image_1_View_URL = fileUrl;

      Criminal_Latest_Image_1_Face_Embedding = faceEmbedding;

      Criminal_Latest_Image_1_Uploading_Date = Date.now();

      foundcriminal.Criminal_Latest_Image_1_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Latest_Image_1_View_URL = fileUrl;

      foundcriminal.Criminal_Latest_Image_1_Face_Embedding = faceEmbedding;

      foundcriminal.Criminal_Latest_Image_1_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Latest_Image_1_Download_URL, Criminal_Latest_Image_1_View_URL, Criminal_Latest_Image_1_Uploading_Date, foundcriminal, Criminal_Latest_Image_1_Face_Embedding });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }

});




app.post('/submit-latest-image-2/:id', upload.single('file'), async (req, res) => {
  
  const { id } = req.params;
  console.log('Request params:', req.params);

  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
  
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


// ****************************************************************

// Download the image from Google Drive for face embedding extraction
const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

try {
    await downloadImageFromDrive(fileId, localFilePath);
} 

catch (error) {
    console.error('Error downloading image from Google Drive:', error);
    return res.status(500).send('Error downloading image from Google Drive.');
}

let faceEmbedding = [];

try {
    const embeddingResponse = await axios.post('http://127.0.0.1:5001/extract-embedding', {
        image_path: localFilePath
    });
    
    faceEmbedding = embeddingResponse.data.embedding;
} 

catch (error) {
    console.error('Error extracting face embedding:', error.response.data);
    return res.status(500).send('Error extracting face embedding.');
}

fs.unlinkSync(localFilePath);

// ****************************************************************

      Criminal_Latest_Image_2_Download_URL = fileDownloadUrl;

      Criminal_Latest_Image_2_View_URL = fileUrl;

      Criminal_Latest_Image_2_Face_Embedding = faceEmbedding;

      Criminal_Latest_Image_2_Uploading_Date = Date.now();

      foundcriminal.Criminal_Latest_Image_2_Download_URL = fileDownloadUrl;

      foundcriminal.Criminal_Latest_Image_2_View_URL = fileUrl;

      foundcriminal.Criminal_Latest_Image_2_Face_Embedding = faceEmbedding;

      foundcriminal.Criminal_Latest_Image_2_Uploading_Date = Date.now();

      await foundcriminal.save();

      fs.unlinkSync(filePath);

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', { Criminal_Latest_Image_2_Download_URL, Criminal_Latest_Image_2_View_URL, Criminal_Latest_Image_2_Uploading_Date, foundcriminal, Criminal_Latest_Image_2_Face_Embedding });
  } 

  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting assignment', error });
  }

});




function compareMinutiae(minutiae1, minutiae2, similarityThreshold = 10.0) {
  if (minutiae1.length === 0 || minutiae2.length === 0) return false;

  let matchCount = 0;

  minutiae1.forEach(m1 => {
      minutiae2.forEach(m2 => {
          if (m1.type === m2.type) {
              const distance = Math.sqrt(
                  Math.pow(m1.position[0] - m2.position[0], 2) +
                  Math.pow(m1.position[1] - m2.position[1], 2)
              );
              if (distance < similarityThreshold) {
                  matchCount++;
              }
          }
      });
  });

  const requiredMatches = Math.floor(0.4 * minutiae1.length);
  return matchCount >= requiredMatches;
}




app.post('/submit-fingerprint-image-1/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  console.log('Request params:', req.params);

  const filePath = path.join(__dirname, 'public/app-main/uploads/', req.file.filename);
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

      const localFilePath = path.join(__dirname, 'public/app-main/uploads/', req.file.originalname);

      try {
          await downloadImageFromDrive(fileId, localFilePath);
      } 
      
      catch (error) {
          console.error('Error downloading image from Google Drive:', error);
          return res.status(500).send('Error downloading image from Google Drive.');
      }

      let queryMinutiae;
      
      try {
          const featureResponse = await axios.post('http://127.0.0.1:5002/extract-fingerprint-features', {
              image_path: localFilePath
          });

          queryMinutiae = featureResponse.data.minutiae;
      } 

      catch (error) {
          console.error('Error extracting fingerprint minutiae:', error.response?.data || error.message);
          return res.status(500).send('Error extracting fingerprint minutiae. Please ensure the image is clear and try again.');
      }

      fs.unlinkSync(localFilePath);
      fs.unlinkSync(filePath);

      foundcriminal.Criminal_Fingerprint_Image_1_Download_URL = fileDownloadUrl;
      foundcriminal.Criminal_Fingerprint_Image_1_View_URL = fileUrl;
      foundcriminal.Criminal_Fingerprint_Image_1_Minutiae = queryMinutiae;
      foundcriminal.Criminal_Fingerprint_Image_1_Uploading_Date = Date.now();

      await foundcriminal.save();

      res.render('crime-related-app-main/criminal/gallery/explore-section/explore', {
          Criminal_Fingerprint_Image_1_Download_URL: fileDownloadUrl,
          Criminal_Fingerprint_Image_1_View_URL: fileUrl,
          Criminal_Fingerprint_Image_1_Uploading_Date: foundcriminal.Criminal_Fingerprint_Image_1_Uploading_Date,
          foundcriminal,
          Criminal_Fingerprint_Image_1_Minutiae: queryMinutiae
      });
  } 
  
  catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error submitting fingerprint image', error });
  }

});




app.get("/criminals", async (req, res) => {
  
  const { filterType, filterDate, filterGender, filterDangerous } = req.query;

  let filterCriteria = {};

    if (filterType) {
      const words = filterType.split(' ').map(word => word.trim()).filter(word => word.length > 0);

      if (words.length > 0) {
        filterCriteria.Criminal_Crime = {
          $regex: words.join('|'),  // Use regex OR to match any word
          $options: 'i'  // Case Insensitive
        };

      }

    }

  if (filterDate) {
    const now = new Date();
    let startDate;
    
    switch (filterDate) {
      
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      
      case "yesterday":
        startDate = new Date(now.setDate(now.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        break;
      
      case "last_week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      
      case "last_month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      
      case "last_year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      
      default:
        startDate = null;
    }

    if (startDate) {
      filterCriteria.Criminal_Published = { $gte: startDate };
    }

  }

  if (filterGender) {
    filterCriteria.Criminal_Gender = filterGender;
  }

  if (filterDangerous) {
    filterCriteria.Criminal_StateOfCase = { $regex: filterDangerous, $options: 'i' };
  }

  try {
    const criminals = await Criminal.find(filterCriteria);
    
    res.render("crime-related-app-main/criminal/index", { criminal: criminals, filterType, filterDate, filterGender, filterCriteria, filterDangerous });
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving the records.");
  }

});




app.listen(port,() => {
  console.log(`Server listening at port ${port}`);
})
