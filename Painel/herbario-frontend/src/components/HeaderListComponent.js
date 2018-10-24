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
				<Col span={4}>
					<Row type="flex" justify="end">
						<Link to={this.props.link || "/"}>
							<Button
								type="primary"
								icon="plus"
								style={{ backgroundColor: "#5CB85C", borderColor: "#5CB85C" }}
							>
								Adicionar
              </Button>
						</Link>
					</Row>
				</Col>
			);
		}
	}

	render() {
		return (
			<Row gutter={24} style={{ marginBottom: "20px" }}>
				<Col span={20}>
					<h2 style={{ fontWeight: 200 }}>{this.props.title}</h2>
				</Col>
				{this.renderButton()}
			</Row>
		);
	}
}
