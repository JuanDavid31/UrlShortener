var express = require("express");
var app = express();
var shortid = require('shortid');
var mongo = require("mongodb").MongoClient;

var urlDB = "mongodb://localhost:27017/urls";

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/guardar/:urlLarga", function(req, res){

    //acortarUrl(req.params.urlLarga);

    new Promise(function(resolve, reject){
         mongo.connect(urlDB, function(err, db){
            if(err) console.log("No me pude conectar");
            var objetoNuevo = {
                short: shortid.generate(),
                long: req.params.urlLarga
            }

            var coleccion = db.collection("urls");
            coleccion.insert(objetoNuevo, function(err, data){
                resolve(objetoNuevo);
            });
        });
    }).then(function(fromResolve){
        res.send(fromResolve);
    });
});

app.get("/go/:urlCorta", function(req, res){
    console.log("holi");
    new Promise(function(resolve, reject){
        mongo.connect(urlDB, function(err, db){
            if(err) console.log("No me pude conectar y me fui alv D:");
            var coleccion =  db.collection("urls");
            console.log("Me van a buscar: " + req.params.urlCorta);
            coleccion.find({short:req.params.urlCorta}).toArray(function(err, docs){
                resolve(docs[0].long);
            });
        });
    }).then(function(fromResolve){ console.log("Desde resolve: "+fromResolve);
        res.writeHead(301, {
            Location:"http://" + fromResolve
        });
    });

});

app.get("/vamo", function(req, res){
    res.writeHead(301, {Location:"http://google.com"});
    //res.end();
});

app.listen(3001, function(){
    console.log("Servidor iniciado");
});