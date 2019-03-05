import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Input, Button, Select, Switch, Collapse, TimePicker
} from 'antd';
import axios from 'axios';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class ListaServicosRefloraScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            desabilitaCamposAtualizacaoAutomatico: true,
            horarioUltimaAtualizacao: '',
            escondeResultadoLog: '2',
            saidaLOG: [],
        }
    }

    /**
     * 1.Os botões vem do módulo antd, que tem somente os tipos primary, default, dashed e alert;
     * 2.O switch da atualização automática, usa essa função, que quando clicado alterado o estado;
     * 2.1 O estado inicial do switch tá definido no construtor.
     * ================= COMO FUNCIONA =================
     * 1.Atualização imediata
     * 1.1 Quando eu clicar ele realiza a atualização
     * 1.2 Se ele estiver rodando e eu clicar novamente não é feito nada, pois é verifica que já existe a tabela reflora e cai fora
     * 1.3 Só mostra a data de atualização quando ele verifica que no último valor do LOG, veio a mensagem esperada
     * 1.3.1 Isso porque, existem algumas vezes que é como se ele clicasse sozinho, e dai ele muda a data de última atualização
     * 1.4 Só mostra o resultado do LOG quando ele verifica que no último valor do LOG, veio a mensagem esperada
     * */

    getDisabledMinutes = (selectedMinutes) => {
    }

    trocaEstadoCamposAtualizacaoAutomatico() {
        this.setState({ desabilitaCamposAtualizacaoAutomatico: !this.state.desabilitaCamposAtualizacaoAutomatico });
    }

    comparaReflora = () => {
        axios.get('/reflora').then(response => {
            if (response.status === 200) {
                if (response.data.log[response.data.log.length - 1].saida.includes('O processo de comparação do Reflora acabou.')) {
                    this.setState({ horarioUltimaAtualizacao: response.data.horario });
                    this.setState({ saidaLOG: response.data.log });
                }
            }
        });
    }

    renderPainelBuscarInformacoes() {
        return (
            <Card title='Buscar informações no Reflora'>
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Deseja atualizar agora?</span>
                    </Col>
                    <Col span={6}>
                        <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.comparaReflora}>
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
                            <TimePicker
                                style={{ width: '100%' }}
                                placeholder='Insira a hora desejada'
                                format={'HH'}
                                disabledMinutes={this.getDisabledMinutes}
                                disabled={this.state.desabilitaCamposAtualizacaoAutomatico}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Select defaultValue='Semanalmente' disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                                <Option value='Semanalmente'>Semanalmente</Option>
                                <Option value='Mensalmente'>Mensalmente</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <span style={{ fontWeight: 'bold' }}>A última atualização foi {this.state.horarioUltimaAtualizacao}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Collapse accordion>
                        <Panel header='Verificar LOG de saída' key={this.state.escondeResultadoLog}>
                            {this.state.saidaLOG.map((saida, chave) => {
                                if (saida.saida.includes('Erro')) {
                                    return <p key={chave} style={{ fontFamily: 'Courier New', color: 'red' }}>{saida.saida}</p>
                                } else {
                                    return <p key={chave} style={{ fontFamily: 'Courier New', color: 'green' }}>{saida.saida}</p>
                                }
                            })}
                        </Panel>
                    </Collapse>
                </Row>
            </Card>
        )
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <HeaderServicesComponent title={'Reflora'} />
                <Divider dashed />
                {this.renderPainelBuscarInformacoes()}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosRefloraScreen);

