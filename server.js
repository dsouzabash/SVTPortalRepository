var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
 
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

/*
var sql = require("mssql");
    // config for your database
var config = {
	user: 'SchedAdmin',
	password: '$VTS0lut!ons1',
	server: '10.10.16.40', 
	database: 'Schedule' 
};
sql.connect(config, function (err) {
		console.log('Inside connect function');
        if (err) console.log(err);
        // create Request object
        //var request = new sql.Request();

        // query to the database and get the records
});

app.get('/resources/schedule', function (req, res) {
	console.log('Getting resources through query');
	var request = new sql.Request();
	request.query('SELECT result.[name],pm.[VCHARName] as projectManager,result.[client],result.[SO],result.[startDate],	result.[endDate],result.[weeks],result.[days],result.[city],result.[state],result.[travel],result.[app],result.[appVersion],result.[billableRate],result.[rate],result.[resType],result.[activeFlag],result.[Notes],result.[createdDate],result.[createdBy] FROM (SELECT res.[VCHARName] as name,sched.[GUIDPM] as projectManager,cust.[VCHARName] as client,sched.[INTSO] as SO,sched.[DATEStartDate] as startDate,sched.[DATEEndDate] as endDate,sched.[INTWeek] as weeks,sched.[INTDays] as days,custSite.[VCHARCity] as city,custSite.[VCHARState] as state,travel.[VCHARTravelType] as travel,app.[VCHARAppName] as app,appVersion.[VCHARAppVersion] as appVersion,billable.[VCHARBillableName] as billableRate,rate.[monRate] as rate,resType.[VCHARResTypeName] as resType,sched.[BITActive] as activeFlag,sched.[TEXTNotes] as Notes,sched.[DATECreatedOn] as createdDate,sched.[VCHARCreator] as createdBy	FROM [Schedule].[dbo].[tblSchedule] sched JOIN [Schedule].[dbo].[tblResources] res ON sched.[GuidRes] = res.[PKResource] JOIN [Schedule].[dbo].[tblCust] cust ON sched.[GUIDCust] = cust.[PKCust] JOIN [Schedule].[dbo].[tblResType] resType ON sched.[GUIDResType] = resType.[PKResType] JOIN [Schedule].[dbo].[tblCustSite] custSite ON sched.[GUIDCustSite] = custSite.[PKCustSite] JOIN [Schedule].[dbo].[tblApp] app ON sched.[GuidApp] = app.[PKApp] JOIN [Schedule].[dbo].[tblAppVersion] appVersion	ON sched.[GUIDAppVersion] = appVersion.[PKAppVersion] JOIN [Schedule].[dbo].[tblBillable] billable ON sched.[GUIDBillable] = billable.[PKBillable] JOIN [Schedule].[dbo].[tblRate] rate ON sched.[GUIDRate] = rate.[PKRate] JOIN [Schedule].[dbo].[tbltraveltype] travel ON sched.[GUIDTravel] = travel.[PKTravel]) result JOIN [Schedule].[dbo].[tblResources] pm ON result.[projectManager] = pm.[PKResource] ORDER BY result.[startDate]', function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});

app.get('/resources/resNames', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT res.[VCHARName] as name FROM [Schedule].[dbo].[tblResources] res JOIN [Schedule].[dbo].[tblResType] resType ON res.[GUIDResType] = resType.[PKResType] WHERE resType.[VCHARResTypeName] = \'SE\' ' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);
	});
});
app.get('/resources/pmNames', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT res.[VCHARName] as projectManager FROM [Schedule].[dbo].[tblResources] res JOIN [Schedule].[dbo].[tblResType] resType ON res.[GUIDResType] = resType.[PKResType] WHERE resType.[VCHARResTypeName] = \'PM\' ' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);
	});
});
app.get('/resources/clientNames', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT cust.[VCHARName] as client FROM [Schedule].[dbo].[tblCust] cust' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});
app.get('/resources/clientLocation', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT DISTINCT cust.[VCHARName],custSite.[VCHARCity] as clientCity, custSite.[VCHARState] as clientState FROM [Schedule].[dbo].[tblCust]cust JOIN [Schedule].[dbo].[tblCustSite] custSite ON cust.PKCust = custSite.GUIDCust' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});
app.get('/resources/soNums', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT sched.INTSO as SO FROM [Schedule].[dbo].[tblSchedule] sched' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});
app.get('/resources/appln', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT appVer.[VCHARAppVersion] as appVersion, app.[VCHARAppName] as appName FROM [Schedule].[dbo].[tblAppVersion] appVer JOIN [Schedule].[dbo].[tblApp] app ON appVer.[GUIDApp] = app.[PKApp]' , function (err, recordset) {
            if (err) console.log(err)
			res.send(recordset);			
	});
});
app.get('/resources/travelType', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT travelType.[VCHARTravelType] as travelTypeName FROM [Schedule].[dbo].[tbltraveltype] travelType' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});

app.get('/resources/billType', function (req, res) {
	var request = new sql.Request();
	request.query('SELECT billType.[VCHARBillableName] as billTypeName, billRate.[monRate] as billRate FROM [Schedule].[dbo].[tblBillable] billType JOIN [Schedule].[dbo].[tblRate] billRate ON billType.[PKBillable] = billRate.[GUIDBillable]' , function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);			
	});
});

app.get('/resources/dashboard', function (req, res) {
	console.log('Getting dashboard from query');
	var request = new sql.Request();
	request.query('SELECT result.[name], pm.[VCHARName] as projectManager, result.[client], result.[SO],result.[startDate],result.[endDate],result.[city],result.[state],result.[travel] FROM (SELECT res.[VCHARName] as name,sched.[GUIDPM] as projectManager,cust.[VCHARName] as client,sched.[INTSO] as SO,sched.[DATEStartDate] as startDate,sched.[DATEEndDate] as endDate,custSite.[VCHARCity] as city,custSite.[VCHARState] as state,travel.[VCHARTravelType] as travel FROM [Schedule].[dbo].[tblSchedule] sched JOIN [Schedule].[dbo].[tblResources] res ON sched.[GuidRes] = res.[PKResource] JOIN [Schedule].[dbo].[tblCust] cust ON sched.[GUIDCust] = cust.[PKCust] JOIN [Schedule].[dbo].[tblCustSite] custSite ON sched.[GUIDCustSite] = custSite.[PKCustSite] JOIN [Schedule].[dbo].[tbltraveltype] travel ON sched.[GUIDTravel] = travel.[PKTravel]) result JOIN [Schedule].[dbo].[tblResources] pm ON result.[projectManager] = pm.[PKResource] WHERE result.[startDate] >= DATEADD(MONTH,-2,GETDATE()) AND result.[startDate] <= DATEADD(MONTH,2,GETDATE()) ORDER BY result.[startDate]', function (err, recordset) {
		if (err) console.log(err)
		// send records as a response;
		res.send(recordset);	
	});
});
*/


/////////////// Mongo DB connections begin
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var appList = [];
var application = function(db, callback) {
	var cursor =db.collection('application').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			appList.push(doc);
			//console.dir(appList);
		} else {
			callback();
		}
	});
};

app.get('/resources/appln', function (req, res) {
	appList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		application(db, function() {
			res.json(appList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

app.post('/resources/appln', function(req, res) {
	console.log('Inside post appln: ' + req.body.appName);
        // create a todo, information comes from AJAX request from Angular
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('application').insertOne({
			"appName" : req.body.appName,
			"appVersion" : req.body.appVersion
		}, function(err, result) {
			assert.equal(err, null);
			application(db, function() {
				res.json(appList);
				db.close();
			});
			console.log("Inserted a document into the restaurants collection.");
			//db.close();
		});
	});
});

app.delete('/resources/appln/:appTypeId',function(req,res){
	//console.log('server.js: Inside deleting bill: ');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('application').deleteOne(
			{ "_id": ObjectId(req.params.appTypeId) },
			function(err, results) {
				//console.log('Completed deletion');
				//console.log(results);
				assert.equal(err, null);
				application(db, function() {
					res.json(appList);
					db.close();
				});
				//db.close();
			}
		);
	});
});

var scheduleList = [];
var scheduleFn = function(db, callback) {
	var cursor =db.collection('schedule').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			scheduleList.push(doc);
			//console.dir(appList);
		} else {
			callback();
		}
	});
};

app.get('/resources/schedule', function (req, res) {
	scheduleList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		if(req.query.endFilter!=undefined){
			console.log(req.query.endFilter);
			scheduleFilterFn(db, function() {
				res.json(scheduleList);
				db.close();
			});
		}
		else{
			scheduleFn(db, function() {
				res.json(scheduleList);
				db.close();
			});
		}
		console.log('Completed Fetching: ');
	});
});

var filteredScheduleList = [];
app.get('/resources/filteredSchedule', function (req, res) {
	filteredScheduleList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		scheduleFilterFn(db, req.query, function() {
			res.json(filteredScheduleList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

var scheduleFilterFn = function(db, req, callback) {
	var cursor = {};
	console.log(req.startFilter+req.endFilter);
	console.log(req.endVal.length);
	var cursorActions = {
		"onStartDateonEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal},"endDate":{$eq:req.endVal}});
		},
		"onStartDatebeforeEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal},"endDate":{$lte:req.endVal}});
		},
		"onStartDateafterEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal},"endDate":{$gte:req.endVal}});
		},
		"beforeStartDateonEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$eq:req.endVal}});
		},
		"beforeStartDatebeforeEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$lte:req.endVal}});
		},
		"beforeStartDateafterEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$gte:req.endVal}});
		},
		"afterStartDateonEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$eq:req.endVal}});
		},
		"afterStartDatebeforeEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$lte:req.endVal}});
		},
		"afterStartDateafterEndDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$gte:req.endVal}});
		},
		"beforeStartDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal}});
		},
		"onStartDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal}});
		},
		"afterStartDate": function(){
			cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal}});
		},
		"beforeEndDate": function(){
			cursor = db.collection('schedule').find({"endDate":{$lte:req.endVal}});
		},
		"onEndDate": function(){
			cursor = db.collection('schedule').find({"endDate":{$eq:req.endVal}});
		},
		"afterEndDate": function(){
			cursor = db.collection('schedule').find({"endDate":{$gte:req.endVal}});
		}
	}
	if(req.startVal.length ==24 && req.endVal.length ==24){
		cursorActions[req.startFilter+req.endFilter]();
	}
	else if(req.startVal.length ==24 && req.endVal.length ==0){
		cursorActions[req.startFilter]();
	}
	else if(req.startVal.length ==0 && req.endVal.length ==24){
		cursorActions[req.endFilter]();
	}
	
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			filteredScheduleList.push(doc);
		} else {
			callback();
		}
	});
	//before start date and before end date
	//var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$lte:req.endVal}});
	//Before Start date and on end date
	//var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$eq:req.endVal}});
	//before start date and after end date
	//var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$gte:req.endVal}});
	//before start date and between end dates
	
	//on start date and before end date
	//var cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal},"endDate":{$lte:req.endVal}});
	//on Start date and on end date
	
	//on start date and after end date
	//var cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal},"endDate":{$gte:req.endVal}});
	//on start date and between end dates
	
	//after start date and before end date
	//var cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$lte:req.endVal}});
	//after Start date and on end date
	//var cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$eq:req.endVal}});
	//after start date and after end date
	//var cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$gte:req.endVal}});
	//after start date and between end dates
	
	/*
	//between start dates and before end date
	var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$lte:req.endVal}});
	//between Start dates and on end date
	var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$eq:req.endVal}});
	//between start dates and after end date
	var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal},"endDate":{$gte:req.endVal}});
	//between start dates and between end dates
	*/

	// Only before start date
	//var cursor = db.collection('schedule').find({"startDate":{$lte:req.startVal}});
	// Only on start date
	//var cursor = db.collection('schedule').find({"startDate":{$eq:req.startVal}});
	// Only afterstart date
	//var cursor = db.collection('schedule').find({"startDate":{$gte:req.startVal},"endDate":{$lte:req.endVal}});
	// Only between start dates
	
	// Only before end date
	//var cursor = db.collection('schedule').find({"endDate":{$lte:req.endVal}});
	// Only on end date
	//var cursor = db.collection('schedule').find({"endDate":{$eq:req.endVal}});
	// Only after end date
	//var cursor = db.collection('schedule').find({"endDate":{$gte:req.endVal}});
	// Only between end dates
	
	//var cursor = db.collection('schedule').find({"startDate":{$gt:req.startDate}});

};

app.post('/resources/schedule', function(req, res) {
	console.log('Inside post schedule: ');
	// create a todo, information comes from AJAX request from Angular
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('schedule').insertOne({
				"name": req.body.name,
				"projectManager": req.body.projectManager,
				"client": req.body.client,
				"SO": req.body.SO,
				"startDate": req.body.startDate,
				"endDate": req.body.endDate,
				"weeks": req.body.weeks,
				"days": req.body.days,
				"city": req.body.city,
				"state": req.body.state,
				"travel": req.body.travel,
				"app": req.body.app,
				"appVersion": req.body.appVersion,
				"billableRate": req.body.billableRate,
				"rate": req.body.rate,
				"resType": req.body.resType,
				"activeFlag": req.body.activeFlag,
				"Notes": req.body.Notes,
				"createdDate": req.body.createdDate,
				"createdBy": req.body.createdBy
		}, function(err, result) {
			assert.equal(err, null);
			scheduleFn(db, function() {
				res.json(scheduleList);
				db.close();
			});
			console.log("Inserted a document into the restaurants collection.");
			//db.close();
		});
	});
});

var dashboardList = [];
var dashboardFn = function(db, callback) {
	var prevTwoMonthDate = new Date();
	prevTwoMonthDate.setDate(1);
	prevTwoMonthDate.setMonth(prevTwoMonthDate.getMonth()-2);
	var nextTwoMonthDate = new Date();
	nextTwoMonthDate.setDate(1);
	nextTwoMonthDate.setMonth(nextTwoMonthDate.getMonth()+2);
	console.log('prevTwoMonthDate: ' + prevTwoMonthDate + 'nextTwoMonthDate: ' + nextTwoMonthDate);
	var cursor =db.collection('schedule').find({"startDate":{"$gte":prevTwoMonthDate.toISOString(),"$lte":nextTwoMonthDate.toISOString()}});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			dashboardList.push(doc);
			//console.dir(appList);
		} else {
			callback();
		}
	});
};

app.get('/resources/dashboard', function (req, res) {
	dashboardList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		dashboardFn(db, function() {
			res.json(dashboardList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

var resList = [];
var resources = function(db, callback) {
	var cursor =db.collection('resource').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			resList.push(doc);
			//console.dir(resList);
		} else {
			callback();
		}
	});
};

app.get('/resources/resNames', function (req, res) {
	resList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		resources(db, function() {
			res.send(resList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

app.post('/resources/resNames', function(req, res) {
	console.log('Inside post resNames: ' + req.body.resName);
        // create a todo, information comes from AJAX request from Angular
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('resource').insertOne({
			"name" : req.body.resName,
			"type" : req.body.resType
		}, function(err, result) {
			assert.equal(err, null);
			resources(db, function() {
				res.json(resList);
				db.close();
			});
			console.log("Inserted a document into the restaurants collection.");
			//db.close();
		});
	});
});

app.delete('/resources/resNames/:resourceId',function(req,res){
	//console.log('server.js: Inside deleting bill: ');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('resource').deleteOne(
			{ "_id": ObjectId(req.params.resourceId) },
			function(err, results) {
				//console.log('Completed deletion');
				//console.log(results);
				assert.equal(err, null);
				billFunc(db, function() {
					res.json(resList);
					db.close();
				});
				//db.close();
			}
		);
	});
});

var pmList = [];
var pmNamesList = function(db, callback) {
	var cursor =db.collection('resource').find({type:'PM'});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			pmList.push(doc);
			//console.dir(resList);
		} else {
			callback();
		}
	});
};

app.get('/resources/pmNames', function (req, res) {
	pmList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		pmNamesList(db, function() {
			res.send(pmList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

var travelList = [];
var travelFunc = function(db, callback) {
	var cursor =db.collection('travel').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			travelList.push(doc);
			//console.dir(resList);
		} else {
			callback();
		}
	});
};

app.get('/resources/travelType', function (req, res) {
	travelList = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		travelFunc(db, function() {
			res.send(travelList);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

app.post('/resources/travelType', function(req, res) {
	console.log('Inside post travelType: ' + req.body.travelType);
        // create a todo, information comes from AJAX request from Angular
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('travel').insertOne({
			"travelTypeName" : req.body.travelType
		}, function(err, result) {
			assert.equal(err, null);
			application(db, function() {
				res.json(travelList);
				db.close();
			});
			console.log("Inserted a document into the restaurants collection.");
			//db.close();
		});
	});
});

app.delete('/resources/travelType/:travelTypeId',function(req,res){
	//console.log('server.js: Inside deleting bill: ');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('travel').deleteOne(
			{ "_id": ObjectId(req.params.travelTypeId) },
			function(err, results) {
				//console.log('Completed deletion');
				//console.log(results);
				assert.equal(err, null);
				billFunc(db, function() {
					res.json(travelList);
					db.close();
				});
				//db.close();
			}
		);
	});
});

var billableType = [];
var billFunc = function(db, callback) {
	var cursor =db.collection('billType').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			billableType.push(doc);
		} else {
			callback();
		}
	});
};

app.get('/resources/billType', function (req, res) {
	billableType = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		billFunc(db, function() {
			res.json(billableType);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

app.post('/resources/billType', function(req, res) {
	console.log('Inside post bill type: ');
	console.log(req.body.billTypeName + ' : ' + req.body.billRate);
        // create a todo, information comes from AJAX request from Angular
	MongoClient.connect(url, function(err, db) {
		console.log('Create bill type: ' + req.body.billTypeName+ ' : ' + req.body.billRate);
		assert.equal(null, err);
		db.collection('billType').insertOne({
			"billTypeName":req.body.billTypeName,
			"billRate":req.body.billRate
		}, function(err, result) {
			assert.equal(err, null);
			billFunc(db, function() {
				res.json(billableType);
				db.close();
			});
			console.log("Inserted a document into the restaurants collection.");
			//db.close();
		});
	});
});

app.delete('/resources/billType/:billId',function(req,res){
	//console.log('server.js: Inside deleting bill: ');
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('billType').deleteOne(
			{ "_id": ObjectId(req.params.billId) },
			function(err, results) {
				//console.log('Completed deletion');
				//console.log(results);
				assert.equal(err, null);
				billFunc(db, function() {
					res.json(billableType);
					db.close();
				});
				//db.close();
			}
		);
	});
});

var clientNames = [];
var clientNameFunc = function(db, callback) {
	var cursor =db.collection('clientTable').find();
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			clientNames.push(doc);
		} else {
			callback();
		}
	});
};

app.get('/resources/clientNames', function (req, res) {
	clientNames = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		clientNameFunc(db, function() {
			res.json(clientNames);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

app.get('/resources/clientNames', function (req, res) {
	clientNames = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		clientNameFunc(db, function() {
			res.json(clientNames);
			db.close();
		});
		console.log('Completed Fetching: ');
	});
});

var server = app.listen(5000, function () {
	console.log('Server is running..');
	});
