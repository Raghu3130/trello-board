import React ,{Component} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from '../../Components/Card';
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {get, map, sortBy} from 'lodash'
const getCradQuery = gql`query getCard{
  card{
    database{
      all {
        _id
        name
        display_order
        title
      }
    }
  }
}`;

const createCard=gql`mutation createcard($input:CardInput){
  card{
    database{
      create(input:$input) {
        _id
        name
        display_order
        title
      }
    }
  }
}`;
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'blue',
  color:isDragging ? 'red' : 'white',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  display:'flex',
  background: isDraggingOver ? 'lightblue' : 'grey',
  
  padding: grid,
  width: '100%',
});
 class Home extends Component{
  constructor(props){
    super(props);
		this.state = {
      items: getItems(5),
      card:[]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const card = reorder(
      this.state.card,
      result.source.index,
      result.destination.index
    );

    this.setState({
      card,
    });
  }
  addCard(){
    let {name,title,display_order} = this.state;
    let data={
      variables:{
        input:{
        name:name,
        title:title,
        display_order:display_order
        }
      },
      refetchQueries: ['getCard']
    }
    if(name && title && display_order){
      this.props.mutate(data).then(res =>{
        console.log("response from create",res);
      })
    }else{
      alert("fill form")
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    if(!nextProps.data.loading){
      this.setState({card:sortBy(get(nextProps.data,'card.database.all'),['display_order'])})
    }

  }
  UNSAFE_componentWillUpdate(nextProps,nextState){
    console.log(this.state,nextState);
  }
	render(){
   
    if( this.props.data.loading){
      return null
    }
    console.log("ff0",this.state);
    
		return(
      <div> 
        <DragDropContext onDragEnd={this.onDragEnd} style={{"display":"flex", "width":"100%"}}  >
          <Droppable droppableId="droppable" direction="horizontal">
            {(droppableProvided, droppableSnapshot) => (
              <div
                ref={droppableProvided.innerRef}
                style={getListStyle(droppableSnapshot.isDraggingOver)}>
                {map(this.state.card,(item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        style={getItemStyle(
                            draggableSnapshot.isDragging,
                            draggableProvided.draggableProps.style
                          )}
                      >
                      {item.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div>
          <h4>Add Card</h4>
          <input placeholder="Name" type="text" name="name" onInput={(e) => this.setState({name:e.target.value})} />
          <input placeholder="Title" type="text" name="title" onInput={(e) => this.setState({title:e.target.value})} />
          <input placeholder="display Order" type="number" name="display_order" onInput={(e) => this.setState({display_order:e.target.value})} />
          <button type='button' placeholder="Submit" onClick={() =>this.addCard()}> Submit</button>
        </div>
        </div>
		)
	}
}


export default graphql(createCard)(graphql(getCradQuery)(Home))