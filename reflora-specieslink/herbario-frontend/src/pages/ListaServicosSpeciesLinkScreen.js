import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form, Button, Collapse, Upload, Icon, notification,
} from 'antd';
import axios from 'axios';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const FormItem = Form.Item;
const Panel = Collapse.Panel;


class ListaServicosSpeciesLinkScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('myImage', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/specieslink-executa", formData, config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
            });
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    /** Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert */
    renderPainelEnviarInformacoes(getFieldDecorator) {
        return (
            <Card title='Buscar informações no speciesLink'>
                <form onSubmit={this.onFormSubmit}>
                    <h1>File Upload</h1>
                    <input type="file" name="myImage" onChange={this.onChange} />
                    <button type="submit">Upload</button>
                </form>
            </Card>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSubmit}>
                <HeaderServicesComponent title={'SpeciesLink'} />
                <Divider dashed />
                {this.renderPainelEnviarInformacoes(getFieldDecorator)}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosSpeciesLinkScreen);
