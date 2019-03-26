import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form, Button, Collapse, Upload, notification, Input, Icon,
} from 'antd';
import axios from 'axios';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const FormItem = Form.Item;
const Panel = Collapse.Panel;

class ListaServicosSpeciesLinkScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.carregArquivo = this.carregArquivo.bind(this);
    }

    onFormSubmit = e => {
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

    carregArquivo = info => {
        this.setState({ file: info[0] });
        // const formData = new FormData();
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    /** Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert */
    /*
    <form onSubmit={this.onFormSubmit}>
                    <h1>File Upload</h1>
                    <input type="file" name="myImage" onChange={this.onChange} />
                    <button type="submit">Upload</button>
                </form>
    */
    renderPainelEnviarInformacoes(getFieldDecorator) {
        return (
            <Card title='Buscar informações no speciesLink'>
                <Row gutter={6}>
                    {/**
                    <Col span={6}>
                        <input type="file" htmlType='submit' name="myImage" accept="text/plain" onChange={this.onChange} />
                    </Col>
                    <Col span={6}>
                        <button type="submit" onClick={this.onFormSubmit}>Upload</button>
                    </Col>
                    */}
                    <Col span={6}>
                        <Upload name='myImage' accept='text/plain' action='http://localhost:3003/api/specieslink-executa' onChange={this.carregArquivo}>
                            <Button>
                                <Icon type='upload' /> Selecione o arquivo .TXT do speciesLink
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={6}>
                        <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.comparaReflora}>
                            Enviar
                    </Button>
                    </Col>
                </Row>
            </Card >
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
