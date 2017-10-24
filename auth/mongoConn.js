const database = require("mongoose");
const options = {
    promiseLibrary: require("bluebird")
};
database.Promise = require("bluebird"); //mongoose promise is deprecated, so specify to use bluebird instead

const dbURI = require("./config.json").DBConnStr;
const updateOpt = {
	// Return the document after updates are applied
	new: true,
	// Create a document if one isn't found. Required for `setDefaultsOnInsert`
	upsert: true,
	setDefaultsOnInsert: true
};

// CONNECTION EVENTS
database.connection.on("connected", function() {
    console.log("Mongoose default connection open to " + dbURI);
});

database.connection.on("error", function(err) {
    console.log("Mongoose default connection error: " + err.errmsg);
});

database.connection.on("disconnected", function() {
    console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", function() {
    database.connection.close(function() {
        console.log("Mongoose default connection disconnected through app termination");
        process.exit(0);
    });
});

const connect = function() {
    try {
        database.connect(dbURI);
    } catch (err) {
        console.log(err.errmsg);
    }
};

const disconnect = function() {
    try {
        database.connection.close();
    } catch (err) {
        console.log(err.errmsg);
    }
};

const retrieveFromDB = function(dbObj, condition, fields, sort, callback) { //write what you want to do with the retrieved data in the callback function
    if (database.connection.readyState !== 1) {
        connect();
    };
    dbObj.find(condition, fields, sort, function(err, docs) {
        if (err) {
			console.log("retrieveFromDB error:" + err.errmsg);
            callback(err);
        } else {
            callback(null, docs);
        }
    });
}

//used for batch
const writeToDB = function(dbObj, data, callback) {
    if (database.connection.readyState !== 1) {
        connect();
    };
    dbObj.insertMany(data, function(err, dbObjs) {
        if (err) {
			console.log("writeToDB error:" + err.errmsg);
            callback(err);
        } else {
            callback(null, dbObjs);
        }
    });
}

//used for single operation
const updateDB = function(key, dbObj, data, callback) {
    if (database.connection.readyState !== 1) {
        connect();
    };

	dbObj.findOneAndUpdate(key, data, updateOpt, function(err, dbObjs) {
		if (err) {
			console.log("updateDB error:" + err.errmsg);
			callback(err);
        } else {
            callback(null, dbObjs);
        }
	});
}

const removeFromDB = function(condition, dbObj, callback) {
    if (database.connection.readyState !== 1) {
        connect();
    };

	dbObj.remove(condition, function(err, res) {
		if (err) {
			console.log("removeFromDB error:" + err.errmsg);
			callback(err);
		} else{
			callback(null, res);
		}
	});
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    retrieveFromDB: retrieveFromDB,
    writeToDB: writeToDB,
	updateDB: updateDB,
	removeFromDB: removeFromDB
};