const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const slugify = require('slugify');
const Produto = require('../models/Produto');
const {auth} = require('../middleware/auth');


router.get("/clientes", auth, (req, res) => {
    Cliente.findAll({raw: true, order: [ ["id", "DESC"] 
    ]}).then(cliente =>{
        res.statusCode = 200;
        res.json(cliente);      
    }).catch(err => {
        console.log(err);
        res.sendstatus = 400;
    });
});

router.post("/cliente", auth, (req, res) =>{
    var nome = req.body.nome;
    var telefone = req.body.telefone;
    var endereco = req.body.endereco;
    
    Cliente.create({
        name: nome,
        slug: slugify(nome),
        phone: telefone,
        address: endereco

    }).then(() => {
        res.sendStatus(200);

    }).catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
    
});


router.get("/cliente/:id", auth, (req, res) => {
    var id = req.params.id;

    Cliente.findOne({
        where: {id: id},
    }).then(cliente =>{
        if(cliente != undefined){
            res.sendStatus = 200;
            res.json(cliente);    
        }else{
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(err);
    });
});

router.put("/cliente/:id", auth, (req, res) => {

    var id = req.params.id;

    if(id != undefined){
        if(!isNaN(id)){
            Cliente.findAll({where: {id: id}}).then(response => {
                if(response == ""){
                    res.sendStatus(404);
                }
                var {nome, endereco, telefone} = req.body;

                if(nome != undefined && endereco != undefined && telefone != undefined){

                    Cliente.update({name: nome, slug: slugify(nome), phone: telefone, address: endereco}, 
                        { where: { 
                            id: id 
                        }}).then(() => {
                            res.sendStatus(200);
                        }).catch(err => {
                            console.log(err);
                            res.sendStatus(404);
                        });
                }else{
                    res.sendStatus(400);
                }
            }).catch(err => {
                console.log(err);
                res.sendStatus(400);
            });          
        }else{
            res.sendStatus(400);
        }
    }else{
        res.sendStatus(400);
    }    
});

router.delete("/cliente/:id", auth, (req, res) => {
    var id = req.params.id;
    if(id != undefined){
        if(!isNaN(id)){
            Produto.findAll({
                where: {
                    clienteId: id
                }
            }).then(() => {
               
                Produto.destroy({
                    where: {
                        clienteId: id 
                    }
                }).then(() => {
                    Cliente.destroy({
                        where: {
                            id: id
                        }
                    }).then(() => {
                        res.sendStatus(200);
                    }).catch(() => {
                        res.sendStatus(400);
                    });
                }).catch(err => {
                    console.log(err);
                    res.sendStatus(404);
                });
            }).catch(err => {
                console.log(err);
                res.sendStatus(404);
            });
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(400);
    }
});

module.exports = router;