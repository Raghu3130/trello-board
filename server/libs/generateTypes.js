import { mapValues } from 'lodash';
import {
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLEnumType,
} from 'graphql';

function getValue(type,name){
  const data =mapValues(type.getFields(), (field) =>{
    return convertInputObjectField(field)
  });
  if(name === 'Input'){
    delete data.id;
  }
  return data;
  
}

export default function createInputObject(
  type,name
) {
  return new GraphQLInputObjectType({
     name: type.name + name, 
     fields: getValue(type,name)
     
   });
}

function convertInputObjectField(
  field,
) {
  let fieldType = field.type;
  const wrappers = [];

  while (fieldType.ofType) {
    wrappers.unshift(fieldType.constructor);
    fieldType = fieldType.ofType;
  }

  if (!(fieldType instanceof GraphQLInputObjectType ||
        fieldType instanceof GraphQLScalarType ||
        fieldType instanceof GraphQLEnumType)) {
    fieldType = fieldType.getInterfaces().includes(NodeInterface) ?
      ID :
      createInputObject(fieldType)
  }

  fieldType = wrappers.reduce((type, Wrapper) => {
    return new Wrapper(type);
  }, fieldType);

  return { type: fieldType };
}