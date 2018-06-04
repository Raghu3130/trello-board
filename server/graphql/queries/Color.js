

const GraphQL = require('graphql');
const {
	GraphQLList,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType
} = GraphQL;

// import the Post type we created
const Colortype = require('../types/Color');

// import the Post resolver we created
const ColorResolver = require('../resolvers/Color');
const queries=  new GraphQLObjectType({
		name: "color_query",
		fields: {
      Addone:{
				type: new GraphQLList(Colortype),
				args: {
					subreddit: {
						type: GraphQLString,
						description: 'Please enter subreddit name',
					}
				},
				resolve(parent, args, context, info) {
					return ColorResolver.addOne(args);
				}
			},
			Add:{
				type: new GraphQLList(Colortype),
				args: {
					subreddit: {
						type: GraphQLString,
						description: 'Please enter subreddit name',
					}
				},
				resolve(parent, args, context, info) {
					return ColorResolver.add(args);
				}
			}
		}
	})

;
console.log("dfdfd",queries);
 export default queries

// module.exports = {


// 	AddOne() {
// 		return {
// 			type: new GraphQLList(Colortype),
// 			args: {
// 				subreddit: {
// 					type: GraphQLString,
// 					description: 'Please enter subreddit name',
// 				}
// 			},
// 			resolve(parent, args, context, info) {
// 				return ColorResolver.addOne(args);
// 			}
// 		}
//     },
//     Add() {
// 		return {
// 			type: new GraphQLList(Colortype),
// 			args: {
// 				subreddit: {
// 					type: GraphQLString,
// 					description: 'Please enter subreddit name',
// 				}
// 			},
// 			resolve(parent, args, context, info) {
// 				return ColorResolver.add(args);
// 			}
// 		}
//     },
//     Update() {
// 		return {
// 			type: new GraphQLList(Colortype),
// 			args: {
// 				subreddit: {
// 					type: GraphQLString,
// 					description: 'Please enter subreddit name',
// 				}
// 			},
// 			resolve(parent, args, context, info) {
// 				return ColorResolver.update(args);
// 			}
// 		}
//     },
//     Delete() {
// 		return {
// 			type: new GraphQLList(Colortype),
// 			args: {
// 				subreddit: {
// 					type: GraphQLString,
// 					description: 'Please enter subreddit name',
// 				}
// 			},
// 			resolve(parent, args, context, info) {
// 				return ColorResolver.delete(args);
// 			}
// 		}
//     },
//     Count() {
// 		return {
// 			type: new GraphQLList(Colortype),
// 			args: {
// 				subreddit: {
// 					type: GraphQLString,
// 					description: 'Please enter subreddit name',
// 				}
// 			},
// 			resolve(parent, args, context, info) {
// 				return ColorResolver.count(args);
// 			}
// 		}
// 	},

// };

