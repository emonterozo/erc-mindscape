var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/proj_mindscape',{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema;

var UserDataSchema = new Schema({
    user: {type: String, required: true},
    name: String,
    t_stat: Number,
    history:[{}]
}, {collection: 'accounts'});

var QuestionDataSchema = new Schema({
    subject: String,
    questions: [{}]
}, {collection: 'questions'});


var UserHistorySchema = new Schema({
    history: [{}]
}, {collection: 'accounts'});

const UserData = mongoose.model('UserData', UserDataSchema);
const QuestionData = mongoose.model('QuestionData',QuestionDataSchema);
const UserHistory = mongoose.model('UserHistory',UserHistorySchema);

module.exports = {
    UserData: UserData,
    QuestionData: QuestionData,
    UserHistory: UserHistory
}