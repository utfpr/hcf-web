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
        'Access-Control-Allow-Origin': 'http://localhost:3003/api'
    }
});

class ListaServicosRefloraScreen extends Component {

    /**
     * O constructor é aqui que herda as características do pai, que no caso é 
     * o Component, além disso, é inicializado as varáveis de estados.
     */
    constructor(props) {
        super(props);
        this.state = {
            estaMontado: false,
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
     * A função componentWillMount, ela é invocada quando os componentes estão prestes
     * a serem montados. Nessa função mudamos o valor da variável de estado permitindo 
     * assim que futuramente sejam mudado os valores das demais variáveis de estado.
     */
    componentWillMount() {
        this.setState({ estaMontado: true });
    }

    /**
    * A função componentDidMount, ela é invocada logo após os componentes serem montados.
    * Nessa função invocamos funções que realizam requisições ao backend de tempos em tempos,
    * e também realizamos requisições para obter informações, como a hora da última atualização,
    * a duração dessa última atualização e todos os logs relacionados ao herbário virtual.
    */
    componentDidMount() {
        this.informacoesReflora();
        this.statusAgenda();
        this.statusExecucao();
    }

    /**
     * A função componentWillUnmount, ela é invocada quando os componentes serão desmontados, 
     * por exemplo quando você troca de funcionalidades. Nela muda o valor da variável de estado
     * que é uma variável que verifica se os componentes do front end estão montados ou não. 
     * É necessário mudar o valor dessa variável de estado para evitar que seja mudados
     * os valores de variáveis de estados que não estejam montados. Além disso, ela é
     * utilizada pausar o setInterval que foram iniciados em outras funções. Essa função é
     * de extrema importância, pois evita problemas, pois se você não pausa o setInterval
     * ele vai tentar ficar mudando o valor de uma variável de estado que não está montada.
     */
    componentWillUnmount() {
        clearInterval(this.timerStatusAgenda);
        clearInterval(this.timerStatusExecucao);
        this.setState({ estaMontado: false });
    }

    statusAgenda = () => {
        this.timerStatusAgenda = setInterval(() => {
            AXIOS.get('/reflora-status-agenda').then(response => {
                if (response.status === 200) {
                    console.log(response.data.horario);
                    if (response.data.horario.length > 0 && response.data.periodicidade.length > 0) {
                        if (this.state.estaMontado) {
                            this.setState({ periodicidadeAtualizacao: response.data.periodicidade });
                        }
                        console.log(this.state.desabilitaCamposAtualizacaoAutomatico);
                        if (this.state.desabilitaCamposAtualizacaoAutomatico) {
                            if (this.state.estaMontado) {
                                this.setState({ desabilitaCamposAtualizacaoAutomatico: false });
                            }
                        }
                    }
                }
            });
        }, 60000);
    }

    statusExecucao = () => {
        this.timerStatusExecucao = setInterval(() => {
            AXIOS.get('/reflora-executando').then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    if (response.data.executando === 'false') {
                        if (this.state.estaMontado) {
                            this.setState({ executando: false });
                        }
                    } else if (response.data.executando === 'true') {
                        if (this.state.estaMontado) {
                            this.setState({ executando: true });
                        }
                    }
                    if (response.data.periodicidade === ' ') {
                        if (!this.state.desabilitaCamposAtualizacaoAutomatico) {
                            console.log('aqui');
                            if (this.state.estaMontado) {
                                this.setState({ desabilitaCamposAtualizacaoAutomatico: true });
                            }
                        }
                    } else {
                        if (this.state.estaMontado) {
                            this.setState({ periodicidadeAtualizacao: response.data.periodicidade });
                        }
                        if (this.state.desabilitaCamposAtualizacaoAutomatico) {
                            console.log('aqui2');
                            if (this.state.estaMontado) {
                                this.setState({ desabilitaCamposAtualizacaoAutomatico: false });
                            }
                        }
                    }
                }
            });
        }, 5000);
    }

    trocaEstadoCamposAtualizacaoAutomatico() {
        if (this.state.estaMontado) {
            this.setState({ desabilitaCamposAtualizacaoAutomatico: !this.state.desabilitaCamposAtualizacaoAutomatico });
        }
    }

    /**
     * A função exibeNotificacao, renderiza no canto superior direito uma mensagem
     * que é passa por parâmetro, e uma descrição dela que também é passada por parâmetro.
     * Ela é utiliza quando conseguiu sucesso ou erro na hora de atualizar imediatamente ou
     * quando é uma atualização programada na comparação no Reflora.
     * @param type, é o tipo de notificação que irá aparecer.
     * @param message, é a mensagem que irá ser renderizada.
     * @param description, é a descrição que será renderizada.
     */
    exibeNotificacao = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    /**
     * A função informacoesReflora, ela envia como parâmetro de requisição speciesLink
     * e é retornado informações de speciesLink que são: os logs que existem relacionado
     * ao Reflora, o horário da última atualização e a duração da última atualização.
     */
    informacoesReflora = () => {
        const params = {
            herbarioVirtual: 'reflora',
        };
        AXIOS.get('/reflora-todoslogs', { params }).then(response => {
            if (response.status === 200) {
                const logs = response.data.logs.sort();
                const duracao = response.data.duracao;
                if (this.state.estaMontado) {
                    this.setState({ nomeLog: logs });
                    this.setState({ horarioUltimaAtualizacao: logs[logs.length - 1] });
                    this.setState({ duracaoAtualizacao: duracao });
                }
            }
        });
    }

    /**
     * A função conteudoLogSelecionado, ela recebe como parâmetro o nome do
     * log na qual se deseja saber saber o conteúdo desse arquivo. Então 
     * durante a requisição é passado o nome do arquivo e o conteúdo retornado
     * é atribuído a uma variável de estado.
     * @param log, é o nome do arquivo de log na qual se deseja saber o seu conteúdo.
     */
    conteudoLogSelecionado = log => {
        const params = {
            herbarioVirtual: 'reflora',
            nomeLog: log,
        };
        AXIOS.get('/reflora-log', { params }).then(response => {
            if (this.state.estaMontado) {
                this.setState({ saidaLOG: response.data.log });
            }
        });
    }

    /**
     * A função retornaValorPeriodicidade, ela pega o valor da variável de estado 
     * que está atribuído a periodicidade e retorna um valor equivalente, então
     * se foi definido pelo usuário a periodicidade semanal é retornado o valor 2,
     * se for mensal será retornado o valor 3 e se for a cada dois meses retorna 4. 
     * É retornando isso e necessário essa função, pois isso equivale ao valor 
     * equivalente ao ENUM do backend.
     * @returns 2, é um inteiro que corresponde ao valor da periodicidade semanal.
     * @returns 3, é um inteiro que corresponde ao valor da periodicidade mensal.
     * @returns 4, é um inteiro que corresponde ao valor da periodicidade a cada dois meses.
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

    /**
     * A função retornaDataProximaAtualizacao, ela pega o valor da variável de estado 
     * que está atribuído a periodicidade e retorna a data da próxima atualização baseado
     * no valor da variável de estado da periodicidade calculando a partir do dia atual. 
     * Então, por exemplo, se a periodicidade é semanal, é pego a data atual e calculado 
     * a partir desse dia mais sete dias, para calcular o dia da próxima atualização. No
     * mensal é o dia atual mais trinta dias e a cada dois meses é o dia atual mais sessenta
     * dias, para se obter a data da próxima atualização.
     * @returns diaAtual + 7 dias, é uma string com a data da próxima atualização.
     * @returns diaAtual + 30 dias, é uma string com a data da próxima atualização.
     * @returns diaAtual + 60 dias, é uma string com a data da próxima atualização.
     */
    retornaDataProximaAtualizacao = () => {
        switch (this.state.periodicidadeAtualizacao) {
            case 'SEMANAL':
                return moment().day(moment().isoWeekday() + 7).format('DD-MM-YYYY');
            case '1MES':
                return moment().day(moment().isoWeekday() + 30).format('DD-MM-YYYY');
            case '2MESES':
                return moment().day(moment().isoWeekday() + 60).format('DD-MM-YYYY');
        }
    }

    /**
     * A função programaPeriodicidadeAtualizacao, ele pega o valor que foi recebido
     * como parâmetro atribui a uma variável de estado.
     * @params periodicidade, é uma string com o valor da periodicidade que foi definido
     * pelo usuário que pode ser semanal (SEMANAL), mensal (1MES) ou a cada dois meses
     * (2MESES).
     */
    programaPeriodicidadeAtualizacao = periodicidade => {
        this.setState({ periodicidadeAtualizacao: periodicidade });
    }

    /**
     * A função mensagemSemanal, ele pega o valor que foi recebido como parâmetro
     * (que é um valor de um a sete, sendo que um segunda e sete equivale ao domingo)
     * e dependendo desse valor que foi passado é retornado uma mensagem equivalente. Então
     * se o usuário definiu uma periodicidade semanal e o dia que ele definiu é segunda,
     * será retornado a mensagem que o processo de atualização foi agendado para toda
     * segunda-feira a meia-noite.
     * @params diaDaSemana, é um inteiro com o valor do dia da semana.
     * @returns string com a mensagem equivalente ao dia da semana, na qual foi definido a periodicidade.
     */
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

    /**
     * A função mensagemMensal, ele retorna uma string com uma mensagem quando o usuário
     * define a periodicidade da atualização mensal de comparação dos dados do Reflora.
     * @returns string, uma mensagem equivalente quando o usuário define a periodicidade mensal.
     */
    mensagemMensal = () => {
        return `O processo de atualização foi agendado e será feito a cada um meses.`;
    }

    /**
     * A função mensagem2Mensal, ele retorna uma string com uma mensagem quando o usuário
     * define a periodicidade da atualização mensal a cada dois meses de comparação dos dados do Reflora.
     * @returns string, uma mensagem equivalente quando o usuário define a periodicidade a cada dois meses.
     */
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
        console.log(`a${params.data_proxima_atualizacao}`);
        AXIOS.get('/reflora', { params }).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                if (response.data.result === 'failed') {
                    this.exibeNotificacao('error', 'Falha', 'Não foi possível agendar o novo horário de atualização.');
                } else {
                    console.log(typeof (params.periodicidade))
                    if (params.periodicidade === 2) {
                        this.exibeNotificacao('success', 'Sucesso', this.mensagemSemanal(moment().isoWeekday()));
                    }
                    if (params.periodicidade === 3) {
                        this.exibeNotificacao('success', 'Sucesso', this.mensagemMensal());
                    }
                    if (params.periodicidade === 4) {
                        this.exibeNotificacao('success', 'Sucesso', this.mensagem2Mensal());
                    }
                }
            }
        });
    }

    comparaReflora = () => {
        const params = {
            periodicidade: 1,
            data_proxima_atualizacao: null,
        };
        AXIOS.get('/reflora', { params }).then(response => {
            if (response.status === 200) {
                if (response.data.result === 'failed') {
                    this.exibeNotificacao('error', 'Falha', 'O processo de atualização está sendo executado no momento.');
                } else {
                    this.exibeNotificacao('success', 'Sucesso', 'O processo de atualização será inicializado em breve.');
                }
            }
        });
    }

    /**
     * A função renderPainelBuscarInformacoes, renderiza na interface do Reflora
     * o botão de atualizar imediatamente, o botão para habilitar (Esse botão habilita
     * os campos para definir e programar a periodicidade) e definir 
     * a periodicidade, label de quanto foi realizada a última atualização e
     * a duração dela, a lista de todos os logs correspondente ao serviço
     * do Reflora, e um campo que exibe o log selecionado.
     */
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
                            onChange={this.conteudoLogSelecionado}
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

    /**
     * A função render, renderiza o cabeçalho da interface e invoca
     * a outra função renderPainelBuscarInformacoes, que tem os demais
     * componentes como botão de atualizar informações de comparação
     * os dados do Reflora, os botões para definir a periodicidade,
     * informações de última atualização e a sua duração, as listas
     * com os nome de todos os logs e o conteúdo desse arquivo.
     */
    render() {
        return (
            <Form>
                <HeaderServicesComponent title={'Reflora'} />
                <Divider dashed />
                {this.renderPainelBuscarInformacoes()}
                <Divider dashed />
            </Form>
        );
    }
}

// Exportar essa classe como padrão
export default Form.create()(ListaServicosRefloraScreen);
