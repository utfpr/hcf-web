import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    notification, Button, Select, Switch, Collapse, TimePicker
} from 'antd';
import axios from 'axios';
import HeaderServicesComponent from '../components/HeaderServicesComponent';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class ListaServicosRefloraScreen extends Component {

    constructor(props) {
        super(props);
        this.getNomeLOG();
        this.state = {
            desabilitaCamposAtualizacaoAutomatico: true,
            horarioUltimaAtualizacao: '',
            horarioAtualizacao: '',
            periodicidadeAtualizacao: '',
            escondeResultadoLog: '2',
            nomeLog: [],
            saidaLOG: [],
        }
    }

    getNomeLOG = () => {
        axios.get('/reflora-todoslogs').then(response => {
            if (response.status === 200) {
                const logs = response.data.logs.sort();
                this.setState({ nomeLog: logs });
                this.setState({ horarioUltimaAtualizacao: logs[logs.length - 1] });
                console.log(logs[logs.length - 1]);
            }
            // console.log(response.data.logs);
            // return response.data.logs;
            // promessa.resolve(response.data.logs);
        });
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

    getHorarioAgenda = (time, timeString) => {
        console.log(`t${timeString}`);
        this.setState({ horarioAtualizacao: timeString }, () => {
            if (this.state.periodicidadeAtualizacao.length > 0) {
                console.log(`e${this.state.periodicidadeAtualizacao}`);
                console.log(`p${this.state.horarioAtualizacao}`);
                // faço a requisição
                console.log(`horario`)

                const params = {
                    horario: this.state.horarioAtualizacao,
                    periodicidade: this.state.periodicidadeAtualizacao
                };
                axios.get('/reflora-agenda', { params }).then(response => {
                    console.log(response.data.title);
                });
            }
        });
    }

    getPeriodicidade = periodicidade => {
        console.log(`p${periodicidade}`)
        /**
         * O set state não é algo imediato, por isso utilizamos o callback para que o valor atualizado
         * seja utilizado na requisição ao backend
         */
        this.setState({ periodicidadeAtualizacao: periodicidade }, () => {
            if (this.state.horarioAtualizacao.length > 0) {
                console.log(`e${this.state.periodicidadeAtualizacao}`);
                console.log(`p${this.state.horarioAtualizacao}`);
                // faço a requisição
                console.log(`periodicidade`);
                axios.get(`/reflora/${this.state.horarioAtualizacao}-${this.state.periodicidadeAtualizacao}`).then(response => {
                    console.log(`r${response}`);
                });
            }
        });
    }

    getLog = log => {
        const params = {
            nomeLog: log,
        };
        axios.get('/reflora-log', { params }).then(response => {
            // console.log(response.data.title);
            console.log(response.data.log);
            this.setState({ saidaLOG: response.data.log });
        });
    }

    getDisabledMinutes = (selectedMinutes) => {
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

    comparaReflora = () => {
        /**
         * O axios, ele realiza requisições de dois em dois minutos se não há resposta
         * ele realiza novamente. Se você aumenta o timeout, o resultado continua sendo o mesmo.
         */
        axios.get('/reflora').then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.openNotificationWithIcon('error', 'Falha', 'O processo de atualização já está sendo executado.');
                } else {
                    this.openNotificationWithIcon('success', 'Sucesso', 'O processo de atualização será executado.');
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
                                onChange={this.getHorarioAgenda}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Select
                                placeholder='Selecione a periodicidade desejada'
                                onChange={this.getPeriodicidade}
                                disabled={this.state.desabilitaCamposAtualizacaoAutomatico}>
                                <Option value='semanal'>Semanalmente</Option>
                                <Option value='mensal'>Mensalmente</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <span style={{ fontWeight: 'bold' }}>A última atualização foi feita {this.state.horarioUltimaAtualizacao}</span>
                        </FormItem>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <Select
                                placeholder='Selecione o LOG desejado'
                                onChange={this.getLog}
                            >
                                {this.state.nomeLog.map((saida, chave) => {
                                    return <Option key={chave} value={saida}>{saida}</Option>
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
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

