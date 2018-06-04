
import{
	GraphQLList,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType
} from 'graphql'



class database{
  constructor(){

  }

  addOneResolver(args){
    return "error";
  }

  queries(type, inputType, model) {
    let schema = model.schema;
    let modelName = schema.name;
    return new GraphQLObjectType({
      name: [modelName, 'session_query'].join(''),
      fields: {
        Addone:{
          type: new GraphQLList(schema),
          args: {
            subreddit: {
              type: GraphQLString,
              description: 'Please enter subreddit name',
            }
          },
          resolve(parent, args, context, info) {
            return this.addOneResolver(args);
          }
        },
        Add:{
          type: new GraphQLList(schema),
          args: {
            subreddit: {
              type: GraphQLString,
              description: 'Please enter subreddit name',
            }
          },
          resolve(parent, args, context, info) {
            return this.addOneResolver(args);
          }
        }
      }
    })
  };
  mutation(type, inputType, model) {
    let schema = model.schema;
    let modelName = schema.name;
    return new GraphQLObjectType({
      name: [modelName, 'session_mutation'].join(''),
      fields: {
        Addone:{
          type: new GraphQLList(schema),
          args: {
            subreddit: {
              type: GraphQLString,
              description: 'Please enter subreddit name',
            }
          },
          resolve(parent, args, context, info) {
            return this.addOneResolver(args);
          }
        },
        Add:{
          type: new GraphQLList(schema),
          args: {
            subreddit: {
              type: GraphQLString,
              description: 'Please enter subreddit name',
            }
          },
          resolve(parent, args, context, info) {
            return this.addOneResolver(args);
          }
        }
      }
    })
  };

}

 export default database

