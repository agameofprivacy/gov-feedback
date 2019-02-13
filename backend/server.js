const express = require("express");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

import schema from "./graphql/";
import organizations from "../backend/source_data.json";
import updated_organizations from "../backend/updated_data.json";

const app = express();
const PORT = process.env.PORT || "4000";
var credentials = require('./credentials');

// this is our MongoDB database
const dbRoute = credentials.dbRoute;

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    dbRoute,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(PORT, () => console.log(`SERVER running on PORT ${PORT}`));

// model imports
const Organization = require("./models/Organization");

// organizations.forEach(function(org){
  
//   var other_names = [];
//   org.other_names.forEach(function(other_name){
//     var other_name_obj = {
//       name: other_name.name
//     };
//     if (other_name.hasOwnProperty("label")){
//       other_name_obj["label"] = other_name.label;
//     }
//     other_names.push(other_name_obj)
//   })



//   var identifiers = [];
//   org.identifiers.forEach(function(identifier){
//     identifiers.push({
//       scheme: identifier.scheme,
//       identifier: identifier.identifier,
//     });
//   })

//   // if (org.parent_id !== "" && org.parent !== "") {
//   //   var parent_obj = new Parent({
//   //     name: org.parent,
//   //   })
  
//   //   parent_obj.identifier = new Identifier({
//   //     scheme: "OID",
//   //     identifier: org.parent_id,
//   //   })
//   //   parent_obj.save(err => {
//   //     if (err) console.log(err);
//   //   })

//   // }

//   var contact_details = [];
//   org.contact_details.forEach(function(contact_detail){
//     var contact_detail_obj = {
//       kind: contact_detail.type,
//       value: contact_detail.value
//     }
//     if (typeof contact_detail.label !== "undefined" && contact_detail.label !== "") {
//       contact_detail_obj["label"] = contact_detail.label;
//     }
//     contact_details.push(contact_detail_obj);
//   })

//   var updated_org = updated_organizations.find(obj => {
//     return obj.identifiers[0].identifier === org.identifiers[0].identifier;
//   })

  

//   let organization = new Organization({
//     name: org.name,
//     other_names: other_names,
//     identifiers: identifiers,
//     // parent: parent_obj,
//     contact_details: contact_details,
//     level: updated_org.level,
//     hierarchy: updated_org.hierarchy
//   })

//   console.log(organization);

//   organization.save(err => {
//     if (err) console.log(err);
//   })

// })

// // save parent organization reference
// organizations.forEach(function(org){
//   if (org.hasOwnProperty("parent_id")) {
//     Organization.findOne({ "identifiers.identifier": org.parent_id.identifier }, function(err, obj){
//       if (!err){
//         Organization.findOne({ "identifiers.identifier": org.identifiers[0].identifier}, function(err, thisOrg){
//           thisOrg.parent = obj._id;
//           thisOrg.save(function(err){
//             if (err) console.log(err);
//             console.log(`saved ${thisOrg.name}`);
//           })
//         })
//       } 
//     });
//   }
// })



// const mongoose = require("mongoose");
// const express = require("express");
// const bodyParser = require("body-parser");
// const logger = require("morgan");
// const Data = require("./data");

const API_PORT = 3001;
// const app = express();
const router = express.Router();

// var credentials = require('./credentials');

// // this is our MongoDB database
// const dbRoute = credentials.dbRoute;

// // connects our back end code with the database
// mongoose.connect(
//   dbRoute,
//   { useNewUrlParser: true }
// );

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// // (optional) only made for logging and
// // bodyParser, parses the request body to be a readable json format
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Organization.find((err, organizations) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, organizations: organizations });
  });
});

// // this is our update method
// // this method overwrites existing data in our database
// router.post("/updateData", (req, res) => {
//   const { id, update } = req.body;
//   Data.findOneAndUpdate(id, update, err => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
// });

// // this is our delete method
// // this method removes existing data in our database
// router.delete("/deleteData", (req, res) => {
//   const { id } = req.body;
//   Data.findOneAndDelete(id, err => {
//     if (err) return res.send(err);
//     return res.json({ success: true });
//   });
// });

// // this is our create methid
// // this method adds new data in our database
// router.post("/putData", (req, res) => {
//   let data = new Data();

//   const { id, message } = req.body;

//   if ((!id && id !== 0) || !message) {
//     return res.json({
//       success: false,
//       error: "INVALID INPUTS"
//     });
//   }
//   data.message = message;
//   data.id = id;
//   data.save(err => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
// });

// // append /api for our http requests
// app.use("/api", router);

// // launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
