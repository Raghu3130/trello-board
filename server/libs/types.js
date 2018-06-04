
import { GraphQLList, GraphQLFloat, GraphQLInputObjectType, GraphQLObjectType, GraphQLString,
	GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLObject, GraphQLSchema, GraphQLEnumType } from 'graphql';
import { omit } from 'lodash';
class Types {
	static isType(typeCheck) {
		let typeName = typeCheck.constructor.name;
		let graphQLTypes = ['GraphQLScalarType', 'GraphQLObjectType', 'GraphQLInputObjectType', 'GraphQLList', 'GraphQLEnumType']

		if (graphQLTypes.includes(typeName)) {
			return true;
		}
	}
  static generateInputType(schema, filterKeys) {
		console.log("schema",schema)
		// Check if already Type is being passed
		if (this.isType(schema)) {
			return schema;
		}

		// If type already created and referenced
		// if (typeof schema === 'string') {
		// 	return this.get(schema);
		// }

		// if type is specified directly as [{Schema}] or [{TypeName}]
		if (Array.isArray(schema)) {
			return new GraphQLList(this.generateInputType(schema[0]), filterKeys);
		}

		let genGraphQLTypeName = [schema.name, 'InputType'].join('');
		let resolvedModelFields = {};

		// check for dupe (already generated)
		// if (this.get(genGraphQLTypeName)) {
		// 	return this.get(genGraphQLTypeName);
		// }

		// flatten all types (resolve complex types recursively)
		if (typeof schema.fields === 'function') {
			resolvedModelFields = schema.fields; // do nothing
		} else {
			for (let fieldKey of Object.keys(schema.fields)) {

				let field = {
					...schema.fields[fieldKey]
				}

				// filter/omit keys if specified
				if (Array.isArray(filterKeys) && filterKeys.length > 0) {
					field = omit(field, filterKeys);
				}

				let fieldType = Array.isArray(field.type) ? field.type[0] : field.type;

				// skip dynamic fields (that have a resolver)
				if (field.resolve) {
					continue;
				}

				// find complex types
				if (typeof fieldType === 'object' && fieldType.fields) {
					fieldType.name = fieldType.name ||  [schema.name, '_', fieldKey].join('');
					fieldType = this.generateInputType(fieldType, filterKeys);
				}

				if (Array.isArray(field.type)) {
					field.type = new GraphQLList(fieldType);
				} else {
					field.type = fieldType;
				}

				resolvedModelFields[fieldKey] = field;
			}
		}

		let graphQLObjectSchema = {
			name: genGraphQLTypeName,
			fields: resolvedModelFields
		};

		let genGraphQLType = new GraphQLInputObjectType(graphQLObjectSchema);

		// // Store in Stores (Type, Meta)
		// Meta.store(genGraphQLTypeName, graphQLObjectSchema);
		// this.store(genGraphQLTypeName, genGraphQLType);
		return genGraphQLType;
	}

}
export default Types