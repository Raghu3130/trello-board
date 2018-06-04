import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ApolloProvider, getDataFromTree} from 'react-apollo'
import initApollo from '../src/Components/initApollo'
import Home from './pages/Home'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.apollo = initApollo()
  }

  render() {
    return (
      <ApolloProvider client={this.apollo}>
        <Router>
          <Route
            render={({ location }) => (
              <Switch location={location} >
                <Route exact path="/" component={Home} />
              </Switch>
            )}
          />
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
