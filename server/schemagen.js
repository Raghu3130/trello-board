import * as  models from './models'
import {GraphQLObjectType,GraphQLSchema,} from 'graphql';
import * as utils from './utils';

class schemagen{
	constructor(){
		this.utils={
	
		}
	}
	generate(){
		let queries_data ={};
		let mutation_data={};
		return new GraphQLSchema({
			query:this.getQueries(models,utils),
			mutation:	this.getMutation(models,utils)
		});
	}

	getQueries(models,utils){
		let queries_data ={};
		for (let model of Object.keys(models)) {
		let modelQuery={};
			for (let util of Object.keys(utils)) {
				let utilGene = new utils[util]();
				let utilQueryType = utilGene.queries("T", "tt", models[model]);
				if (utilQueryType) {
					modelQuery[util] = {
						type: utilQueryType,
						resolve: () => true
					}
				}
			}
			let query=models[model].queries;
			if(query){
				for(let queries of Object.keys(query)){
					let mutationQueryType = query[queries];
					if (mutationQueryType) {
						modelQuery[mutationQueryType.name] = {
							type: mutationQueryType.type,
							args: mutationQueryType.args,
							resolve:mutationQueryType.resolve
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
		}
		return new GraphQLObjectType({
			name:  'Root_Queries',
			fields: queries_data
		});
	};

	getMutation(models,utils){
		let mutation_data={};
		for (let model of Object.keys(models)) {
			let modelmutation={};
			for (let util of Object.keys(utils)) {
				let utilGene = new utils[util]();
				let utilMutationType = utilGene.mutation("T", "tt", models[model]);

				if (utilMutationType) {
					modelmutation[util] = {
						type: utilMutationType,
						resolve: () => true
					}
				}
			}
			let mutations=models[model].mutations;
			if(mutations){
				for(let mutation of Object.keys(mutations)){
					let mutationMutationType = mutations[mutation];
					if (mutationMutationType) {
						modelmutation[mutationMutationType.name] = {
							type: mutationMutationType.type,
							args: mutationMutationType.args,
							resolve:mutationMutationType.resolve
						}
					}
				}
			}
			mutation_data[model]={
				type:  new GraphQLObjectType({
					name:  model+"_mutations",
					fields: modelmutation
				}),	
				resolve: () => true
			};
		}
		return new GraphQLObjectType({
			name:  'Root_Mutations',
			fields: mutation_data
		});
	}
}


export default schemagen;
// export the schema


