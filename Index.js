const express = require("express")
const app = express()
const connectDatabase = require("./config/database")
const methodOverride = require("method-override");
const path = require("path");
const { v4: uuidv4 } = require("uuid");


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
  res.render("login-signup")
})




// home.ejs
app.get("/home",(req,res)=>{
  res.render("home")
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
        res.render('home', { user: foundUser });
      } 
      
      else{
        res.render('login-signup', { error: 'Invalid email or password.' });
      }
    } 
    
    else{
      res.render('login-signup', { error: 'Invalid security key.' });
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
      
      res.render('home', { user: newUser });
    } 
    
    else{
      res.render('login-signup', { error: 'Invalid security key.' });
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
              subject: 'Password Reset Request for PakPOL Account',
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
                
                <p><b>Founder and Head of PakPOL</b></p> 

              `
        };

        console.log('Sending password reset email to:', foundUser.email);
        await transporter.sendMail(mailOptions);

        res.render('reset-password', { success: true, error: null });
      } 
      
      else{
        res.render('reset-password', { error: 'Invalid email.' });
      }
    } 
    
    else{
      res.render('reset-password', {  error: 'Invalid security key.', securityKeyError: true });
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
          res.render('reset-password', { resetToken: resetToken, user: foundUser, error: null, success: false });
      } 
      
      else{
          res.render('reset-password', { resetToken: resetToken, user: null, error: 'Invalid or expired reset token.', success: false });
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

        res.render('password-reset-success', { message: 'Your password has been successfully reset.' });
      } 
      
      else{
          res.render('reset-password', { resetToken: null, user: null, error: 'Invalid or expired reset token.', success: false });
      }
  } 
  
  catch(err){
      console.error(err);
      res.sendStatus(500);
  }
});




 // Define GET route for rendering the login form
app.get("/login", (req, res) => {
  res.render("login-signup");  
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
    Criminal_Published } = req.body;
  
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
  res.render("criminal/edit",{foundcriminal})
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
    Criminal_Published } = req.body;
  
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
    Criminal_Published
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

    res.render("search", { results });

  } 
  
  catch(error){
    console.error(error);
    res.status(500).send("An error occurred while searching.");
  }

});
 



app.listen(port,() => {
  console.log(`Server listening at port ${port}`);
})
