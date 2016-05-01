/**
 *  This script can be run to rebuild the mixerfox databse as a blank slate
 *	By changing the schema here, we can rerun the script and rebuild the db
 */

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig.connection);


rebuildDB();

function rebuildDB() {
	console.log("Deleting database...");
	// delete and recreate db
	var deleteDB = 'DROP DATABASE IF EXISTS mixerfox';
	connection.query(deleteDB);
	var createDB = 'CREATE DATABASE IF NOT EXISTS mixerfox';
	connection.query(createDB);
	createTables();
}

function createTables() {
	connection.query('USE mixerfox;');

	// table creation queries/schemas
	var createTableUser = 	"CREATE TABLE `user` (" +
								"`username` varchar(45) NOT NULL, " + 
								"`firstName` varchar(45) DEFAULT NULL, " +
								"`lastName` varchar(45) DEFAULT NULL, " +
								"`password` varchar(60) NOT NULL, " +
								" PRIMARY KEY (`username`), " +
								" UNIQUE KEY `username_UNIQUE` (`username`)" +
								") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	var createTableSong = 	"CREATE TABLE `song` (" +
	  							"`songId` int(11) NOT NULL AUTO_INCREMENT, " +
	  							"`name` varchar(45) NOT NULL, " +
	  							"`path` varchar(255) NOT NULL, " +
	  							"`uploader` varchar(45) NOT NULL, " +
	  							"PRIMARY KEY (`songId`) " +
								") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	var createTablePlaylist = "CREATE TABLE `playlist` (" +
	  							"`playlistId` int(11) NOT NULL AUTO_INCREMENT, " +
	  							"`name` varchar(45) NOT NULL, " +
	  							"`artPath` varchar(255) DEFAULT NULL, " +
	  							"`creator` varchar(45) NOT NULL, " +
	  							"PRIMARY KEY (`playlistId`) " +
								") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	var createTableArtist = "CREATE TABLE `artist` (" +
							"`username` varchar(45) NOT NULL," +
							"`bio` varchar(255) DEFAULT NULL," +
							"PRIMARY KEY (`username`)" +
							") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	var createTableAlbum = "CREATE TABLE `album` (" +
							"`playlistId` int(11) NOT NULL, " +
							"`releaseDate` date DEFAULT NULL, " +
							"PRIMARY KEY (`playlistId`) " +
							") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	// create tables
	connection.query(createTableUser);
	connection.query(createTableSong);
	connection.query(createTablePlaylist);
	connection.query(createTableArtist);
	connection.query(createTableAlbum);

	closeConnection();
}

function closeConnection() {
	console.log("Done!");
	connection.end();
}