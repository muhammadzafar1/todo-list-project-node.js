import express from "express";
import path from "path";
const app = express();


const publicpath=path.resolve('public')
app.use(express.static(publicpath))



app.set("view engine","ejs")


app.get('/',(request,response)=>{
response.render('list')
})


app.get('/add',(request,response)=>{
response.render("Add")
})


app.get('/update',(request,response)=>{
response.render("Update")
})


app.listen(3200)