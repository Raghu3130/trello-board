import connector from './connector';
import moment from 'moment';

const DEFAULT_CONNECTION = 'development';
const DEFAULT_ADAPTER = 'postgresql';

class Database {

	static init({ config }) {
		this.config = config;
		this.connections = {
			dev:{}
		};
	}

	static getConnection = (name) => {
		let newConnection = new connector();
		
		return newConnection;
	}

	static all = (datasource, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		return dbConnection.all(datasource, args);
	}

	static count = (datasource, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		return dbConnection.count(datasource, args);
	}

	static create = (datasource, row, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		row = Database.extend('create', row, datasource);

		return dbConnection.create(datasource, row, args);
	}

	static createMany = (datasource, rows, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		rows = Database.extend('create', rows, datasource);

		return dbConnection.createMany(datasource, rows, args);
	}

	static update = (datasource, find, row, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		row = Database.extend('update', row, datasource);

		return dbConnection.update(datasource, find, row, args);
	}

	static destroy = (datasource, find, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		return dbConnection.destroy(datasource, find, args);
	}

	static delete = (datasource, find, args) => {
		let dbConnection = Database.getConnection(datasource.connection);
		return dbConnection.delete(datasource, find, args);
	}

	static one = (datasource, args) => {
		console.log("datasouce",datasource);
		let dbConnection = Database.getConnection(datasource.connection);
		return dbConnection.one(datasource, args);
	}

	static extend = (mode, row, datasource) => {
		if (Array.isArray(row)) {
			let rows = row;
			return rows.map(row => Database.extend(mode, row, datasource));
		}

		// check timestamps options
		if (datasource.timestamps) {

			if (mode === 'create') {
				row._created_at = moment.utc().format();
				row._updated_at = moment.utc().format();
			}
			
			if (mode === 'update') {
				row._updated_at = moment.utc().format();
			}
		}
		return row;
	}
}

export default Database;
