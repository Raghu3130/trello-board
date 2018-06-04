import { flatten } from 'flat';
import { unflatten } from 'flat';
import { map, keys, pickBy, values, mapValues, mapKeys } from 'lodash';
import knex from 'knex';
import uuid from 'uuid';

class DatabaseAdapter {

	constructor(connection) {
    this.client = knex({
			client: 'mysql',
			connection: {
				host : '127.0.0.1',
				user : 'root',
				password : 'root',
				database : 'todo_board'
			}
    });
	}

	_operatorMatch(operator) {
		switch(operator) {
			case '$eq':
				return '=';
			case '$ne':
				return '!=';
			case '$gt':
				return '>';
			case '$gte':
				return '>=';
			case '$lt':
				return '<';
			case '$lte':
				return '<=';
			case '$like':
				return 'like';
			case '$ilike':
				return 'ilike';
			case '$nin':
				return 'not in';
			case '$in':
				return 'in';
		}
	}
	_resolveQuery(query, queryBuilder) {
		let self = this;

		if (query.and) {
			for (let qIdx=0; qIdx<query.and.length; qIdx++) {
				let subQuery = query.and[qIdx];

				queryBuilder.where(function() {
					self._resolveQuery(subQuery, this);
				})
			}
		} else if (query.not) {
			for (let qIdx=0; qIdx<query.not.length; qIdx++) {
				let subQuery = query.not[qIdx];

				queryBuilder.whereNot(function() {
					self._resolveQuery(subQuery, this);
				})
			}
		} else if (query.or) {
			for (let qIdx=0; qIdx<query.or.length; qIdx++) {
				let subQuery = query.or[qIdx];

				if (qIdx === 0) {
					queryBuilder.where(function() {
						self._resolveQuery(subQuery, this);
					})
				} else {
					queryBuilder.orWhere(function() {
						self._resolveQuery(subQuery, this);
					})
				}
			}
		} else {
			let keyCount = keys(query.fields).length;
			let resolvedSubQueries = [];

			for (let key of Object.keys(query.fields)) {
				let subQuery = query.fields[key];
				let subQueryValue = subQuery.value;

				if ((subQuery.operator === '$in' || subQuery.operator === '$nin') && Array.isArray(subQuery.values)) {
					subQueryValue = subQuery.values;
				}

				if (subQuery.operator === '$regex') {
					subQuery.operator = '$like'
					subQueryValue = `%${subQueryValue}%`;
				}

				if (subQuery.operator === '$iregex') {
					subQuery.operator = '$ilike'
					subQueryValue = `%${subQueryValue}%`;
				}

				if(subQuery.operator === '$exists') {
					queryBuilder.whereNotNull(key);
				} else {
					queryBuilder.where(key, this._operatorMatch(subQuery.operator), subQueryValue);
				}
			}
		}
	}

	_resolveFind(find, queryBuilder) {
		for(let key of Object.keys(find)) {
			if(Array.isArray(find[key])) {
				queryBuilder.whereIn(key, find[key]);
			} else {
				queryBuilder.where(key, find[key]);
			}
		}
	}

	_resolveColumns(args, queryBuilder) {
		if (!args) {
			return;
		}

		const { aggregate, groupBy, distinct } = args;

		// add group by columns
		if (groupBy && Array.isArray(groupBy)) {
			groupBy.map(groupBy => {
				queryBuilder.column(groupBy.field);
			})
		}

		// add distinct columargsns
		if (distinct && Array.isArray(distinct)) {
			distinct.map(distinct => {
				queryBuilder.distinct(distinct);
			})
		}

		// add aggregate fields
		if (aggregate && keys(aggregate).length > 0) {
			for (let fn of Object.keys(aggregate)) {
				aggregate[fn].map(field => {
					queryBuilder[fn]([field, 'as', ['aggr', fn, field].join('_')].join(' '));
				});
			}
		}
	}

	_transformRow(row) {
		// identify all aggregate fields and unflatten them
		let aggregateFields = pickBy(row, (value, key) => key.startsWith('aggr_'));

		// remove all aggr fields
		row = pickBy(row, (value, key) => !key.startsWith('aggr_'));

		if (!aggregateFields || keys(aggregateFields).length === 0) {
			return row;
		}

		// to handle the fields starting with '_' (underscore), replace all underscore with .
		aggregateFields = mapKeys(aggregateFields, (value, key) => key.replace(/aggr_(sum|min|max|count|avg)_/, 'aggr.$1.'));
		let aggregates = unflatten(aggregateFields, { delimiter: '.' });

		return {
			...row,
			_aggregates: aggregates['aggr']
		};
	}

	all(datasource, args) {
		let self = this;
		let dbPromise = new Promise((resolve, reject) => {
      const tableName = datasource.table || datasource.collection;

			this.client
				.select()
				.modify(queryBuilder => {
					self._resolveColumns(args, queryBuilder);
				})
				.table(tableName)
        .modify(queryBuilder => {
					if (args.find) {
						self._resolveFind(args.find, queryBuilder)
					}

					if (args.query) {
						self._resolveQuery(args.query, queryBuilder)
					}

					// handle soft deletion
					if (datasource.skip_deleted) {
						queryBuilder.whereNot('_deleted', true);
					}
        })
				.modify(queryBuilder => {
					if (args.groupBy) {
						args.groupBy.map(groupBy => {
							queryBuilder.groupBy(groupBy.field)
						});
					}
        })
				.modify(queryBuilder => {
					if (args.sort) {
            queryBuilder.orderBy(args.sort.field, args.sort.order);
          }

					if (args.orderBy && args.orderBy.length > 0) {
						args.orderBy.map(orderBy => {
							queryBuilder.orderBy(orderBy.field, orderBy.order);
						})
          }
				})
        .limit(args.limit)
        .offset(args.skip)
        .then((res) => {
					const rows = res.map(this._transformRow);
					resolve(rows);
        })
        .catch((err) => {
          reject(err);
        })
		});
		return dbPromise;
	}

	count(datasource, args) {
		let self = this;

		let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      this.client.select().count().table(tableName)
				.modify(queryBuilder => {
					if (args.find) {
						self._resolveFind(args.find, queryBuilder)
					}

					if (args.query) {
						self._resolveQuery(args.query, queryBuilder)
					}

					// handle soft deletion
					if (datasource.skip_deleted) {
						queryBuilder.whereNot('_deleted', true);
					}
				})
        .then((res) => {
					let count =res[0];
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        })
		});
		return dbPromise;
	}

	one(datasource, args) {
		const self = this;
    let dbPromise = new Promise((resolve, reject) => {
			const { find, query } = args;
      let tableName = datasource.table || datasource.collection;

      this.client
			.select()
			.modify(queryBuilder => {
				self._resolveColumns(args, queryBuilder);
			})
			.table(tableName)
			.modify(queryBuilder => {
				if (find) {
					queryBuilder.where(find)
				}

				if (query) {
					self._resolveQuery(query, queryBuilder)
				}

				// handle soft deletion
				if (datasource.skip_deleted) {
					queryBuilder.whereNot('_deleted', true);
				}
			})
			// .where(find ? find : null)
			.limit(1)
        .then((res) => {
					if (!res[0]) {
						resolve(null)
					}
					const row = this._transformRow(res[0]);
          resolve(row);
        })
        .catch((err) => {
          reject(err);
        })
		});
		return dbPromise;
	}

	destroy(datasource, find, args) {
		let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      this.client(tableName).where(find).del()
        .then((res) => {
          resolve(true);
        })
        .catch(reject);
		});
		return dbPromise;
	}

	delete(datasource, find, args) {
		let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      this.client(tableName).where(find).update({ _deleted: true })
        .then((res) => {
          resolve(true);
        })
        .catch(reject);
		});
		return dbPromise;
	}

	create(datasource, row, args) {
		let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      row._id = uuid.v4();

      this.client(tableName).insert(row)
        .then((res) => {
          const find = {
            _id: row._id
          };

          return this.one(datasource, { find })
        })
        .then(resolve)
        .catch(reject);
		});
		return dbPromise;
	}

	createMany(datasource, rows, args) {
		let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      rows = rows.map(row => {
        row._id = uuid.v4();
        return row;
      })
			console.log("rows",rows);
      this.client(tableName).insert(rows)
        .then(res => {
					return resolve(rows.length)})
        .catch(reject);
		});
		return dbPromise;
	}

	update(datasource, find, row, args) {
    let dbPromise = new Promise((resolve, reject) => {
      let tableName = datasource.table || datasource.collection;

      this.client(tableName).where(find).update(row)
        .then((res) => {
          resolve(true);
        })
        .catch(reject);
		});
		return dbPromise;
	}
}

export default DatabaseAdapter;
