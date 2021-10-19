
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')

const config = require('./config/key')
const { User } = require("./models/User")


// client에서 오는 정보를 분석에서 가져오르 수 있는 것이 body-parser => application/x-www-form-urlencoded  들어온 데이터를 분석해서 가져옴
app.use(express.urlencoded({ extended: true }))
// application.json 데이터를 분석해서 가져옴
app.use(express.json())



const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log('MongoDB Connected...', err))

app.get('/', (req, res) => res.send('HI'))

app.post('/register', (req, res) => {
  // 회원가입 할 때 필요한 정보를 client에서 가져오면 
  // 그것들을 db에 넣어준다.

  const user = new User(req.body) // 인스턴스 생성
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  }) //mongodb에서 오는 method 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
