import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { List, Icon } from 'semantic-ui-react';

export default class sidebar extends Component {
    render() {
        return (
            <List selection verticalAlign='middle'>
                <List.Item>
                    <List.Content>
                        <List.Header as='div'>
                            <Icon name='tasks' />
                            <Link to="/">Thống kê</Link>
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='div'>
                            <Icon name='save outline' />
                            <Link to="/saveforlater">Lưu lại mua sau</Link>
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='div'>
                            <Icon name='heart outline' />
                            <Link to="/wishlist">Thêm vào yêu thích</Link>
                        </List.Header>
                    </List.Content>
                </List.Item>
            </List>
        )
    }
}
