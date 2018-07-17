import React, { Component } from 'react';
import { Segment, List, Image, Label, Header, Button, Icon, Dimmer, Loader } from 'semantic-ui-react';
import product from '../images/product.png';

export default class TopUser_Saveforlater extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            loading: true
        };
    }
    componentDidMount(){
        fetch('/api/customers')
        .then(res => res.json())
        .then(customers => this.setState({customers}, () => this.setState({ loading: false })));
    }
    countAction = (count) => {
        if ( count === undefined)
         return '0';
         else
         return count;
    }
    loading = () => {
        if (this.state.loading === true)
            return (
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
            )
        else 
            return false;
    }
    render() {
        return (
            <Segment>
                <Header as='h4'>
                    Top người dùng thêm vào mua sau
                    <Button basic floated='right' className="shadow-none"><Icon name="ellipsis horizontal" /></Button>
                </Header>
                <List selection divided verticalAlign='middle'>
                    {this.state.customers.map(cus =>
                        <List.Item key={cus._id}>
                            <Image avatar src={product} />
                            <List.Content>
                                <List.Header>{cus.first_name} {cus.last_name}</List.Header>
                            </List.Content>
                            <Label as='span' color='green' size="medium" pointing="left">
                                {this.countAction(cus.add_savelater_count)} hành động
                            </Label>
                        </List.Item>
                    )}
                </List>
            </Segment>
        )
    }
}
