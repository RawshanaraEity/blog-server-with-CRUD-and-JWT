const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const { ServerApiVersion, MongoClient, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkpsd7x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const blogCollection = client.db('blogDB').collection('blogs');
    const wishlistCollection = client.db("blogDB").collection("wishlist");


    // get all blogs 
    app.get('/blogs', async(req, res) =>{
        const result = await blogCollection.find().toArray()
        // console.log(result)
        res.send(result)
      })


      // update blogs
      app.put('/blogs/:id', async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true }
      const updatedBlog = req.body
      console.log(updatedBlog)

      const blog = {
          $set: {
              image: updatedBlog.image, 
              title: updatedBlog.title, 
              author_img: updatedBlog.author_img, 
              author_name: updatedBlog.author_name, 
              category: updatedBlog.category, 
              short_description: updatedBlog.short_description, 
              long_description: updatedBlog.long_description, 
              date: updatedBlog.date, 
              current_time: updatedBlog.current_time, 
          }
      }

      const result = await blogCollection.updateOne(filter, blog, options);
      res.send(result);
  })




         // post data in wishlist
    app.post('/wishlist', async(req, res) =>{
        const blogs = req.body;
        const result = await wishlistCollection.insertOne(blogs);
        console.log(result)
        res.send(result)
      })

      app.get('/wishlist', async(req, res) =>{
        const result = await wishlistCollection.find().toArray()
        console.log(result)
        res.send(result)
      })

      app.delete('/wishlist/:id', async(req, res) => {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        };
        const result = await wishlistCollection.deleteOne(query);
        res.send(result)
    })
  


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('blog server is running')
})

app.listen(port, () =>{
    console.log(`blog server is running on port: ${port}`);
})
