import React, { Component } from 'react';
import { Divider, Icon, Modal, Card, Row, Col, Form, Select, Input, Button, notification, InputNumber } from 'antd';
import axios from 'axios';
import SimpleTableComponent from '../components/SimpleTableComponent';
import ExportarComponent from '../components/ExportarComponent';
import HeaderListComponent from '../components/HeaderListComponent';
import { Link } from 'react-router-dom';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

const columns = [
    {
        title: "HCF",
        type: "number",
        key: "hcf"
    },
    {
        title: "Nome Popular",
        type: "text",
        key: "nomePopular"
    },
    {
        title: "Nome Cientifico",
        type: "text",
        key: "nomeCientifico"
    },
    {
        title: "Data Coleta",
        type: "text",
        key: "data"
    },
    {
        title: "Coletor",
        type: "text",
        key: "coletor"
    },
    {
        title: "Ação",
        key: "acao"
    }
];

class ListaTombosScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tombos: [],
            metadados: {},
            loading: true,
            pagina: 1
        }
    }

    requisitaExclusao(id) {
        this.setState({
            loading: true
        })
        axios.delete(`/tombos/${id}`)
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 204) {
                    this.requisitaListaTombos(this.state.valores, this.state.pagina)
                    this.notificacao('success', 'Excluir tombo', 'O tombo foi excluído com sucesso.')
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao excluir o tombo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
    }

    notificacao = (type, titulo, descricao) => {
        notification[type]({
            message: titulo,
            description: descricao,
        });
    };

    mostraMensagemDelete(id) {
        const self = this;
        confirm({
            title: 'Você tem certeza que deseja excluir este tombo?',
            content: 'Ao clicar em SIM, o tombo será excluído.',
            okText: 'SIM',
            okType: 'danger',
            cancelText: 'NÃO',
            onOk() {
                self.requisitaExclusao(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentDidMount() {
        this.requisitaListaTombos({}, this.state.pagina);
    }

    gerarAcao(id) {
        return (
            <span>
                <Link to={`/tombos/detalhes/${id}`}>
                    <Icon type="search" />
                </Link>
                <Divider type="vertical" />
                <Link to={`/tombos/${id}`}>
                    <Icon type="edit" style={{ color: "#FFCC00" }} />
                </Link>
                <Divider type="vertical" />
                <a href="#" onClick={() => this.mostraMensagemDelete(id)}>
                    <Icon type="delete" style={{ color: "#e30613" }} />
                </a>
            </span>
        )
    }

    retornaColetores = coletores => coletores.map(item => (
        item.nome + ", "
    ));

    formataDadosTombo = tombos => tombos.map(item => ({
        key: item.hcf,
        hcf: item.hcf,
        nomePopular: item.nomes_populares,
        nomeCientifico: item.nome_cientifico,
        data: item.data_coleta_dia + '/' + item.data_coleta_mes + '/' + item.data_coleta_ano,
        coletor: this.retornaColetores(item.coletores),
        acao: this.gerarAcao(item.hcf),
    }));

    requisitaListaTombos = (valores, pg) => {
        this.setState({
            loading: true
        });
        let params = {
            pagina: pg
        }

        if (valores !== undefined) {
            const { nomeCientifico, numeroHcf, tipo, nomePopular, situacao } = valores;

            if (nomeCientifico) {
                params.nome_cientifico = nomeCientifico;
            }
            if (numeroHcf) {
                params.hcf = numeroHcf;
            }
            if (tipo && tipo !== -1) {
                params.tipo = tipo;
            }
            if (nomePopular) {
                params.nome_popular = nomePopular;
            }
            if (situacao && situacao !== -1) {
                params.situacao = situacao;
            }
        }
        axios.get('/tombos', { params })
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 200) {
                    const { data } = response;
                    this.setState({
                        tombos: this.formataDadosTombo(data.tombos),
                        metadados: data.metadados
                    });
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar os tombos, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    handleSubmit = (err, valores) => {
        if (!err) {
            this.setState({
                valores: valores,
                loading: true
            })
            this.requisitaListaTombos(valores, this.state.pagina);
        }
    }

    onSubmit = event => {
        event.preventDefault();
        this.props.form.validateFields(this.handleSubmit);
    };

    renderPainelBusca(getFieldDecorator) {
        return (
            <Card title="Buscar Tombo">
                <Form onSubmit={this.onSubmit}>
                    <Row gutter={8}>
                        <Col span={8}>
                            <span>HCF:</span>
                        </Col>
                        <Col span={8}>
                            <span>Tipo:</span>
                        </Col>
                        <Col span={8}>
                            <span>Situação:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('numeroHcf')(
                                    <InputNumber
                                        initialValue={17}
                                        style={{ width: "100%" }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('tipo')(
                                    <Select initialValue="2">
                                        <Option value="-1">Selecione</Option>
                                        <Option value="1">Parátipo</Option>
                                        <Option value="2">Isótipo</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('situacao')(
                                    <Select initialValue="2">
                                        <Option value="-1">Selecione</Option>
                                        <Option value="regular">Regular</Option>
                                        <Option value="permutado">Permutado</Option>
                                        <Option value="emprestado">Emprestado</Option>
                                        <Option value="doado">Doado</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={16}>
                            <span>Nome científico:</span>
                        </Col>
                        <Col span={8}>
                            <span>Nome popular:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={16}>
                            <FormItem>
                                {getFieldDecorator('nomeCientifico')(
                                    <Input placeholder={"Passiflora edulis"} type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('nomePopular')(
                                    <Input placeholder={"Maracujá"} type="text" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Row type="flex" justify="end">
                                <Col span={4} style={{ marginRight: '10px' }}>
                                    <FormItem>
                                        <Button
                                            onClick={() => {
                                                this.props.form.resetFields();
                                                this.setState({
                                                    pagina: 1,
                                                    valores: {},
                                                    metadados: {},
                                                    usuarios: []
                                                })
                                                this.requisitaListaTombos({}, 1);
                                            }}
                                            className="login-form-button"
                                        >
                                            Limpar
									</Button>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="login-form-button"
                                        >
                                            Pesquisar
									</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Card>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <HeaderListComponent title={"Tombos"} link={"/tombos/novo"} />
                <Divider dashed />
                {this.renderPainelBusca(getFieldDecorator)}
                <Divider dashed />
                <SimpleTableComponent
                    columns={columns}
                    data={this.state.tombos}
                    metadados={this.state.metadados}
                    loading={this.state.loading}
                    changePage={(pg) => {
                        this.setState({
                            pagina: pg,
                            loading: true
                        })
                        this.requisitaListaTombos(this.state.valores, pg);
                    }}
                />
                <Divider dashed />
                <ExportarComponent />
            </div>
        );
    }
}
export default Form.create()(ListaTombosScreen);
