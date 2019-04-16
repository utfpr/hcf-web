import React, { Component } from 'react';
import {
	Divider, Icon, Modal, Card, Row, Col, Form,
	Input, Button, notification,
} from 'antd';
import { Link } from 'react-router-dom';
import HeaderListComponent from '../components/HeaderListComponent';

const confirm = Modal.confirm;
const FormItem = Form.Item;


class GerenciamentoScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
		}
    }
    
	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div>
				<HeaderListComponent title={"Gerenciamento Species Link"} add={false} />
				<Divider dashed />
				 <p> Insira seu codigo aqui</p>
			</div>
		);
	}
}

export default Form.create()(GerenciamentoScreen);
