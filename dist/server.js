"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _mongodbConfig = require('./config/database/mongodbConfig');
var _envVariablesConfig = require('./config/envVariablesConfig'); var _envVariablesConfig2 = _interopRequireDefault(_envVariablesConfig);
var _bodyparser = require('body-parser'); var _bodyparser2 = _interopRequireDefault(_bodyparser);
var _lessonRoute = require('./routes/api/lessonRoute'); var _lessonRoute2 = _interopRequireDefault(_lessonRoute);
var _wordRoute = require('./routes/api/wordRoute'); var _wordRoute2 = _interopRequireDefault(_wordRoute);
var _studyRoute = require('./routes/api/studyRoute'); var _studyRoute2 = _interopRequireDefault(_studyRoute);
var _userRoute = require('./routes/api//userRoute'); var _userRoute2 = _interopRequireDefault(_userRoute);
var _authRoute = require('./routes/api/authRoute'); var _authRoute2 = _interopRequireDefault(_authRoute);
var _emailRoute = require('./routes/api/emailRoute'); var _emailRoute2 = _interopRequireDefault(_emailRoute);
var _feedbackRoute = require('./routes/api/feedbackRoute'); var _feedbackRoute2 = _interopRequireDefault(_feedbackRoute);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _authMiddleware = require('./middlewares/authMiddleware'); var _authMiddleware2 = _interopRequireDefault(_authMiddleware);
var _cookieparser = require('cookie-parser'); var _cookieparser2 = _interopRequireDefault(_cookieparser);

_mongodbConfig.mongoConnection.connect()

const app = _express2.default.call(void 0, )

app.use(_cors2.default.call(void 0, { credentials: true, origin: _envVariablesConfig2.default.CLIENT_BASE_URL }))
app.use(_bodyparser2.default.json())
app.use(_cookieparser2.default.call(void 0, ))

app.use('/lesson', _authMiddleware2.default, _lessonRoute2.default)
app.use('/word', _authMiddleware2.default, _wordRoute2.default)
app.use('/study', _authMiddleware2.default, _studyRoute2.default)
app.use('/feedback', _authMiddleware2.default, _feedbackRoute2.default)
app.use('/user', _userRoute2.default)
app.use('/auth', _authRoute2.default)
app.use('/email', _emailRoute2.default)

app.get('/', (req, res) => {
  res.json({ ok: 'true' })
})

app.listen(_envVariablesConfig2.default.PORT)
