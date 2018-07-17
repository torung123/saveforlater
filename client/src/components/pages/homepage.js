import React, { Component } from 'react';
import Analytic from '../statistic/statistic';
import TopProduct_Saveforlater from '../modules/TopProduct_Saveforlater';
import TopUser_Saveforlater from '../modules/TopUser_Saveforlater';
import TopProduct_WishList from '../modules/TopProduct_WishList';
import TopUser_WishList from '../modules/TopUser_WishList';
import { Header, Segment, Button, Icon} from 'semantic-ui-react';

export default class homepage extends Component {
  render() {
    return (
      <div>
        <Segment basic>
          <Header as='h2'>Xem thống kê
            <Header.Subheader>
              Đây là những gì đang xảy ra với cửa hàng của bạn ngày hôm nay.
            </Header.Subheader>
          </Header>
        </Segment>
        <Segment basic><Analytic /></Segment>
        <Segment>
          <Header as='h4'>Top sản phẩm thêm vào mua sau <Button basic floated='right' className="shadow-none"><Icon name="ellipsis horizontal"/></Button></Header>
          <TopProduct_Saveforlater />
        </Segment>
        
        <TopUser_Saveforlater/>
        
        <Segment>
          <Header as='h4'>
              Top sản phẩm thêm vào yêu thích
              <Button basic floated='right' className="shadow-none"><Icon name="ellipsis horizontal"/></Button>
          </Header>
          <TopProduct_WishList />
        </Segment>
        <Segment loading>
          <Header as='h4'>
            Top người dùng thêm vào yêu thích
            <Button basic floated='right' className="shadow-none"><Icon name="ellipsis horizontal"/></Button>
          </Header>
          <TopUser_WishList/>
        </Segment>
      </div>
    )
  }
}
