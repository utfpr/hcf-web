import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
    isCuradorOuOperador,
} from '../helpers/usuarios';

export default class HeaderServicesComponent extends Component {
    render() {
        return (
            <Row gutter={24} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={24} md={18} lg={21} xl={21}>
                    <h2 style={{ fontWeight: 200 }}>{this.props.title}</h2>
                </Col>
            </Row>
        );
    }
}
