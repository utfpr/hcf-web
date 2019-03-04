import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Input, Button, Select, Switch, Collapse,
} from 'antd';
import axios from 'axios';
import HeaderListComponent from '../components/HeaderListComponent';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class ListaServicosRefloraScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            desabilitaCamposAtualizacaoAutomatico: true,
            /* O botão de atualizar ele vem habilitado */
            desabilitarBotaoAtualizar: false,
            horarioUltimaAtualizacao: '',
            habilitaBotaoLog: true,
            escondeResultadoLog: '2',
            saidaLOG: [],
        }
    }

    trocaEstadoEscondeResultadoLog = () => {
        if (this.state.escondeResultadoLog === '2') {
            this.setState({ escondeResultadoLog: '1' });
        }
    }

    /**
     * 1.Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert;
     * 2.O switch da atualização automática, usa essa função, que quando clicado alterado o estado;
     * 2.1 O estado inicial do switch tá definido no construtor.
     * */

    trocaEstadoCamposAtualizacaoAutomatico() {
        this.setState({ desabilitaCamposAtualizacaoAutomatico: !this.state.desabilitaCamposAtualizacaoAutomatico });
        if (!this.state.habilitaBotaoLog) {
            this.setState({ habilitaBotaoLog: !this.state.habilitaBotaoLog });
        }
        if (this.state.escondeResultadoLog === '1') {
            this.setState({ escondeResultadoLog: '2' });
        }
    }

    comparaReflora = () => {
        /* Quando eu clico nele eu desabilito o botão de atualizar */
        this.setState({ desabilitarBotaoAtualizar: !this.state.desabilitarBotaoAtualizar });
        if (!this.state.habilitaBotaoLog) {
            this.setState({ habilitaBotaoLog: !this.state.habilitaBotaoLog });
        }
        if (this.state.escondeResultadoLog === '1') {
            this.setState({ escondeResultadoLog: '2' });
        }
        axios.get('/reflora').then(response => {
            if (response.status === 200) {
                this.setState({ horarioUltimaAtualizacao: response.data.horario });
                this.setState({ saidaLOG: response.data.log });
                /* Depois que eu recebo a mensagem habilito novamente */
                this.setState({ desabilitarBotaoAtualizar: !this.state.desabilitarBotaoAtualizar });
                this.setState({ habilitaBotaoLog: !this.state.habilitaBotaoLog });
            }
        });
    }

    renderPainelBuscarInformacoes(getFieldDecorator) {
        return (
            <Card title="Buscar informações no Reflora">
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Deseja atualizar agora?</span>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.state.desabilitarBotaoAtualizar} onClick={this.comparaReflora}>
                            Atualizar
						</Button>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6} style={{ top: '21px' }}>
                        <span>Atualização automática</span>
                    </Col>
                    <Col span={6} style={{ top: '12px', textAlign: 'center' }}>
                        <FormItem>
                            <Switch onChange={this.trocaEstadoCamposAtualizacaoAutomatico.bind(this)} />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <span>Horas:</span>
                    </Col>
                    <Col span={6}>
                        <span>Periodicidade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <FormItem>
                            <Input
                                disabled={this.state.desabilitaCamposAtualizacaoAutomatico}
                                placeholder={"Insira a hora desejada"} type="number"
                                min="0" max="23"
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Select defaultValue="Semanalmente" disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                                <Option value="Semanalmente">Semanalmente</Option>
                                <Option value="Mensalmente">Mensalmente</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <span style={{ fontWeight: "bold" }}>A última atualização foi {this.state.horarioUltimaAtualizacao}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Collapse accordion onChange={this.trocaEstadoEscondeResultadoLog}>
                        <Panel header="Verificar LOG de saída" key={this.state.escondeResultadoLog} disabled={this.state.habilitaBotaoLog}>
                            {this.state.saidaLOG.map((saida, chave) => {
                                return <p key={chave}>{saida.saida}</p>
                            })}
                        </Panel>
                    </Collapse>
                </Row>
            </Card>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.onSubmit}>
                <HeaderListComponent title={"Reflora"} />
                <Divider dashed />
                {this.renderPainelBuscarInformacoes(getFieldDecorator)}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosRefloraScreen);

