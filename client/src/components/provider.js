import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Route } from "react-router-dom";
import Homepage from './pages/homepage';
import Sidebar from './modules/sidebar';
import Saveforlater from './pages/saveforlater';
import Wishlist from './pages/wishlist';

export default class Sidebarapp extends Component {
  render() {
    return (
      <Grid columns='equal' className="h-100 bg--gray">
        <Grid.Row stretched>
          <Grid.Column width={3}>
            <Segment className='br-gray' size='large' basic>
              <Sidebar />
            </Segment>
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment basic>
              <Route path="/" exact component={Homepage} />
              <Route path="/saveforlater" exact component={Saveforlater} />
              <Route path="/wishlist" exact component={Wishlist} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
