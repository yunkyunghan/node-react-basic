
const express = require('express')
const app = express()
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hanyk:dbsrud12@boilerplate.gwosc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB Connected...',err))

app.get('/', (req, res) => res.send('Hello World!안녕하세요'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
