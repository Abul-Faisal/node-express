var express = require("express");
var app = express();
var fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/home", function (homereq, homeresponse) {
  homeresponse.sendFile(__dirname + "/public/home.html");
});

app.get("/adduser", function (adduserreq, adduserresponse) {
  adduserresponse.sendFile(__dirname + "/public/adduser.html");
});

app.get("/updateuser", function (updateuserreq, updateuserresponse) {
  updateuserresponse.sendFile(__dirname + "/public/updateuser.html");
});

app.get("/deleteuser", function (deleteuserreq, deleteuserresponse) {
  deleteuserresponse.sendFile(__dirname + "/public/deleteuser.html");
});

app.get("/displayuser", function (displayuserreq, displayuserresponse) {
  displayuserresponse.sendFile(__dirname + "/userdetails.txt");
});

app.post(
  "/adduserstatus",
  function (adduserstausrequest, adduserstausresponse) {
    let message;
    // console.log(adduserstausrequest.body);
    var formvalue = {
      username: adduserstausrequest.body.username,
      email: adduserstausrequest.body.email,
    };
    fs.readFile("userdetails.txt", (readerr, readvalue) => {
      if (readerr) throw readerr;
      if (readvalue) {
        let list;
        try {
          list = JSON.parse(readvalue);
          message = "updated";
        } catch (parseError) {
          console.log("parse error", parseError);
          list = [];
          message = "created";
        }
        let alreadypresent = list.findIndex((obj) => {
          console.log(obj);
          return obj.email == formvalue.email;
        });
        if (alreadypresent == -1) {
          list.push(formvalue);
          fs.writeFile(
            "userdetails.txt",
            JSON.stringify(list),
            (writeError) => {
              if (writeError) throw writeError;
              message = "User Details Added";
              adduserstausresponse.status(200).send(message);
            }
          );
        } else {
          message = "User Already Exists";
          adduserstausresponse.status(200).send(message);
        }
      }
    });
  }
);

app.get("/askeduserdetails", (askeduserrequest, askeduserresponse) => {
  var formvalue = {
    name: askeduserrequest.query.name,
    email: askeduserrequest.query.email,
  };
  console.log(formvalue.name);
  console.log(formvalue.email);
  let temp;
  let list;
  fs.readFile("userdetails.txt", (readerror, value) => {
    if (readerror) throw readerror;
    if (value) {
      list = JSON.parse(value);
      let alreadypresent = list.findIndex((obj) => {
        if (obj.email == formvalue.email) {
          obj.username = formvalue.name;
          temp = obj;
          fs.writeFile(
            "userdetails.txt",
            JSON.stringify(list),
            (writeError) => {
              if (writeError) throw writeError;
              askeduserresponse.status(200).send(temp);
            }
          );
        }
        return obj.email == formvalue.email;
      });

      if (alreadypresent == -1) {
        askeduserresponse.status(200).send("User not present in the list");
      }
    }
  });
});

app.get("/deleteuserstatus", (deleteuserrequest, deleteuserresponse) => {
  var formvalue = {
    email: deleteuserrequest.query.email,
  };
  console.log(formvalue.email);
  let temp;
  let list;
  fs.readFile("userdetails.txt", (readerror, value) => {
    if (readerror) throw readerror;
    if (value) {
      list = JSON.parse(value);
      let alreadypresent = -1;
      list.findIndex((obj) => {
        if (obj.email == formvalue.email) {
          // temp = obj;
          alreadypresent = 0;
          obj.username = "";
          obj.email = "";
          fs.writeFile(
            "userdetails.txt",
            JSON.stringify(list),
            (writeError) => {
              if (writeError) throw writeError;
              deleteuserresponse.status(200).send("User is deleted");
            }
          );
        }
      });

      if (alreadypresent == -1) {
        deleteuserresponse.status(200).send("User not present in the list");
      }
    }
  });
  // console.log(temp);
});

var server = app.listen(8087, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("The service address port http:%s:%s", host, port);
});
