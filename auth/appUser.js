const database = require("mongoose");
const Schema = database.Schema;

const AppUser = new Schema({
    fb_id: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    roles: [String],
    applications: [String]
}, {
    collection: "AppUsers"
});

AppUser.index({
    fb_id: 1
}, {
    unique: true
});

module.exports = database.model("appUser", AppUser);