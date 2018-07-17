import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { List, Image } from 'semantic-ui-react';
import product from '../images/product.png'

export default class TopProduct_Saveforlater extends Component {
    render() {
        return (
            <List horizontal size="medium">
                <List.Item>
                    <Image avatar src={product} />
                    <List.Content>
                        <List.Header><Link to="#">Product 1</Link></List.Header>
                        300.000đ
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={product} />
                    <List.Content>
                        <List.Header><Link to="#">Product 1</Link></List.Header>
                        300.000đ
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={product} />
                    <List.Content>
                        <List.Header><Link to="#">Product 1</Link></List.Header>
                        300.000đ
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={product} />
                    <List.Content>
                        <List.Header><Link to="#">Product 1</Link></List.Header>
                        300.000đ
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={product} />
                    <List.Content>
                        <List.Header><Link to="#">Product 1</Link></List.Header>
                        300.000đ
                    </List.Content>
                </List.Item>
            </List>
        )
    }
}
