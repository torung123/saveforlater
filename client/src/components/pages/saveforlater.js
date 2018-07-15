import React, { Component } from 'react';
import { Header, Segment} from 'semantic-ui-react';

export default class saveforlater extends Component {
  render() {
    return (
      <div>
        <Segment basic>
          <Header as='h2'>Chức năng lưu lại mua sau
            <Header.Subheader>
             Khách hàng lưu lại sản phẩm trong account và mua lại sau
            </Header.Subheader>
          </Header>
        </Segment>
      </div>
    )
  }
}
