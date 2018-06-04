

const GraphQL = require('graphql');
const {
	GraphQLList,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType
} = GraphQL;

// import the Post type we created
const UserType = require('../types/User');

// import the Post resolver we created
const UserResolver = require('../resolvers/User');

const queries=  new GraphQLObjectType({
	name: "User_query",
	fields: {
		Addone:{
			type: new GraphQLList(UserType),
			args: {
				subreddit: {
					type: GraphQLString,
					description: 'Please enter subreddit name',
				}
			},
			resolve(parent, args, context, info) {
				return UserResolver.addOne(args);
			}
		},
		Add:{
			type: new GraphQLList(UserType),
			args: {
				subreddit: {
					type: GraphQLString,
					description: 'Please enter subreddit name',
				}
			},
			resolve(parent, args, context, info) {
				return UserResolver.add(args);
			}
		}
	}
})

;
console.log("dfdfd",queries);
export default queries


