import React, { Component } from 'react';
import { Input } from 'antd';
import latitudeMascara from '../helpers/mascaras/coordenada';

export default class CoordenadaInputText extends Component {

    state = {
        value: '',
    };

    render() {
        return (
            <Input
                {...this.props}
                type="text"
                value={this.state.value}
                onChange={event => {
                    const value = latitudeMascara(event.target.value);
                    this.setState({ value });
                }}
            />
        );
    }
}