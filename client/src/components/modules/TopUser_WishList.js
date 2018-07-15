import React, { Component } from 'react';
import { List, Image, Label } from 'semantic-ui-react';
import product from '../images/product.png'

export default class TopUser_WishList extends Component {
  render() {
    return (
        <List selection divided verticalAlign='middle'>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Helen</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                20 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Christian</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                30 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
        <List.Item>
            <Image avatar src={product} />
            <List.Content>
                <List.Header>Daniel</List.Header>
            </List.Content>
            <Label as='span' color='green' size="medium" pointing="left">
                55 hành động
            </Label>
        </List.Item>
    </List>
    )
  }
}
