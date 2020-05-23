var mongoose = require('mongoose');
const key = require('../config/key');

mongoose.connect(process.env.MONGODB_URI || key.MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema;

var UserDataSchema = new Schema({
    name: String,
    number: String,
    password: String,
    facebook_id: String,
    google_id: String,
    t_stat: {type: Number, default: 0},
    history:[{}]
}, {collection: 'accounts'});

var UserNumberSchema = new Schema({
    name: String,
    number: String,
    password: String,
    code: Number
}, {collection: 'user-number'});

var QuestionDataSchema = new Schema({
    subject: String,
    questions: [{}]
}, {collection: 'questions'});



const UserData = mongoose.model('UserData', UserDataSchema);
const UserNumber = mongoose.model('UserNumber', UserNumberSchema);
const QuestionData = mongoose.model('QuestionData',QuestionDataSchema);


module.exports = {
    UserData: UserData,
    UserNumber: UserNumber,
    QuestionData: QuestionData,
}