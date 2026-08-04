import express from "express";
import path from "path";
import { MongoClient ,ObjectId } from "mongodb";
const app = express();

const dbname="node-project";
    const collectionname='todo';
    const client=new MongoClient("mongodb://localhost:27017");



    const connection= async()=>{
        const connect=await  client.connect();
    
return await connect.db(dbname).collection(collectionname);

    }


const publicpath=path.resolve('public')
app.use(express.static(publicpath))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:false} ))


app.get('/', async(request,response)=>{

const db=await connection();
const result=await db.find().toArray();



response.render('list',{result})
})


app.get('/add', (request,response)=>{


response.render("Add")
})


app.get('/update',(request,response)=>{
response.render("Update")
})
app.post('/update',(request,response)=>{
response.redirect("/")
})
app.post('/add',async(request,response)=>{
    const db= await connection();
const result =await db.insertOne(request.body);
console.log(result)
response.redirect("/")
})


app.get('/delete/:id',async(request,response)=>{
    const db= await connection();
const result =await db.deleteOne({_id:new ObjectId(request.params.id)});
if(result){
    response.redirect("/")

}
else{
    response.send("error")

}
response.redirect("/")

})

app.get('/update/:id',async(request,response)=>{
    const db= await connection();
const result =await db.findOne({_id:new ObjectId(request.params.id)});


if(result){
    response.render('update',{result})
}
else{
    response.send("error")
}

})

app.post('/update/:id',async(request,response)=>{
    const db= await connection();
const filter={_id:new ObjectId(request.params.id)};
const updatedata={$set:{tital:request.body.tital,description:request.body.description}};


const result =await db.updateOne(filter,updatedata);


if(result){
    response.redirect('/')
}
else{
    response.send("error")
}

})


app.post("/multy-delete", async (request, response) => {

    const db = await connection();

    let selectedtask;

    if (Array.isArray(request.body.slected)) {
        selectedtask = request.body.slected.map(
            id => new ObjectId(id)
        );
    } else {
        selectedtask = [
            new ObjectId(request.body.slected)
        ];
    }

    await db.deleteMany({
        _id: { $in: selectedtask }
    });

    response.redirect("/");
});




app.listen(3200)