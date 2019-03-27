import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form, Button, Collapse, Upload, notification, Select, Icon,
} from 'antd';
import axios from 'axios';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const Panel = Collapse.Panel;
const Option = Select.Option;

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
    renderPainelEnviarInformacoes(getFieldDecorator) {
        return (
            <Card title='Buscar informações no speciesLink'>
                <Row gutter={6}>
                    <Col span={6}>
                        <Upload name='myImage' accept='text/plain' action='http://localhost:3003/api/specieslink-executa' onChange={this.carregArquivo}>
                            <Button style={{ width: '135%' }} className='login-form-button'>
                                <Icon type='upload' /> Selecione o arquivo .TXT do speciesLink
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={6}>
                        <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.comparaReflora}>
                            Enviar
                    </Button>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center', top: '6px' }}>
                        <span style={{ fontWeight: 'bold' }}>A última atualização foi feita {this.state.horarioUltimaAtualizacao} e durou {this.state.duracaoAtualizacao}.</span>
                    </Col>
                    <Col span={6} >
                        <Select placeholder='Selecione o LOG desejado'>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 20 }} gutter={6}>
                </Row>
                <Row gutter={6}>
                    <Col span={24}>
                        <Collapse accordion>
                            <Panel header='Verificar LOG de saída'>
                            </Panel>
                        </Collapse>
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
