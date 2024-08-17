const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  Badge_Number: {
    type: Number,
    required: true,
    unique: true
  },
  Officer_Name: {
    type: String,
    required: true
  },
  Officer_Rank: {
    type: String,
    required: false
  },
  Officer_Image: {
    type: String
  },
});




const arrestSchema = new mongoose.Schema({
  Arrest_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Arrest_Time: {
    type: Date,
    required: true
  },
  Arrest_Date: {
    type: Date,
    required: true
  },
  Arrest_Location: {
    type: String,
    required: true
  },
  Arrest_Reason: {
    type: String,
    required: true
  },
  Officer_Badge_Number: {
    type: Number,
    required: false,
    ref: 'Officer'
  }
});




const crimeSchema = new mongoose.Schema({
  Crime_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Crime_Type: {
    type: String,
    required: true
  },
  Crime_Location: {
    type: String,
    required: true
  },
  Crime_Date: {
    type: Date,
    required: true
  },
  Crime_Time: {
    type: Date,
    required: true
  },
  Criminal_Id: {
    type: Number,
    required: false,
    ref: 'Criminal'
  }
});




const criminalSchema = new mongoose.Schema({
  Criminal_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Criminal_Name: {
    type: String,
    required: true
  },
  Criminal_Gender: {
    type: String,
    required: true
  },
  Criminal_Height: {
    type: Number,
    required: true
  },
  Criminal_Weight: {
    type: Number,
    required: true
  },
  Criminal_CNIC: {
    type: Number,
    required: true,
    unique: true
  },
  Criminal_Image: {
    type: String
  },
  Criminal_Crime: {
    type: String,
    required: true
  },
  Criminal_WantedByCountry: {
    type: String,
    required: true
  },
  Criminal_Nationality: {
    type: String,
    required: true
  },
  Criminal_SpokenLanguages: {
    type: String,
    required: true
  },
  Criminal_StateOfCase: {
    type: String,
    required: true
  },
  Criminal_Published: {
    type: Date,
    required: true
  },
  Criminal_Interrogation_Video_Download_URL: String,
  Criminal_Interrogation_Video_View_URL: String,

  Criminal_Confession_Video_Download_URL: String,
  Criminal_Confession_Video_View_URL: String,
});




const criminalAliasSchema = new mongoose.Schema({
  Criminal_Alias_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Criminal_Alias_Name: {
    type: String,
    required: true
  },
  Criminal_Id: {
    type: Number,
    required: false,
    ref: 'Criminal'
  },
  Criminal_Image: {
    type: String
  },
});




const jailSchema = new mongoose.Schema({
  Jail_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Jail_Name: {
    type: String,
    required: true
  },
  Jail_Location: {
    type: String,
    required: true
  }
});




const sentenceSchema = new mongoose.Schema({
  Sentence_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Sentence_Length: {
    type: Number,
    required: true
  },
  Crime_Id: {
    type: Number,
    required: false,
    ref: 'Crime'
  },
  Jail_Id: {
    type: Number,
    required: false,
    ref: 'Jail'
  }
});




const casesSchema = new mongoose.Schema({
  Case_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Case_Name: {
    type: String,
    required: true
  },
  Case_Registered_Location: {
    type: String,
    required: true
  },
  Case_Date: {
    type: Date,
    required: true
  }
});




const victimSchema = new mongoose.Schema({
  Victim_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Victim_Name: {
    type: String,
    required: true
  },
  Victim_Gender: {
    type: String,
    required: true
  },
  Victim_Age: {
    type: Number,
    required: true
  },
  Case_Id: {
    type: Number,
    required: false,
    ref: 'Cases'
  },
  Victim_Image: {
    type: String
  },
});




const witnessSchema = new mongoose.Schema({
  Witness_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Witness_Name: {
    type: String,
    required: true
  },
  Witness_Gender: {
    type: String,
    required: true
  },
  Witness_Age: {
    type: Number,
    required: true
  },
  Case_Id: {
    type: Number,
    required: false,
    ref: 'Cases'
  },
  Witness_Image: {
    type: String
  },
});




const suspectSchema = new mongoose.Schema({
  Suspect_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Suspect_Name: {
    type: String,
    required: true
  },
  Suspect_Gender: {
    type: String,
    required: true
  },
  Suspect_Age: {
    type: Number,
    required: true
  },
  Case_Id: {
    type: Number,
    required: false,
    ref: 'Cases'
  },
  Suspect_Image: {
    type: String
  },
});




const evidenceSchema = new mongoose.Schema({
  Evidence_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Evidence_Type: {
    type: String,
    required: true
  },
  Evidence_Location: {
    type: String,
    required: true
  },
  Case_Id: {
    type: Number,
    required: false,
    ref: 'Cases'
  },
  Evidence_Image: {
    type: String
  },
});




const investigationSchema = new mongoose.Schema({
  Investigation_Id: {
    type: Number,
    required: true,
    unique: true
  },
  Investigation_Start_Date: {
    type: Date,
    required: true
  },
  Investigation_End_Date: {
    type: Date,
    required: true
  },
  Officer_Badge_Number: {
    type: Number,
    required: false,
    ref: 'Officer'
  },
  Case_Id: {
    type: Number,
    required: false,
    ref: 'Cases'
  }
});






const Officer = mongoose.model('Officer', officerSchema);
const Arrest = mongoose.model('Arrest', arrestSchema);
const Crime = mongoose.model('Crime', crimeSchema);
const Criminal = mongoose.model('Criminal', criminalSchema);
const Criminal_Alias = mongoose.model('Criminal_Alias', criminalAliasSchema);
const Jail = mongoose.model('Jail', jailSchema);
const Sentence = mongoose.model('Sentence', sentenceSchema);
const Cases = mongoose.model('Cases', casesSchema);
const Victim = mongoose.model('Victim', victimSchema);
const Witness = mongoose.model('Witness', witnessSchema);
const Suspect = mongoose.model('Suspect', suspectSchema);
const Evidence = mongoose.model('Evidence', evidenceSchema);
const Investigation = mongoose.model('Investigation', investigationSchema);




module.exports = {
  Officer,
  Arrest,
  Crime,
  Criminal,
  Criminal_Alias,
  Jail,
  Sentence,
  Cases,
  Victim,
  Witness,
  Suspect,
  Evidence,
  Investigation
};




Crime.find()
  .populate('Criminal_Id')
  .populate('Officer_Badge_Number')
  .exec()
  .then(crimes => {
    crimes.forEach(crime => {
      console.log('Crime:', crime);
      console.log('Associated Criminal:', crime.Criminal_Id);
      console.log('Associated Officer:', crime.Officer_Badge_Number);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Sentence.find()
  .populate('Crime_Id')
  .populate('Jail_Id')
  .exec()
  .then(sentences => {
    // Access the associated Crime and Jail documents for each Sentence
    sentences.forEach(sentence => {
      console.log('Sentence:', sentence);
      console.log('Associated Crime:', sentence.Crime_Id);
      console.log('Associated Jail:', sentence.Jail_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Victim.find()
  .populate('Case_Id')
  .exec()
  .then(victims => {
    // Access the associated Case document for each Victim
    victims.forEach(victim => {
      console.log('Victim:', victim);
      console.log('Associated Case:', victim.Case_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Witness.find()
  .populate('Case_Id')
  .exec()
  .then(witnesses => {
    // Access the associated Case document for each Witness
    witnesses.forEach(witness => {
      console.log('Witness:', witness);
      console.log('Associated Case:', witness.Case_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Suspect.find()
  .populate('Case_Id')
  .exec()
  .then(suspects => {
    suspects.forEach(suspect => {
      console.log('Suspect:', suspect);
      console.log('Associated Case:', suspect.Case_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Evidence.find()
  .populate('Case_Id')
  .exec()
  .then(evidences => {
    evidences.forEach(evidence => {
      console.log('Evidence:', evidence);
      console.log('Associated Case:', evidence.Case_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });




Investigation.find()
  .populate('Officer_Badge_Number')
  .populate('Case_Id')
  .exec()
  .then(investigations => {
    investigations.forEach(investigation => {
      console.log('Investigation:', investigation);
      console.log('Associated Officer:', investigation.Officer_Badge_Number);
      console.log('Associated Case:', investigation.Case_Id);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

  