const express = require("express");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");

const flash=require("connect-flash");

const schema = require("./graphql/");
const Topic = require("./models/Topic");
const Organization = require("./models/Organization");
const User = require("./models/User");
const app = express();
const PORT = process.env.PORT || "4000";
var credentials = require('./credentials');

// this is our MongoDB database
const dbRoute = credentials.dbRoute;
const formidable = require('formidable');
const {Storage} = require('@google-cloud/storage');

import * as serviceAccont from "./service-account-key.json";
const storage = new Storage(serviceAccont);
const PublicProfile = require("./models/PublicProfile");
const ObjectId = require('mongoose').Types.ObjectId;

const
  CLOUD_BUCKET = 'gov-feedback-images',
  UPLOAD_PATH = 'avatars';

  const bucket = storage.bucket(CLOUD_BUCKET);

  function getPublicUrl (lfile, name) {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${UPLOAD_PATH}/${name}.${lfile.name.split('.')[1]}`;
  }
  
  function createFileInStorage(lfile, name) {
    const options = {
      destination: bucket.file(`${UPLOAD_PATH}/${name}.${lfile.name.split('.')[1]}`),
      public: true,
      resumable: false,
      metadata: {
        contentType: lfile.type,
      }
    };
  
    return new Promise((resolve, reject) => {
      bucket.upload(lfile.path, options, function (err, file, apiResponse) {
        console.log('bucket.upload response', err, file, apiResponse);
        if (err) {
          reject(err);
        } else {
          resolve(getPublicUrl(lfile, name));
        }
      });
    });
  }
  
  function upload(req, res) {
    if (req.method.toLowerCase() === 'post') {
      // parse a file upload
      const form = new formidable.IncomingForm();
  
      form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
  
        const complete = (err, url) => {
          console.log("avatar url:", url);
          if (err) {
            console.log(err);
          } else {
            var query = {"user": new ObjectId(req.query.user_id)};
            var update = {"avatarUrl": url};
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };
        
            PublicProfile.findOneAndUpdate(query, update, options, function(error, result) {
                if (error) return;
                console.log(result);
            });
          }
        };

        console.log("files.upload files: ", files);
        console.log("req.query.user_id: ", req.query.user_id);

        createFileInStorage(Object.values(files)[0], req.query.user_id)
          .then((url) => complete(null, url))
          .catch((err) => complete(err));
      });
  
      return;
    }  
  }
    

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    dbRoute,
    {
      dbName: 'gov-feedback',
      useCreateIndex: true,
      useNewUrlParser: true,
      keepAlive: 1,
      connectTimeoutMS: 30000,
      readConcern: {level: "majority"},
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  var host;
  var remote = "https://gov-feedback-web.appspot.com";
  var local= "http://localhost:3000";
  host = local;

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', host);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
    });
    

app.use(
  "/graphql",
  cors(),
  expressGraphQL({
    schema,
    graphiql: true
  })
);

passport.use('local-login', new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
  console.log(req);
  User.findOne({"local.username": username}, (err, user) => {
    console.log("user hello", user);
    
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, req.flash('loginMessage', "No user found."));
    }
    if (!user.validPassword(password)) {
      console.log("wrong password")
      return done(null, false, req.flash('loginMessage', "Oops! Wrong password."));
    }
    console.log("local-login bye");
    return done(null, {
      id:user.id,
      username: user.local.username
    });
  })
}))

passport.use('local-signup', new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
  process.nextTick(() => {
    User.findOne({"local.username": username}, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }

      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        // if there's no user with the email
        // create the user

        var newUser = new User();
        newUser.local.username = username;
        newUser.local.password = newUser.generateHash(password);

        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        })
      }
    })
  })
}))


passport.serializeUser((user, done) => {
  console.log("user bye", user);
  done(null, {
    id:user.id,
    username: user.username
  });
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log("found user", user);
    done(err, user);
  })
})

app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
)
app.use(session({ 
  secret: 'ilovescotchscotchyscotchscotch', 
  resave: true, 
  saveUninitialized: true ,
  cookie: {
    secure: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/error',
  failureFlash: true
}), function(req, res){
  console.log("called back")
  console.log("isAuthenticated: ", req.isAuthenticated());
  res.json({"user": req.user});
  // req.logout();
  // req.logout();
  // console.log("isAuthenticated: ", req.isAuthenticated());
  // res.redirect('/');

  // res.send();
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/error',
  failureFlash: true
}));

app.get('/logout', function(req, res){
  req.logout();
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
})

app.post('/upload-avatar', (req, res) => {
  console.log(req);
  upload(req, res);
  // new formidable.IncomingForm().parse(req, (err, fields, files) => {
  //   if (err) {
  //     console.error('Error', err)
  //     throw err
  //   }
  //   console.log('Fields', fields)
  //   console.log('Files', files)
  //   Object.values(files).map(file => {
  //     console.log("file", file)
  //   })
  // })
})

app.listen(PORT, () => console.log(`SERVER running on PORT ${PORT}`));

// model imports
const Post = require("./models/Post");

Post.watch().on('change', data => {
  switch (data.operationType) {
    case 'insert':
      console.log('inserted', data);
      var topic = data.fullDocument.topic;
      var organization_id = data.fullDocument.organization_id;
      var organization_name = data.fullDocument.organization;

      Topic.findOne({name: topic})
      .exec((err, res) => {
        if (err) {console.log(err)} else {
          console.log("res", res);
          if (res === null) {
            // topic doesn't exist, create it
            Topic.create({
              name: topic,
              popularityAll: 1,
              popularityWeek: 1,
              orgsAll: [{
                name: organization_name,
                identifier: organization_id,
                count: 1
              }],
              orgsWeek: [{
                name: organization_name,
                identifier: organization_id,
                count: 1
              }]
            }).then(result => {
              console.log("created", result);
            })
          } else {
            // topic exists, update it
            var targetPopularityAll = res.hasOwnProperty("popularityAll") ? res.popularityAll + 1 : 1;
            var targetPopularityWeek = res.hasOwnProperty("popularityWeek") ? res.popularityWeek + 1 : 1;
            var targetOrgsAll;
            var targetOrgsWeek;

            var indexOfOrgAll = res.orgsAll.map(e => e.identifier).indexOf(organization_id);
            var indexOfOrgWeek = res.orgsWeek.map(e => e.identifier).indexOf(organization_id);
            if (indexOfOrgAll >= 0){
              // if topic already had organization, increment existing count
              targetOrgsAll = res.orgsAll;
              targetOrgsAll[indexOfOrgAll].count = targetOrgsAll[indexOfOrgAll].count + 1;
            } else {
              // topic didn't have organization, add to array
              targetOrgsAll = res.orgsAll;
              targetOrgsAll.push({
                name: organization_name,
                identifier: organization_id,
                count: 1
              })
            }
            if (indexOfOrgWeek >= 0){
              // if topic already had organization, increment existing count
              targetOrgsWeek = res.orgsWeek;
              targetOrgsWeek[indexOfOrgWeek].count = targetOrgsWeek[indexOfOrgWeek].count + 1;
            } else {
              // topic didn't have organization, add to array
              targetOrgsWeek = res.orgsWeek;
              targetOrgsWeek.push({
                name: organization_name,
                identifier: organization_id,
                count: 1
              })
            }
            Topic.updateOne({_id: res._id}, {
                popularityAll: targetPopularityAll,
                popularityWeek: targetPopularityWeek,
                orgsAll: targetOrgsAll,
                orgsWeek: targetOrgsWeek
              }, 
              (err, affected, res) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log(res);
                }
              }
            );
          }
        }
      })
      // update Organization

      Organization.findOne({"_id": organization_id})
      .exec((err, res) => {
        if (err) { console.log(err); }
        else {
          if (res === undefined) {
            // weird
            console.log("org not found", organization_id);
          } else {
            var targetTopicsAll;
            var targetTopicsWeek;

            var indexOfTopicAll = res.topicsAll.map(e => e.name).indexOf(topic);
            var indexOfTopicWeek = res.topicsWeek.map(e => e.name).indexOf(topic);
            if (indexOfTopicAll >= 0){
              // if topic already had organization, increment existing count
              targetTopicsAll = res.topicsAll;
              targetTopicsAll[indexOfTopicAll].count = targetTopicsAll[indexOfTopicAll].count + 1;
            } else {
              // topic didn't have organization, add to array
              targetTopicsAll = res.topicsAll;
              targetTopicsAll.push({
                name: topic,
                count: 1
              })
            }
            if (indexOfTopicWeek >= 0){
              // if topic already had organization, increment existing count
              targetTopicsWeek = res.topicsWeek;
              targetTopicsWeek[indexOfTopicWeek].count = targetTopicsWeek[indexOfTopicWeek].count + 1;
            } else {
              // topic didn't have organization, add to array
              targetTopicsWeek = res.topicsWeek;
              targetTopicsWeek.push({
                name: topic,
                count: 1
              })
            }

            // popularityAll++
            // popularityWeek++
            // topicsWeek find topic and increment count, add to array if doesn't exist
            // topicsAll find topic and increment count, add to array if doesn't exist
            Organization.updateOne({_id: res._id}, {
              popularityAll: res.hasOwnProperty("popularityAll") ? res.popularityAll + 1 : 1,
              popularityWeek: res.hasOwnProperty("popularityWeek") ? res.popularityWeek + 1 : 1,
              topicsAll: targetTopicsAll,
              topicsWeek: targetTopicsWeek
            }, 
            (err, affected, res) => {
              if (err) {
                console.log(err)
              } else {
                console.log(res);
              }
            }
            );
          }
        }
      });

    default:
      console.log(data.operationType);
      break;
  }
});
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
