
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookiePaser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require("./middleware/auth")
const { User } = require("./models/User")



// client에서 오는 정보를 분석에서 가져오르 수 있는 것이 body-parser => application/x-www-form-urlencoded  들어온 데이터를 분석해서 가져옴
app.use(express.urlencoded({ extended: true }))
// application.json 데이터를 분석해서 가져옴
app.use(express.json())
app.use(cookiePaser())



const mongoose = require('mongoose')
const { reset } = require('nodemon')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log('MongoDB Connected...', err))

app.get('/', (req, res) => res.send('HI'))

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청된 이메일이 db에 있다면 비밀번호가 맞는지  확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호까지 맞다면 토큰 생성 
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에?> 쿠키, 로컬스토리지.. 여기서는 쿠키에
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })

      })
    })
  })

})

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 애기는 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //0이면 일반 유저, 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    }
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
