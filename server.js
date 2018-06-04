import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
const cors = require('cors')
const path = require('path');
// let's import the schema file we just created
import  schemagen from './server/schemagen';
let schema = new  schemagen();
 const app = express();
//  app.use(express.static(path.join(__dirname, 'build')));
 
// app.get('/*', function (req, res) {
// 	  console.log("request",req)
// 	res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.use(cors());

  
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema.generate() }));
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
 
 
// let's set the port on which the server will run
app.set( 'port', 1337 );
// start the server
app.listen(
	app.get('port'),
	() => {
		const port = app.get('port');
		console.log('GraphQL Server Running at http://127.0.0.1:' + port );
	}
);

