import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    notification, Button, Select, Switch, Collapse, TimePicker
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const AXIOS = axios.create({
    baseURL: 'http://localhost:3003/api',
    headers: {
        //you can remove this header
        'Access-Control-Allow-Origin': 'http://localhost:3003/api'
    }
});

class ListaServicosRefloraScreen extends Component {

    constructor(props) {
        super(props);
        this.nomeLOG();
        this.statusAgenda();
        this.statusExecucao();
        this.state = {
            desabilitaCamposAtualizacaoAutomatico: true,
            horarioUltimaAtualizacao: '',
            executando: false,
            horarioAtualizacao: '',
            periodicidadeAtualizacao: '',
            escondeResultadoLog: '2',
            nomeLog: [],
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
     * =====================PARA A ATUALIZAÇÃO AUTOMÁTICA=====================
     * 1.Quando ativo o switch ele pega os valores, e faz a requisição
     * 2.Eu pego a hora e seto no estado dela, vejo o valor que está no estado da periodicidade e faço a requisição
     * 3.Eu pego a periodicidade e seto no estado dela, vejo o valor que está no estado da hora e faço a requisição
     * */

    statusAgenda = () => {
        setInterval(() => {
            AXIOS.get('/reflora-status-agenda').then(response => {
                if (response.status === 200) {
                    console.log(response.data.horario);
                    if (response.data.horario.length > 0 && response.data.periodicidade.length > 0) {
                        this.setState({ horarioAtualizacao: response.data.horario });
                        this.setState({ periodicidadeAtualizacao: response.data.periodicidade });
                        console.log(this.state.desabilitaCamposAtualizacaoAutomatico);
                        if (this.state.desabilitaCamposAtualizacaoAutomatico) {
                            this.setState({ desabilitaCamposAtualizacaoAutomatico: false });
                        }
                    }
                }
            });
        }, 15000);
    }

    statusExecucao = () => {
        setInterval(() => {
            AXIOS.get('/reflora-executando').then(response => {
                if (response.status === 200) {
                    if (response.data.executando === 'false') {
                        this.setState({ executando: false });
                    } else if (response.data.executando === 'true') {
                        this.setState({ executando: true });
                    }
                }
            });
        }, 60000);
    }

    nomeLOG = () => {
        AXIOS.get('/reflora-todoslogs').then(response => {
            if (response.status === 200) {
                const logs = response.data.logs.sort();
                this.setState({ nomeLog: logs });
                this.setState({ horarioUltimaAtualizacao: logs[logs.length - 1] });
            }
        });
    }

    programaHoraAtualizacao = horario => {
        this.setState({ horarioAtualizacao: horario });
    }

    programaPeriodicidadeAtualizacao = periodicidade => {
        this.setState({ periodicidadeAtualizacao: periodicidade });
    }

    mensagemSemanal = (diaDaSemana, horaAtualizacao) => {
        switch (diaDaSemana) {
            case 1:
                return `O processo de atualização foi agendado para toda segunda-feira às ${horaAtualizacao}.`;
            case 2:
                return `O processo de atualização foi agendado para toda terça-feira às ${horaAtualizacao}.`;
            case 3:
                return `O processo de atualização foi agendado para toda quarta-feira às ${horaAtualizacao}.`;
            case 4:
                return `O processo de atualização foi agendado para toda quinta-feira às ${horaAtualizacao}.`;
            case 5:
                return `O processo de atualização foi agendado para toda sexta-feira às ${horaAtualizacao}.`;
            case 6:
                return `O processo de atualização foi agendado para todo sábado às ${horaAtualizacao}.`;
            case 7:
                return `O processo de atualização foi agendado para todo domingo às ${horaAtualizacao}.`;
            default:
                break;
        }
    }

    mensagemMensal = diaMensal => {
        return `O processo de atualização foi agendado pra todo dia do mês dia ${diaMensal}.`;
    }

    programaAtualizacao = () => {
        const params = {
            horario: this.state.horarioAtualizacao,
            periodicidade: this.state.periodicidadeAtualizacao,
        };
        AXIOS.get('/reflora-agenda', { params }).then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'Não foi possível agendar o novo horário de atualização.');
                } else {
                    if (params.periodicidade === 'semanal') {
                        this.openNotificationWithIcon('success', 'Sucesso', this.mensagemSemanal(moment().isoWeekday(), this.state.horarioAtualizacao));
                    }
                    if (params.periodicidade === 'mensal') {
                        this.openNotificationWithIcon('success', 'Sucesso', this.mensagemMensal(moment().format('DD')));
                    }
                }
            }
        });
    }

    informacoesLog = log => {
        const params = {
            nomeLog: log,
        };
        AXIOS.get('/reflora-log', { params }).then(response => {
            this.setState({ saidaLOG: response.data.log });
        });
    }

    /* desabilitaMinutos = selectedMinutes => {
    } */

    trocaEstadoCamposAtualizacaoAutomatico() {
        this.setState({ desabilitaCamposAtualizacaoAutomatico: !this.state.desabilitaCamposAtualizacaoAutomatico });
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    comparaReflora = () => {
        /**
         * O axios, ele realiza requisições de dois em dois minutos se não há resposta
         * ele realiza novamente. Se você aumenta o timeout, o resultado continua sendo o mesmo.
         */
        AXIOS.get('/reflora').then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'O processo de atualização está sendo executado no momento.');
                } else {
                    this.openNotificationWithIcon('success', 'Sucesso', 'O processo de atualização será inicializado em breve.');
                    this.setState({ executando: !this.state.executando });
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
                        {!this.state.executando ? <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.comparaReflora}> Atualizar </Button> : <span>Executando! Aguarde...</span>}
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>A última atualização foi feita {this.state.horarioUltimaAtualizacao}</span>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6} style={{ top: '21px' }}>
                        <span>Atualização automática</span>
                    </Col>
                    <Col span={6} style={{ top: '12px', textAlign: 'center' }}>
                        <FormItem>
                            <Switch checked={!this.state.desabilitaCamposAtualizacaoAutomatico} onChange={this.trocaEstadoCamposAtualizacaoAutomatico.bind(this)} />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Horas:</span>
                    </Col>
                    <Col span={6}>
                        <span>Periodicidade:</span>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        {/**
                         * Iremos trocar o TimePicker pelo Select pelo fato de que se já estiver 
                         * habilitado a programação automática ele já irá setar o valor do Select
                         */}
                        <Select
                            placeholder='Insira a hora desejada'
                            onChange={this.programaHoraAtualizacao}
                            value={this.state.horarioAtualizacao !== '' ? this.state.horarioAtualizacao : ''}
                            disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                            <Option value='00'>00</Option>
                            <Option value='01'>01</Option>
                            <Option value='02'>02</Option>
                            <Option value='03'>03</Option>
                            <Option value='04'>04</Option>
                            <Option value='05'>05</Option>
                            <Option value='06'>06</Option>
                            <Option value='07'>07</Option>
                            <Option value='08'>08</Option>
                            <Option value='09'>09</Option>
                            <Option value='10'>10</Option>
                            <Option value='11'>11</Option>
                            <Option value='12'>12</Option>
                            <Option value='13'>13</Option>
                            <Option value='14'>14</Option>
                            <Option value='15'>15</Option>
                            <Option value='16'>16</Option>
                            <Option value='17'>17</Option>
                            <Option value='18'>18</Option>
                            <Option value='19'>19</Option>
                            <Option value='20'>20</Option>
                            <Option value='21'>21</Option>
                            <Option value='22'>22</Option>
                            <Option value='23'>23</Option>
                            <Option value='24'>24</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder='Selecione a periodicidade desejada'
                            onChange={this.programaPeriodicidadeAtualizacao}
                            value={this.state.periodicidadeAtualizacao !== '' ? this.state.periodicidadeAtualizacao : ''}
                            disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                            <Option value='semanal'>Semanalmente</Option>
                            <Option value='mensal'>Mensalmente</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Button type='primary' htmlType='submit' className='login-form-button'
                            disabled={this.state.desabilitaCamposAtualizacaoAutomatico} onClick={this.programaAtualizacao}>
                            Definir atualização automática
                        </Button>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Select
                            placeholder='Selecione o LOG desejado'
                            onChange={this.informacoesLog}
                        >
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
                            <Panel header='Verificar LOG de saída' key={this.state.escondeResultadoLog}>
                                {this.state.saidaLOG.map((saida, chave) => {
                                    // console.log(saida);
                                    if (saida.includes('Erro')) {
                                        return <p key={chave} style={{ fontFamily: 'Courier New', color: 'red' }}>{saida}</p>
                                    } else {
                                        return <p key={chave} style={{ fontFamily: 'Courier New', color: 'green' }}>{saida}</p>
                                    }
                                })}
                            </Panel>
                        </Collapse>
                    </Col>
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

