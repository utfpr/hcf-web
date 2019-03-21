import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    notification, Button, Select, Switch, Collapse
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
            duracaoAtualizacao: '',
            executando: false,
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

    /**
    * =====================================================================================
    * FUNCIONALIDADES RELACIONADA COMO APARECER NOTIFICAÇÃO, OCULTAR OU NÃO BOTÕES E CAMPOS
    * =====================================================================================
    */
    statusAgenda = () => {
        setInterval(() => {
            AXIOS.get('/reflora-status-agenda').then(response => {
                if (response.status === 200) {
                    console.log(response.data.horario);
                    if (response.data.horario.length > 0 && response.data.periodicidade.length > 0) {
                        this.setState({ periodicidadeAtualizacao: response.data.periodicidade });
                        console.log(this.state.desabilitaCamposAtualizacaoAutomatico);
                        if (this.state.desabilitaCamposAtualizacaoAutomatico) {
                            this.setState({ desabilitaCamposAtualizacaoAutomatico: false });
                        }
                    }
                }
            });
        }, 60000);
    }

    statusExecucao = () => {
        setInterval(() => {
            AXIOS.get('/reflora-executando').then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    if (response.data.executando === 'false') {
                        this.setState({ executando: false });
                    } else if (response.data.executando === 'true') {
                        this.setState({ executando: true });
                    }
                    if (response.data.periodicidade === ' ') {
                        if (!this.state.desabilitaCamposAtualizacaoAutomatico) {
                            console.log('aqui');
                            this.setState({ desabilitaCamposAtualizacaoAutomatico: true });
                        }
                    } else {
                        this.setState({ periodicidadeAtualizacao: response.data.periodicidade });
                        if (this.state.desabilitaCamposAtualizacaoAutomatico) {
                            console.log('aqui2');
                            this.setState({ desabilitaCamposAtualizacaoAutomatico: false });
                        }
                    }
                }
            });
        }, 5000);
    }

    trocaEstadoCamposAtualizacaoAutomatico() {
        this.setState({ desabilitaCamposAtualizacaoAutomatico: !this.state.desabilitaCamposAtualizacaoAutomatico });
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    /**
     * ==================================
     * FUNCIONALIDADES RELACIONADA AO LOG
     * ==================================
     */
    nomeLOG = () => {
        AXIOS.get('/reflora-todoslogs').then(response => {
            if (response.status === 200) {
                const logs = response.data.logs.sort();
                const duracao = response.data.duracao;
                this.setState({ nomeLog: logs });
                this.setState({ horarioUltimaAtualizacao: logs[logs.length - 1] });
                this.setState({ duracaoAtualizacao: duracao });
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

    /**
     * ============================================================
     * FUNCIONALIDADES RELACIONADA A COMPARAÇÃO DO REFLORA AGENDADO
     * ============================================================
     */
    retornaValorPeriodicidade = () => {
        switch (this.state.periodicidadeAtualizacao) {
            case 'SEMANAL':
                return 2;
            case '1MES':
                return 3;
            case '2MESES':
                return 4;
        }
    }

    retornaDataProximaAtualizacao = () => {
        switch (this.state.periodicidadeAtualizacao) {
            case 'SEMANAL':
                return moment().day(7).format('DD-MM-YYYY');
            case '1MES':
                return moment().day(30).format('DD-MM-YYYY');
            case '2MESES':
                return moment().day(60).format('DD-MM-YYYY');
        }
    }

    programaPeriodicidadeAtualizacao = periodicidade => {
        this.setState({ periodicidadeAtualizacao: periodicidade });
    }

    mensagemSemanal = diaDaSemana => {
        switch (diaDaSemana) {
            case 1:
                return `O processo de atualização foi agendado para toda segunda-feira a meia-noite.`;
            case 2:
                return `O processo de atualização foi agendado para toda terça-feira a meia-noite.`;
            case 3:
                return `O processo de atualização foi agendado para toda quarta-feira a meia-noite.`;
            case 4:
                return `O processo de atualização foi agendado para toda quinta-feira a meia-noite.`;
            case 5:
                return `O processo de atualização foi agendado para toda sexta-feira a meia-noite.`;
            case 6:
                return `O processo de atualização foi agendado para todo sábado a meia-noite.`;
            case 7:
                return `O processo de atualização foi agendado para todo domingo a meia-noite.`;
            default:
                break;
        }
    }

    mensagemMensal = () => {
        return `O processo de atualização foi agendado e será feito a cada um meses.`;
    }

    mensagem2Mensal = () => {
        return `O processo de atualização foi agendado e será feito a cada dois meses.`;
    }

    programaAtualizacao = () => {
        /**
         * Então toda vez que for agendado o processo, ele verifica o dia atual
         * se esse dia for maior que dia 28, ele faz a requisição dia 28. Além disso,
         * faz a requisição à partir da meia noite.
         */
        const params = {
            periodicidade: this.retornaValorPeriodicidade(),
            data_proxima_atualizacao: this.retornaDataProximaAtualizacao(),
        };
        AXIOS.get('/reflora', { params }).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'Não foi possível agendar o novo horário de atualização.');
                } else {
                    console.log(typeof (params.periodicidade))
                    if (params.periodicidade === 2) {
                        this.openNotificationWithIcon('success', 'Sucesso', this.mensagemSemanal(moment().isoWeekday()));
                    }
                    if (params.periodicidade === 3) {
                        this.openNotificationWithIcon('success', 'Sucesso', this.mensagemMensal(moment().format('DD')));
                    }
                    if (params.periodicidade === 4) {
                        this.openNotificationWithIcon('success', 'Sucesso', this.mensagem2Mensal(moment().format('DD')));
                    }
                }
            }
        });
    }

    /**
     * ============================================================
     * FUNCIONALIDADES RELACIONADA A COMPARAÇÃO DO REFLORA IMEDIATO
     * ============================================================
     * Essa função comparaReflora, só é chamada quando vai realizar a comparação
     * imediata. Nos parâmetros da requisição do GET, passamos 1 que representa o ENUM
     * do valor MANUAL, e null que é data  da próxima atualização, pois como é manual não
     * tem data. O axios, ele realiza requisições de dois em dois minutos se não há resposta
     * ele realiza novamente. Se você aumenta o timeout, o resultado continua sendo o mesmo.    
     */
    comparaReflora = () => {
        const params = {
            periodicidade: 1,
            data_proxima_atualizacao: null,
        };
        AXIOS.get('/reflora', { params }).then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'O processo de atualização está sendo executado no momento.');
                } else {
                    this.openNotificationWithIcon('success', 'Sucesso', 'O processo de atualização será inicializado em breve.');
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
                    <Col span={6} style={{ textAlign: 'center' }}>
                        {!this.state.executando ? <Button type='primary' htmlType='submit' className='login-form-button' onClick={this.comparaReflora}> Atualizar </Button> : <span style={{ fontWeight: 'bold' }}>EXECUTANDO!!! AGUARDE...</span>}
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>A última atualização foi feita {this.state.horarioUltimaAtualizacao} e durou {this.state.duracaoAtualizacao}.</span>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6} style={{ top: '21px' }}>
                        <span>Atualização automática</span>
                    </Col>
                    <Col span={6} style={{ top: '12px', textAlign: 'center' }}>
                        <FormItem>
                            <Switch checked={!this.state.desabilitaCamposAtualizacaoAutomatico} onChange={this.trocaEstadoCamposAtualizacaoAutomatico.bind(this)} disabled={this.state.executando} />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Periodicidade:</span>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6}>
                        <Select
                            placeholder='Selecione a periodicidade desejada'
                            onChange={this.programaPeriodicidadeAtualizacao}
                            value={this.state.periodicidadeAtualizacao !== '' ? this.state.periodicidadeAtualizacao : ''}
                            disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                            <Option value='SEMANAL'>A cada semana</Option>
                            <Option value='1MES'>A cada mês</Option>
                            <Option value='2MESES'>A cada dois meses</Option>
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
