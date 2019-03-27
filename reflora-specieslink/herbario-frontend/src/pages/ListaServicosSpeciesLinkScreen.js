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
        this.carregaArquivo = this.carregaArquivo.bind(this);
    }

    onFormSubmit = () => {
        const formData = new FormData();
        formData.append('myImage', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/specieslink-executa", formData, config).then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'Não foi possível realizar o upload do arquivo.');
                } else {
                    this.openNotificationWithIcon('success', 'Sucesso', 'Upload do arquivo foi realizado com sucesso.');
                }
            }
        });
    }

    carregaArquivo = info => {
        this.setState({ file: info[0] });
        // const formData = new FormData();
    }

    removeArquivo = info => {
        this.setState({ file: info[0] });
        return false;
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
        const { file } = this.state;
        const props = {
            onRemove: (f) => {
                this.setState({ file: f });
            },
            beforeUpload: (f) => {
                this.setState({ file: f });
                return false;
            },
            file,
        };
        return (
            <Card title='Buscar informações no speciesLink'>
                <Row gutter={6}>
                    <Col span={6}>
                        <Upload {...props}>
                            <Button style={{ width: '135%' }} className='login-form-button'>
                                <Icon type='upload' /> Selecione o arquivo .TXT do speciesLink
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={6}>
                        <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.onFormSubmit}>
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
