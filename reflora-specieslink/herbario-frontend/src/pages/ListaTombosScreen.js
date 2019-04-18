import React, { Component } from 'react';
import {
    Divider, Icon, Modal, Card, Row,
    Col, Form, Select, Input, Button,
    notification, InputNumber, Collapse,
    Tag, Checkbox, Spin
} from 'antd';
import axios from 'axios';
import SimpleTableComponent from '../components/SimpleTableComponent';
import HeaderListComponent from '../components/HeaderListComponent';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import {
    isIdentificador
} from './../helpers/usuarios';


const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

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
            pagina: 1,
            data: [],
            value: [],
            fetching: false,
        }
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
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
                    console.log(error.message)
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

    renderExcluir(id) {
        if (!isIdentificador()) {
            return (
                <div>
                    <Divider type="vertical" />
                    <a href="#" onClick={() => this.mostraMensagemDelete(id)}>
                        <Icon type="delete" style={{ color: "#e30613" }} />
                    </a>
                </div>
            )
        }
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
                {this.renderExcluir(id)}
            </span>
        )
    }

    retornaColetores = coletores => coletores.map(item => (
        item.nome + ", "
    ));

    retornaDataColeta(dia, mes, ano) {
        if (dia == null && mes == null && ano == null) {
            return ""
        } else if (dia != null && mes == null && ano == null) {
            return dia
        } else if (dia == null && mes != null && ano == null) {
            return mes
        } else if (dia == null && mes == null && ano != null) {
            return ano
        } else if (dia != null && mes != null && ano == null) {
            return `${dia}/${mes}`
        } else if (dia != null && mes == null && ano != null) {
            return `${dia}/${ano}`
        } else if (dia == null && mes != null && ano != null) {
            return `${mes}/${ano}`
        } else if (dia != null && mes != null && ano != null) {
            return `${dia}/${mes}/${ano}`
        }
    } s

    formataDadosTombo = tombos => tombos.map(item => ({
        key: item.hcf,
        hcf: item.hcf,
        nomePopular: item.nomes_populares,
        nomeCientifico: item.nome_cientifico,
        data: this.retornaDataColeta(item.data_coleta_dia, item.data_coleta_mes, item.data_coleta_ano),
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
                    console.log(error.message)
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

    handleChangeTombo = (value) => {
        this.props.form.setFieldsValue({
            'exTombos': value
        })
        this.setState({
            value,
            data: [],
            fetching: false,
        });
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
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>HCF:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('numeroHcf')(
                                        <InputNumber
                                            initialValue={17}
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Tipo:</span>
                            </Col>
                            <Col span={24}>
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
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Situação:</span>
                            </Col>
                            <Col span={24}>
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
                        </Col>
                    </Row>


                    <Row gutter={8}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Nome científico:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('nomeCientifico')(
                                        <Input placeholder={"Passiflora edulis"} type="text" />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Nome popular:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('nomePopular')(
                                        <Input placeholder={"Maracujá"} type="text" />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                    </Row>


                    <Row type="flex" justify="end" gutter={4}>
                        <Col xs={24} sm={8} md={6} lg={4} xl={4}>
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
                        <Col xs={24} sm={8} md={6} lg={4} xl={4}>
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

                </Form>
            </Card >
        )
    }

    handleSubmitExport = event => {
        event.preventDefault();

        console.log(event)

        const {
            exDataColeta, exFamilia, exSubfamilia, exGenero, exEspecie,
            exSubespecie, exVariedade, exAutor, exNumTombo, exSeqTombo,
            exCodBarra, exLatitude, exLongitude, exAltitude, exNumColeta,
            exColetores, exHcf, exDe, exAte, exTombos
        } = this.props.form.getFieldsValue();
        let total = 0;
        let exportarSelecionados = [];

        if (exDataColeta) {
            total++;
            exportarSelecionados.push("data_coleta");
        } else if (exFamilia) {
            total++;
            exportarSelecionados.push("familia");
        } else if (exSubfamilia) {
            total++;
            exportarSelecionados.push("subfamilia");
        } else if (exGenero) {
            total++;
            exportarSelecionados.push("genero");
        } else if (exEspecie) {
            total++;
            exportarSelecionados.push("especie");
        } else if (exSubespecie) {
            total++;
            exportarSelecionados.push("subespecie");
        } else if (exVariedade) {
            total++;
            exportarSelecionados.push("variedade");
        } else if (exAutor) {
            total++;
            exportarSelecionados.push("autor");
        } else if (exNumTombo) {
            total++;
            exportarSelecionados.push("num_tombo");
        } else if (exSeqTombo) {
            total++;
            exportarSelecionados.push("seq_tombo");
        } else if (exCodBarra) {
            total++;
            exportarSelecionados.push("cod_barra");
        } else if (exLatitude) {
            total++;
            exportarSelecionados.push("latitude");
        } else if (exLongitude) {
            total++;
            exportarSelecionados.push("longitude");
        } else if (exAltitude) {
            total++;
            exportarSelecionados.push("altitude");
        } else if (exNumColeta) {
            total++;
            exportarSelecionados.push("num_coleta");
        } else if (exColetores) {
            total++;
            exportarSelecionados.push("coletores");
        } else if (exHcf) {
            total++;
            exportarSelecionados.push("hcf");
        }

        if (total > 5 || total === 0) {
            this.openNotificationWithIcon("warning", "Alerta", "Você tem que selecionar de 1 à 5 itens para serem exportados.");
        } else {

            if ((!exDe && !exAte && !exTombos) || ((exDe || exAte) && exTombos)) {
                this.openNotificationWithIcon("warning", "Alerta", "Você tem que selecionar um perído de tombos, ou tombos especificos.");
            } else {
                this.setState({
                    loading: true,
                })
                const params = {
                    de: exDe,
                    ate: exAte,
                    tombos: exTombos,
                    campos: exportarSelecionados,
                }
                axios.get('/tombos/exportar', { params })
                    .then(response => {
                        this.setState({
                            loading: false
                        });

                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")

                    })
                    .catch(err => {
                        this.setState({
                            loading: false
                        });
                        const { response } = err;

                        if (response.status === 400) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo , tombo tente novamente.")
                        }

                        if (response && response.data) {
                            const { error } = response.data;
                            console.log(error.message)
                        }
                    })
            }

        }

    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    fetchUser = (value) => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        console.log("valueeeee")
        console.log(value)
        axios.get(`/tombos/filtrar_numero/${value}`)
            .then(response => {
                if (response.status === 200) {
                    if (fetchId !== this.lastFetchId) { // for fetch callback order
                        return;
                    }
                    const data = response.data.map(item => ({
                        text: `${item.hcf}`,
                        value: item.hcf,
                    }));
                    this.setState({ data, fetching: false });
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message)
                }
            })
    }

    renderExportar(getFieldDecorator) {
        const { fetching, data } = this.state;
        return (
            <Form onSubmit={this.handleSubmitExport}>
                <Collapse accordion>
                    <Panel header="Selecione os campos a serem exportados:" key="1">

                        <Row gutter={8}>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exHcf')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="red">HCF</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exDataColeta')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="magenta">Data da Coleta</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exFamilia')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="red">Família</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exSubfamilia')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="green">Subfamília</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exGenero')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="red">Gênero</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exEspecie')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="blue">Espécie</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exSubespecie')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="blue">Subespécie</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exVariedade')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="red">Variedade</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exAutor')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="orange">Autor</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exNumTombo')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="gold">Nº Tombo</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exSeqTombo')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="yellow">Sequencia do tombo</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exCodBarra')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="gold">Codigo de barra</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exLatitude')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="purple">Latitude</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exLongitude')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="green">Longitude</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exAltitude')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="green">Altitude</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exNumColeta')(
                                        <Checkbox >
                                            {" "}
                                            <Tag color="volcano">Nº Coleta</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                                <FormItem>
                                    {getFieldDecorator('exColetores')(
                                        <Checkbox>
                                            {" "}
                                            <Tag color="geekblue">Coletores</Tag>
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed />
                        <Row gutter={8}>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Col span={24}>
                                    <span>A partir de:</span>
                                </Col>
                                <Col span={24}>
                                    <FormItem>
                                        {getFieldDecorator('exDe')(
                                            <InputNumber
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Col span={24}>
                                    <span>Até:</span>
                                </Col>
                                <Col span={24}>
                                    <FormItem>
                                        {getFieldDecorator('exAte')(
                                            <InputNumber
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Row>
                        <Row gutter={8} type="flex" justify="center">
                            <span>OU</span>
                        </Row>
                        <Row gutter={8} style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Col span={24}>
                                    <span>Numeros dos tombos a serem exportados:</span>
                                </Col>
                                <Col span={24}>
                                    <FormItem>
                                        {getFieldDecorator('exTombos')(
                                            <Select
                                                mode="multiple"
                                                labelInValue
                                                placeholder=""
                                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                                filterOption={false}
                                                onSearch={this.fetchUser}
                                                onChange={this.handleChangeTombo}
                                                style={{ width: '100%' }}
                                            >
                                                {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Row>
                        <Divider dashed />
                        <Row gutter={8} type="flex" justify="end">
                            <Button
                                type="primary"
                                icon="export"
                                htmlType="submit"
                                style={{ backgroundColor: "#FF7F00", borderColor: "#FF7F00" }}
                            >
                                Exportar
                                    </Button>
                        </Row>
                    </Panel>
                </Collapse>

            </Form >
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
                {this.renderExportar(getFieldDecorator)}
            </div>
        );
    }
}
export default Form.create()(ListaTombosScreen);
