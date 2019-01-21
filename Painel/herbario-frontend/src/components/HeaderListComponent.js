import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
	isCuradorOuOperador,
} from '../helpers/usuarios';

export default class HeaderListComponent extends Component {
	renderButton() {
		if (this.props.add === undefined && isCuradorOuOperador()) {
			return (
				<Link to={this.props.link || "/"}>
					<Button
						type="primary"
						icon="plus"
						style={{
							backgroundColor: "#5CB85C",
							borderColor: "#5CB85C",
							width: '100%',
						}}
					>
						Adicionar
              				</Button>
				</Link>
			);
		}
	}

	render() {
		return (
			<Row gutter={24} style={{ marginBottom: "20px" }}>
				<Col xs={24} sm={24} md={18} lg={21} xl={21}>
					<h2 style={{ fontWeight: 200 }}>{this.props.title}</h2>
				</Col>
				<Col xs={24} sm={12} md={6} lg={3} xl={3}>
					{this.renderButton()}
				</Col>
			</Row>
		);
	}
}
