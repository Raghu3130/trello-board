
import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
} from 'graphql';


const ColorType = new GraphQLObjectType({
	name: 'Card',
	description: {
		collection: "Card", //aka tableName
		timestamps: true,
		skip_deleted: true
	  },
	fields: () => ({
		_id: {
			type: GraphQLID,
			description: 'ID of the Card',
		},
		name: {
			type: GraphQLString,
			description: 'name of the Card',
		},
		display_order: {
			type: GraphQLInt,
			description: 'display Order',
		},
		title: {
			type: GraphQLString,
			description: 'title of the card',
		}
	})

});


module.exports = ColorType;

