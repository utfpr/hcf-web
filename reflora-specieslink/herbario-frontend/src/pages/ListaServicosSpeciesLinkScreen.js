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
        this.nomeLOG();
        this.statusExecucao();
        this.state = {
            file: null,
            statusExecucao: false,
            nomeLog: [],
            horarioUltimaAtualizacao: '',
            duracaoAtualizacao: '',
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.carregaArquivo = this.carregaArquivo.bind(this);
    }

    nomeLOG = () => {
        const params = {
            herbarioVirtual: 'specieslink',
        };
        axios.get('/specieslink-todoslogs', { params }).then(response => {
            if (response.status === 200) {
                const logs = response.data.logs.sort();
                const duracao = response.data.duracao;
                this.setState({ nomeLog: logs });
                this.setState({ horarioUltimaAtualizacao: logs[logs.length - 1] });
                this.setState({ duracaoAtualizacao: duracao });
            }
        });
    }

    statusExecucao = () => {
        setInterval(() => {
            axios.get('/specieslink-status-execucao').then(response => {
                if (response.status === 200) {
                    // O resultado do json é string então por isso necessita a comparação
                    console.log(`->${response.data.result}`)
                    console.log(`x->${response.data.result === 'true'}`)
                    if (response.data.result === 'true') {
                        console.log('bbbbaqui')
                        this.setState({ statusExecucao: true });
                    } else {
                        console.log('ccccaqui')
                        this.setState({ statusExecucao: false });
                    }
                }
            });
        }, 5000);
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
                if (response.data.result === 'error_file') {
                    this.openNotificationWithIcon('error', 'Falha', 'O arquivo não é o esperado.');
                } else if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'Atualização já está ocorrendo.');
                } else {
                    this.setState({ statusExecucao: true });
                    this.openNotificationWithIcon('success', 'Sucesso', 'Atualização iniciará em breve.');
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
                <Row style={{ flex: 1 }} gutter={8}>
                    <Col span={6}>
                        <Upload {...props}>
                            <Button htmlType='submit' className='login-form-button' disabled={this.state.statusExecucao}>
                                <Icon type='upload' /> Selecione o arquivo .TXT do speciesLink
                            </Button>
                        </Upload>
                    </Col>
                    {this.state.statusExecucao ?
                        <Col span={6} style={{ textAlign: 'center', top: '6px' }}>
                            <span style={{ fontWeight: 'bold' }}>EXECUTANDO!!! AGUARDE...</span>
                        </Col>
                        :
                        <Col span={6}>
                            <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.onFormSubmit} disabled={this.state.statusExecucao}>
                                Enviar
                            </Button>
                        </Col>
                    }
                    <Col span={6} style={{ textAlign: 'center', top: '6px' }}>
                        <span style={{ fontWeight: 'bold' }}>A última atualização foi feita {this.state.horarioUltimaAtualizacao} e durou {this.state.duracaoAtualizacao}.</span>
                    </Col>
                    <Col span={6} >
                        <Select placeholder='Selecione o LOG desejado'>
                            {this.state.nomeLog.map((saida, chave) => {
                                return <Option key={chave} value={saida}>{saida}</Option>
                            })}
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
