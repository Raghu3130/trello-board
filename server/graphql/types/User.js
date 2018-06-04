

const GraphQL = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
} = GraphQL;


const UserType = new GraphQL.GraphQLObjectType({
	name: 'User',
	description: 'User details ',

	fields: () => ({
		id: {
			type: GraphQLID,
			description: 'ID of the user',
		},
		firstname: {
			type: GraphQLString,
			description: 'name of the user',
		},
		lastname: {
			type: GraphQLString,
			description: 'name of the user',
		},
		username: {
			type: GraphQLString,
			description: 'Username of the user',
		},

		intials: {
			type: GraphQLString,
			description: 'Intials of user name',
		},

		email: {
			type: GraphQLString,
			description: 'Email of user',
		},
		password: {
			type: GraphQLString,
			description: 'Encrypted password of user',
		}

	})

});


module.exports = UserType;

