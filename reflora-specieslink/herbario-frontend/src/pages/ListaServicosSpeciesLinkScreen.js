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
            estaMontado: false,
            arquivo: null,
            statusExecucao: false,
            nomeLog: [],
            horarioUltimaAtualizacao: '',
            duracaoAtualizacao: '',
            saidaLOG: [],
        };
    }

    componentWillMount() {
        this.setState({ estaMontado: true });
    }

    componentDidMount() {
        this.informacoesSpeciesLink();
        this.statusExecucao();
    }

    /**
     * A função componentWillUnmount, ela é invocada quando os componentes serão desmontados, 
     * por exemplo quando você troca de funcionalidades. Nela muda o valor da variável de estado
     * que é uma variável que verifica se os componentes do front end estão montados ou não.
     * Além disso, ela é utilizada pausar o setInterval que foram iniciados em outras funções.
     * Essa função é de extrema importância, pois evita problemas, pois se você não pausa o
     * setInterval ele vai tentar ficar mudando o valor de uma variável de estado que não está montada.
     */
    componentWillUnmount() {
        clearInterval(this.timerStatusExecucao);
        this.setState({ estaMontado: false });
    }

    /**
     * A função informacoesSpeciesLink, ela envia como parâmetro de requisição speciesLink
     * e é retornado informações de speciesLink que são: os logs que existem relacionado
     * ao speciesLink, o horário da última atualização e a duração da última atualização.
     */
    informacoesSpeciesLink = () => {
        const params = {
            herbarioVirtual: 'specieslink',
        };
        axios.get('/specieslink-todoslogs', { params }).then(response => {
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
     * A função statusExecucao, ela realizar requisições ao back end de cinco
     * em cinco segundos. Nesse tempo, ela verifica se o resultado retornado
     * pelo back end é true ou false. Se é retornado true, mudamos o
     * valor de uma variável de estado para true, caso seja false mudamos o valor da variável
     * de estado para false. A mudança desses valores afeta se vai ficar habilitado
     * ou desabilitado os botões de upload e de enviar esse upload.
     */
    statusExecucao = () => {
        this.timerStatusExecucao = setInterval(() => {
            axios.get('/specieslink-status-execucao').then(response => {
                if (response.status === 200) {
                    console.log(`->${response.data.result}`)
                    console.log(`x->${response.data.result === 'true'}`)
                    if (response.data.result) {
                        console.log('bbbbaqui')
                        if (this.state.estaMontado) {
                            this.setState({ statusExecucao: true });
                        }
                    } else {
                        console.log('ccccaqui')
                        if (this.state.estaMontado) {
                            this.setState({ statusExecucao: false });
                        }
                    }
                }
            });
        }, 5000);
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
            herbarioVirtual: 'specieslink',
            nomeLog: log,
        };
        axios.get('/specieslink-log', { params }).then(response => {
            if (this.state.estaMontado) {
                this.setState({ saidaLOG: response.data.log });
            }
        });
    }

    onFormSubmit = () => {
        const formData = new FormData();
        formData.append('arquivoSpeciesLink', this.state.arquivo);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/specieslink-executa", formData, config).then(response => {
            if (response.status === 200) {
                if (response.data.result === 'error_file') {
                    this.exibeNotificao('error', 'Falha', 'O arquivo não é o esperado.');
                } else if (response.data.result === 'failed') {
                    this.exibeNotificao('error', 'Falha', 'Atualização já está ocorrendo.');
                } else {
                    if (this.state.estaMontado) {
                        this.setState({ statusExecucao: true });
                    }
                    this.exibeNotificao('success', 'Sucesso', 'Atualização iniciará em breve.');
                }
            }
        });
    }

    /**
     * A função carregaArquivo, ela carrega o arquivo que foi enviado pelo usuário,
     * esse carregamento é atribuído a uma variável de estado chamada arquivo que 
     * foi recebida pelo parâmetro.
     * @param arquivoUpado, é o arquivo que foi submetido pelo usuário.
     */
    carregaArquivo = arquivoUpado => {
        if (this.state.estaMontado) {
            this.setState({ arquivo: arquivoUpado[0] });
        }
    }

    removeArquivo = info => {
        if (this.state.estaMontado) {
            this.setState({ arquivo: info[0] });
        }
        return false;
    }

    /**
     * A função exibeNotificao, renderiza no canto superior direito uma mensagem
     * que é passa por parâmetro, e uma descrição dela que também é passada por parâmetro.
     * Ela é utiliza quando conseguiu sucesso ou erro na hora de realizar o upload 
     * do arquivo no speciesLink.
     * @param type, é o tipo de notificação que irá aparecer.
     * @param message, é a mensagem que irá ser renderizada.
     * @param description, é a descrição que será renderizada.
     */
    exibeNotificao = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    /** Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert */
    renderPainelEnviarInformacoes() {
        const { arquivo } = this.state;
        const props = {
            onRemove: (f) => {
                if (this.state.estaMontado) {
                    this.setState({ arquivo: f });
                }
            },
            beforeUpload: (f) => {
                if (this.state.estaMontado) {
                    this.setState({ arquivo: f });
                }
                return false;
            },
            arquivo,
        };
        return (
            <Card title='Buscar informações no speciesLink'>
                <Row gutter={8}>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Upload {...props}>
                            <Button htmlType='submit' className='login-form-button' disabled={this.state.statusExecucao}>
                                <Icon type='upload' /> Insira o arquivo do speciesLink
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
                        <Select placeholder='Selecione o LOG desejado' onChange={this.conteudoLogSelecionado}>
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
            </Card >
        )
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <HeaderServicesComponent title={'SpeciesLink'} />
                <Divider dashed />
                {this.renderPainelEnviarInformacoes()}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosSpeciesLinkScreen);
