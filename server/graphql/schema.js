import query from './queries';
import * as  models from '../models'
import {
	GraphQLObjectType,
	GraphQLSchema,
} from 'graphql';

// let modelQueryObjects = {};
// for (let util of Object.keys(query)) {
// 	let utilQueryType = query[util];
// 	if (utilQueryType) {
// 		modelQueryObjects[util] = {
// 			type: utilQueryType,
// 			resolve: () => true
// 		}
// 	}
// }

// const queries = new GraphQLObjectType({
// 	name:  'Queries',
// 	fields: modelQueryObjects
// });


let queries_data ={};
let mutation_data={};
for (let model of Object.keys(models)) {
	let modelQuery={};
	let modelmutation={};
	let query=models[model].queries;
	if(query){
		for(let queries of Object.keys(query)){
			let queriesQueryType = query[queries];
			if (queriesQueryType) {
				modelQuery[queries] = {
					type: queriesQueryType,
					resolve: () => true
				}
			}
		}
	}
	queries_data[model]={
		type:  new GraphQLObjectType({
			name:  model+"_queries",
			fields: modelQuery
		}),	
		resolve: () => true
	};
	let mutations=models[model].mutation;
	if(mutations){
		for(let mutation of Object.keys(mutations)){
			let mutationQueryType = mutations[mutation];
			if (mutationQueryType) {
				modelmutation[mutation] = {
					type: mutationQueryType,
					resolve: () => true
				}
			}
		}
	}
	mutation_data[model]={
		type:  new GraphQLObjectType({
			name:  model+"_mutations",
			fields: modelQuery
		}),	
		resolve: () => true
	};
}

const queries_new = new GraphQLObjectType({
	name:  'Root_Queries',
	fields: queries_data
});
const mutation_new = new GraphQLObjectType({
	name:  'Root_Mutations',
	fields: mutation_data
});


// export the schema
module.exports =  new GraphQLSchema({
	query: queries_new,
	mutation:mutation_new
});

