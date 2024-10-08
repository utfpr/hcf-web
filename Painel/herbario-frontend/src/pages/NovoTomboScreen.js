import React, { Component } from 'react';
import {
    Form, Row, Col, Divider, Select, InputNumber,
    Tag, Input, Button, notification, Spin, Modal,
    Radio, Icon, Table, Popover, Tooltip, Upload
} from 'antd';

import axios from 'axios';
import UploadPicturesComponent from '../components/UploadPicturesComponent';
import ModalCadastroComponent from '../components/ModalCadastroComponent';
import ButtonComponent from '../components/ButtonComponent';
import CoordenadaInputText from '../components/CoordenadaInputText';
import tomboParaRequisicao from '../helpers/conversoes/TomboParaRequisicao';
import { isIdentificador } from '../helpers/usuarios';
import { fotosBaseUrl, baseUrl } from '../config/api';
import debounce from 'lodash/debounce';
import SimpleTableComponent from '../components/SimpleTableComponent';
import {Link} from 'react-router-dom';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class NovoTomboScreen extends Component {

    tabelaFotosColunas = [
        {
            title: 'Foto',
            dataIndex: this.props.match.params.tombo_id ? 'caminho_foto' : 'thumbnail',
            render: (caminho_foto, thumbnail) => (
                <img width="120" src={`${fotosBaseUrl}/${this.props.match.params.tombo_id ? caminho_foto : thumbnail}`} />
            ),
        },
        {
            title: 'Codigo de Barras',
            dataIndex: 'codigo_barra',
            render: codigo_barra => (
            <div width="120">{codigo_barra}</div>
            ),
        },
        {
            title: 'Ação',
            dataIndex: 'acao',
            render: (text, record, index) => (
                <Row>
                    <Tooltip placement="top" title={"Excluir"}>

                        <Col span={6} >
                            <a href="#" onClick={(e) => { e.preventDefault(); this.mostraMensagemDeleteCod(record, index) }}>
                                <Icon type="delete" style={{ color: "#e30613" }} />
                            </a>
                        </Col>
                    </Tooltip>
                    {/* <Col span={6}>
                        <Popover
                            onVisibleChange = {() => {
                                this.setState({
                                    codigoBarras: record.codigo_barra
                                })
                            }}
                            content={
                            <Row span={10}>
                                <Row>
                                    <Col >
                                        <text><strong>código de barras:</strong></text>
                                    </Col>
                                    <Col >
                                        <Input
                                            value = {this.state.codigoBarras}
                                            onChange = {(e) => {
                                                this.setState({codigoBarras: e.target.value})
                                            }}
                                            placeholder="digite o novo código de barras aqui"
                                        />
                                    </Col>
                                </Row>
                                <Row type="flex" justify="end">
                                    <Button type = "primary" onClick = {() => {this.submitCodBar(record, index)}}>alterar</Button>
                                </Row>
                            </Row>     
                            }
                            title="Alterar código de barras"
                            trigger="click"
                        >
                            <Icon type="barcode" size="large" style={{ color: "black" }} />
                        </Popover>
                    </Col> */}
                    <Col span={6}>
                        <Tooltip placement="top" title={"editar imagem"}>
                            <Upload
                                multiple
                                {...this.props}
                                
                                beforeUpload={(foto) => {
                                    this.atualizarFotoTombo(foto, record, index);
                                }}
                            > 
                                <Tooltip placement="top" title={"editar imagem"}>
                                    <Icon type="edit"
                                            size="large"
                                            style={{ color: "#FFCC00" }} />
                                </Tooltip>
                            </Upload>
                            
                        </Tooltip>
                    </Col>
                </Row>
            ),
        },
    ]

    constructor(props) {
        super(props);
        this.state = {
            fetchingColetores: false,
            fetchingIdentificadores: false,
            valoresColetores: [],
            search: {
                subfamilia: '',
                genero: '',
                especie: '',
                subespecie: '',
                variedade: ''
            },
            visibleModal: false,
            loadingModal: false,
            formulario: {
                desc: '',
            },
            formComAutor: false,
            loading: false,
            herbarios: [],
            tipos: [],
            paises: [],
            estados: [],
            cidades: [],
            familias: [],
            subfamilias: [],
            autores: [],
            generos: [],
            especies: [],
            subespecies: [],
            variedades: [],
            solos: [],
            relevos: [],
            vegetacoes: [],
            fases: [],
            identificadores: [],
            coletores: [],
            fotosExsicata: [],
            fotosEmVivo: [],
            numeroHcf: 0,
            herbarioInicial: '',
            localidadeInicial: '',
            tipoInicial: '',
            paisInicial: '',
            estadoInicial: '',
            cidadeInicial: '',
            familiaInicial: '',
            subfamiliaInicial: '',
            generoInicial: '',
            especieInicial: '',
            subespecieInicial: '',
            variedadeInicial: '',
            soloInicial: '',
            relevoInicial: '',
            vegetacaoInicial: '',
            faseInicial: '',
            identificadorInicial: '',
            coletoresInicial: '',
            colecaoInicial: '',
            complementoInicial: '',
            latGraus: '',
            latMinutos: '',
            latSegundos: '',
            longGraus: '',
            longMinutos: '',
            longSegundos: '',
            fotosTeste: [],
            codigoBarras: "",
            dadosFormulario: {},
            editing: Boolean(this.props.match.params.tombo_id)
        };
    }

    mostraMensagemDeleteCod(foto, indice) {
        const self = this;
        confirm({
            title: 'Você tem certeza que deseja excluir este campo?',
            content: 'Ao clicar em SIM, o campo será excluído.',
            okText: 'SIM',
            okType: 'danger',
            cancelText: 'NÃO',
            onOk() {
                self.excluirFotoTombo(foto, indice);
            },
            onCancel() {
            },
        });
    }

    excluirFotoTombo = (foto, indice) => {

        var codBarras = foto.codigo_barra;

        console.log("meu json :", codBarras);
        axios.delete(`/api/tombos/codBarras/${codBarras}`)
            .then(response => {
                this.setState({
                    loading: false
                });
                if (response.status === 204) {
                    this.openNotificationWithIcon("success", "Sucesso", "O codigo de barras foi deletado com sucesso.")
                    window.location.reload();
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;

                if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao deletar o codigo de barras, tente novamente.")
                }
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    atualizarFotoTombo = (foto, record) => {

        const tombo_codBarr = record.codigo_barra;
        const form = new FormData();
        form.append('imagem', foto);
        form.append('tombo_codBarr', tombo_codBarr);

        return axios.post('/api/uploads/atualizaImagem', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(response => {
            if (response.status === 204) {
                this.openNotificationWithIcon("success", "Sucesso", "A foto foi alterada com sucesso.")
                window.location.reload();
            }
            window.location.reload();
        }).catch(response => {
            if (response.status === 400) {
                this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
            } else {
                this.openNotificationWithIcon("error", "Falha", "Houve um problema ao alterar a foto, tente novamente.")
            }
            if (response && response.data) {
                const { error } = response.data;
                console.log(error.message);
            } else {
                throw response;
            }
            window.location.reload();
        });

    }

    criaCodigoBarrasSemFotos = (emVivo) => {
        const form = new FormData();
        form.append('tombo_hcf', this.state.numeroHcf);
        form.append('em_vivo', emVivo);

        return axios.post('/api/uploads/criaCodigoSemFoto', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then(response => {
            if (response.status === 204) {
                this.openNotificationWithIcon("success", "Sucesso", "O codigo foi criado com sucesso.")
                window.location.reload();
            }
            window.location.reload();
        }).catch(response => {
            if (response.status === 400) {
                this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
            } else {
                this.openNotificationWithIcon("error", "Falha", "Houve um problema ao criar o codigo, tente novamente.")
            }
            if (response && response.data) {
                const { error } = response.data;
                console.log(error.message);
            } else {
                throw response;
            }
            window.location.reload();
        });
    }

    // submitCodBar = (foto, indice) => {
    //     var json = {};

    //     json.codBarra = foto.codigo_barra;

    //     json.novoCod = {};

    //     json.novoCod.codBarra = this.state.codigoBarras;
    //     json.novoCod.numBarra = foto.num_barra;

    //     axios.put('/api/tombos/codBarras', json)
    //         .then(response => {
    //             this.setState({
    //                 loading: false
    //             });
    //             if (response.status === 204) {
    //                 this.openNotificationWithIcon("success", "Sucesso", "O codigo de barras foi alterado com sucesso.")
    //                 window.location.reload();
    //             }
    //         })
    //         .catch(err => {
    //             this.setState({
    //                 loading: false
    //             });
    //             const { response } = err;

    //             if (response.status === 400) {
    //                 this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
    //             } else {
    //                 this.openNotificationWithIcon("error", "Falha", "Houve um problema ao alterar o codigo de barras, tente novamente.")
    //             }
    //             if (response && response.data) {
    //                 const { error } = response.data;
    //                 console.log(error.message);
    //             } else {
    //                 throw err;
    //             }
    //         })
    //         .catch(this.catchRequestError);
    // }

    openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    componentDidMount() {
        this.requisitaDadosFormulario();
        this.setState({
            loading: true
        });
        
    }

    requisitaDadosEdicao = (id) => {
        axios.get(`/api/tombos/${id}`)
            .then(response => {
                if (response.status === 200) {
                    let data = response.data
                    this.setState({
                        ...this.state,
                        loading: false,
                        ...data
                    });
                    this.insereDadosFormulario(data)
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar os dados do tombo, tente novamente.")
                }

            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message)
                }
            })
            .catch(this.catchRequestError);
    }
    
    insereDadosFormulario(dados) {
        this.setState({dadosFormulario: dados});
        let insereState = {
            estados: dados.estados,
            cidades: dados.cidades,
            subfamilias: dados.subfamilias,
            generos: dados.generos,
            especies: dados.especies,
            subespecies: dados.subespecies,
            variedades: dados.variedades,
        };
        if (dados.coletores) {
            const colet = dados.coletores.map(item => ({
                key: item.id,
                label: item.nome
            }));

            this.props.form.setFields({
                coletores: {
                    value: colet
                }
            })
        }
        if (dados.localizacao) {
            console.log("minha localizacao\n\n\n\n\\n", dados.localizacao)
            insereState = {
                ...insereState,
                latGraus: dados.localizacao.lat_grau,
                latMinutos: dados.localizacao.latitude_min,
                latSegundos: dados.localizacao.latitude_sec,
            }

            insereState = {
                ...insereState,
                longGraus: dados.localizacao.long_graus,
                longMinutos: dados.localizacao.long_min,
                longSegundos: dados.localizacao.latitude_sec,
            }
        }

        if (dados.retorno.identificadores) {
            this.setState({
                insereState,
                identificadores: dados.retorno.identificadores,
            })
        }
        this.props.form.setFields({
            altitude: {
                value: dados.localizacao.altitude,
            },
            dataColetaAno: {
                value: dados.data_coleta_ano,
            },
            dataColetaDia: {
                value: dados.data_coleta_dia,
            },
            dataColetaMes: {
                value: dados.data_coleta_mes,
            },
            dataIdentAno: {
                value: dados.data_identificacao_ano,
            },
            dataIdentDia: {
                value: dados.data_identificacao_dia,
            },
            dataIdentMes: {
                value: dados.data_identificacao_mes,
            },
            latitude: {
                value: dados.localizacao.latitude,
            },
            longitude: {
                value: dados.localizacao.longitude,
            },
            nomePopular: {
                value: dados.retorno.nomes_populares,
            },
            numColeta: {
                value: dados.numero_coleta,
            },
            observacoesColecaoAnexa: {
                value: dados.colecao_anexa.observacao,
            },
            observacoesTombo: {
                value: dados.observacao,
            },
            relevoDescricao: {
                value: dados.local_coleta.descricao,
            },
            complemento: {
                value: dados.localizacao.complemento,
            },
            autorEspecie: {
                value: dados.complemento,
            }  
        });

    }

    requisitaDadosFormulario = () => {
        axios.get('/api/tombos/dados')
            .then(response => {
                if (response.status === 200) {
                    this.requisitaNumeroHcf();
                    let dados = response.data;
                    this.setState({
                        ...this.state,
                        ...dados
                    })
                    if (this.props.match.params.tombo_id) {
                        this.requisitaDadosEdicao(this.props.match.params.tombo_id);
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                } else {
                    this.setState({
                        loading: false
                    })
                    this.openNotification("error", "Falha", "Houve um problema ao buscar os dados do usuário, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    // throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    mostraMensagemVerificaPendencia() {
        const self = this;
        confirm({
            title: 'Pendência',
            content: 'Este tombo possui pendências não resolvidas, deseja continuar alterando?',
            okText: 'SIM',
            okType: 'danger',
            cancelText: 'NÃO',
            onOk() {
            },
            onCancel() {
                window.history.go(-1);
            },
        });
    }

    verificaPendencias = (tombo_id) => {
        axios.get(`/api/pendencias/TomboId/${tombo_id}`)
            .then(response => {
                this.setState({
                    loading: false
                })
                if(response.data !== null){
                    this.mostraMensagemVerificaPendencia()
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaNumeroHcf = () => {
        axios.get('/api/tombos/filtrar_ultimo_numero')
            .then(response => {
                if (response.status === 200) {
                    if(this.props.match.params.tombo_id){
                        this.setState({numeroHcf: this.props.match.params.tombo_id});
                        this.props.form.setFields({
                            numeroTombo: {
                                value: this.props.match.params.tombo_id,
                            },
                        });
                        const date = new Date(response.data.data_tombo);
                        this.props.form.setFields({
                            dataTombo: {
                                value: date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),
                            },
                        });
                        this.requisitaCodigoBarras();
                        this.verificaPendencias(this.props.match.params.tombo_id);
                    } else {
                        this.setState({numeroHcf: response.data.hcf + 1});
                        this.props.form.setFields({
                            numeroTombo: {
                                value: response.data.hcf + 1,
                            },
                        });
                        const date = new Date();
                        this.props.form.setFields({
                            dataTombo: {
                                value: date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),
                            },
                        });
                    }
                } else {
                    this.openNotification("error", "Falha", "Houve um problema ao buscar o numero de coletor sugerido, tente novamente.")
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaNumeroColetor = () => {
        axios.get('/api/numero-coletores')
            .then(response => {
                if (response.status === 200) {
                    this.setState(response.data)
                    this.props.form.setFields({
                        numeroColetor: {
                            value: response.data.numero,
                        },
                    });

                } else {
                    this.openNotification("error", "Falha", "Houve um problema ao buscar o numero de coletor sugerido, tente novamente.")
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaCodigoBarras = () => {
        axios.get(`/api/tombos/codBarras/${this.props.match.params.tombo_id}`)
            .then(response => {
                if (response.status === 200) {
                    const dados = response.data;
                    this.setState({
                        fotosTeste: dados
                    })
                } else {
                    this.openNotification("error", "Falha", "Houve um erro ao buscar os codigos de barras, tente novamente.")
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    handleSubmit = e => {
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!(this.props.form.getFieldsValue().dataColetaDia || this.props.form.getFieldsValue().dataColetaMes || this.props.form.getFieldsValue().dataColetaAno)) {
                this.openNotificationWithIcon("warning", "Falha", "É necessário pelo menos o dia ou o mês ou o ano da data de coleta para o cadastro.")
                return false;
            }
            if (err != null) {
                console.log(err)
                this.openNotificationWithIcon("warning", "Falha", "Preencha todos os dados requiridos.")
            } else {
                const { editing } = this.state;
                const valoresFormatados = this.formatValues(values);
                if(editing){
                    this.requisitaAtualizacaoTombo(values);
                }else{
                    this.requisitaCadastroTombo(valoresFormatados);
                }
                this.setState({
                    loading: true
                })
            }
        });
    };

    handleSubmitIdentificador = e => {
        e.preventDefault();
        const { familia, subfamilia, genero, especie, subespecie, variedade } = this.props.form.getFieldsValue();
        if ((familia || subfamilia || genero || especie || subespecie || variedade)) {
            this.setState({
                loading: true
            });
            var json = {};
            if (familia) {
                json.familia_id = familia;
            }
            if (subfamilia) {
                json.subfamilia_id = subfamilia;
            }
            if (genero) {
                json.genero_id = genero;
            }
            if (especie) {
                json.especie_id = especie;
            }
            if (subespecie) {
                json.subespecie_id = subespecie;
            }
            if (variedade) {
                json.variedade_id = variedade;
            }

            axios.put(`/api/tombos/${this.props.match.params.tombo_id}`, json)
            .then(response => {
                this.setState({
                    loading: false
                });
                if (response.status === 200) {
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    this.props.history.push("/tombos/" + this.state.numeroHcf);
                }
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;

                if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao alterar o tombo tente novamente.")
                }
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
        }
    }

    formatValues(values) {
        const {
            altitude, autorEspecie, autorVariedade, autoresSubespecie, cidade, coletores, complemento,
            dataColetaAno, dataColetaDia, dataColetaMes, dataIdentAno, dataIdentDia, dataIdentMes,
            especie, familia, fases, genero, identificador, latitude, localidadeCor, longitude,
            nomePopular, numColeta, observacoesColecaoAnexa, observacoesTombo, relevo, solo,
            subespecie, subfamilia, tipo, tipoColecaoAnexa, variedade, vegetacao, entidade, relevoDescricao,
        } = values;


        let json = {}

        if (nomePopular !== undefined) json.principal = { nome_popular: nomePopular };
        json.principal = { ...json.principal, entidade_id: entidade };
        json.principal.numero_coleta = numColeta;
        if (dataColetaDia !== undefined) json.principal.data_coleta = { dia: dataColetaDia };
        if (dataColetaMes !== undefined) json.principal.data_coleta = { ...json.principal.data_coleta, mes: dataColetaMes };
        if (dataColetaAno !== undefined) json.principal.data_coleta = { ...json.principal.data_coleta, ano: dataColetaAno };
        if (tipo !== "") json.principal.tipo_id = tipo;
        json.principal.cor = localidadeCor;
        if (familia !== undefined && familia !== "") json.taxonomia = { ...json.taxonomia, familia_id: familia };
        if (genero !== undefined && genero !== "") json.taxonomia = { ...json.taxonomia, genero_id: genero };
        if (subfamilia !== undefined && subfamilia !== "") json.taxonomia = { ...json.taxonomia, sub_familia_id: subfamilia };
        if (especie !== undefined && especie !== "") json.taxonomia = { ...json.taxonomia, especie_id: especie };
        if (variedade !== undefined && variedade !== "") json.taxonomia = { ...json.taxonomia, variedade_id: variedade };
        if (subespecie !== undefined && subespecie !== "") json.taxonomia = { ...json.taxonomia, sub_especie_id: subespecie };
        if (latitude !== undefined) json.localidade = { ...json.localidade, latitude: latitude };
        if (longitude !== undefined) json.localidade = { ...json.localidade, longitude: longitude };
        if (altitude !== undefined) json.localidade = { ...json.localidade, altitude: altitude };
        json.localidade = { ...json.localidade, cidade_id: cidade };
        if (complemento !== undefined && complemento !== ""){
            json.localidade = { ...json.localidade, complemento };
        }
        if (solo !== undefined && solo !== "") json.paisagem = { ...json.paisagem, solo_id: solo };
        if (relevoDescricao !== undefined && relevoDescricao !== "") json.paisagem = { ...json.paisagem, descricao: relevoDescricao };
        if (relevo !== undefined && relevo !== "") json.paisagem = { ...json.paisagem, relevo_id: relevo };
        if (vegetacao !== undefined && vegetacao !== "") json.paisagem = { ...json.paisagem, vegetacao_id: vegetacao };
        if (fases !== undefined && fases !== "") json.paisagem = { ...json.paisagem, fase_sucessional_id: fases };
        if (identificador !== undefined && identificador !== "") json.identificacao = { identificador_id: identificador };
        if (dataIdentDia !== undefined && dataColetaDia !== "") {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    dia: dataIdentDia
                }
            }
        }
        if (dataIdentMes !== undefined && dataIdentMes !== "") {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    mes: dataIdentMes
                }
            }
        }
        if (dataIdentAno !== undefined && dataIdentAno !== "") {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    ano: dataIdentAno
                }
            }
        }
        const converterInteiroColetores = () => coletores.map(item => parseInt(item.key));
        json.coletores = converterInteiroColetores()
        if (tipoColecaoAnexa !== undefined && tipoColecaoAnexa != "") json.colecoes_anexas = { tipo: tipoColecaoAnexa };
        if (observacoesColecaoAnexa !== undefined && observacoesColecaoAnexa !== "") json.colecoes_anexas = { ...json.colecoes_anexas, observacoes: observacoesColecaoAnexa };
        if (observacoesTombo !== undefined && observacoesTombo !== "") json.observacoes = observacoesTombo;
        if (autorEspecie !== undefined && autorEspecie !== "") json.autores = { especie: autorEspecie };
        if (autoresSubespecie !== undefined && autoresSubespecie !== "") json.autores = { ...json.autores, subespecie: autoresSubespecie };
        if (autorVariedade !== undefined && autorVariedade !== "") json.autores = { ...json.autores, variedade: autorVariedade };

        return json;
    }

    requisitaCadastroTombo(json) {
        
        axios.post('/api/tombos', { json })
            .then(response => {
                if (response.status === 201) {
                    const tombo = response.data
                    const criaRequisicaoFoto = (hcf, emVivo, foto) => {
                        const form = new FormData();
                        form.append('imagem', foto);
                        form.append('tombo_hcf', this.state.numeroHcf);
                        form.append('em_vivo', emVivo);

                        return axios.post('/api/uploads', form, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                        });
                    };
                    const criaFuncaoMap = (hcf, emVivo) => foto => criaRequisicaoFoto(hcf, emVivo, foto);

                    const { fotosEmVivo, fotosExsicata } = this.state;

                    const promises = [
                        ...fotosEmVivo.map(criaFuncaoMap(tombo.hcf, true)),
                        ...fotosExsicata.map(criaFuncaoMap(tombo.hcf, false)),
                    ];

                    return Promise.all(promises);

                }

            })
            .then(response => {
                this.setState({
                    loading: false
                });

                this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                window.history.go(-1)

            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;

                if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo tombo tente novamente.")
                }
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaAtualizacaoTombo(values){

        const {
            altitude, autorEspecie, autorVariedade, autoresSubespecie, cidade, coletores, complemento,
            dataColetaAno, dataColetaDia, dataColetaMes, dataIdentAno, dataIdentDia, dataIdentMes,
            especie, familia, fases, genero, identificador, latitude, localidadeCor, longitude,
            nomePopular, numColeta, observacoesColecaoAnexa, observacoesTombo, relevo, solo,
            subespecie, subfamilia, tipo, tipoColecaoAnexa, variedade, vegetacao, entidade, relevoDescricao,
        } = values;

        let json = {}
        const dados = this.state.dadosFormulario;
        console.log("dados do formulariooooo\n\n", this.state.dadosFormulario, dados.retorno.nomes_populares);
        
        json.principal = {};

        if (nomePopular !== undefined && nomePopular !== dados.retorno.nomes_populares) json.principal = { nome_popular: nomePopular };
        
        if (entidade !== undefined && entidade !== dados.herbarioInicial.toString()) json.principal = { ...json.principal, entidade_id: entidade };
        if (numColeta !== undefined && numColeta !== dados.numero_coleta) json.principal.numero_coleta = numColeta;
        
        if (dataColetaDia !== undefined && dataColetaDia !== dados.data_coleta_dia) json.principal.data_coleta = { dia: dataColetaDia };
        if (dataColetaMes !== undefined && dataColetaMes !== dados.data_coleta_mes) json.principal.data_coleta = { ...json.principal.data_coleta, mes: dataColetaMes };
        if (dataColetaAno !== undefined && dataColetaAno !== dados.data_coleta_ano) json.principal.data_coleta = { ...json.principal.data_coleta, ano: dataColetaAno };
        if (tipo !== "" && tipo !== dados.tipoInicial.toString()) json.principal.tipo_id = tipo;
        
        if (localidadeCor !== "" && localidadeCor !== dados.localidadeInicial) json.principal.cor = localidadeCor;

        json.taxonomia = {};

        if (familia !== undefined && familia !== "" && familia !== dados.familiaInicial.toString()) json.taxonomia = { ...json.taxonomia, familia_id: familia, genero_id: null, sub_familia_id: null, especie_id: null, variedade_id: null, sub_especie_id: null };
        if (genero !== undefined && genero !== "" && genero !== dados.generoInicial.toString()) json.taxonomia = { ...json.taxonomia, genero_id: genero, especie_id: null, sub_especie_id: null, variedade_id: null};
        if (subfamilia !== undefined && subfamilia !== "" && subfamilia !== dados.subfamiliaInicial.toString()) json.taxonomia = { ...json.taxonomia, sub_familia_id: subfamilia };
        if (especie !== undefined && especie !== "" && especie !== dados.especieInicial.toString()) json.taxonomia = { ...json.taxonomia, especie_id: especie, sub_especie_id: null, variedade_id: null };
        if (variedade !== undefined && variedade !== "" && variedade !== dados.variedadeInicial.toString()) json.taxonomia = { ...json.taxonomia, variedade_id: variedade };
        if (subespecie !== undefined && subespecie !== "" && subespecie !== dados.subespecieInicial.toString()) json.taxonomia = { ...json.taxonomia, sub_especie_id: subespecie };

        json.localidade = {};

        if (latitude !== undefined && latitude !== dados.localizacao.latitude_graus) json.localidade = { ...json.localidade, latitude: latitude };
        if (longitude !== undefined && longitude !== dados.localizacao.longitude_graus) json.localidade = { ...json.localidade, longitude: longitude };
        if (altitude !== undefined && altitude !== dados.localizacao.altitude) json.localidade = { ...json.localidade, altitude: altitude };
        if (cidade !== undefined && cidade !== dados.cidadeInicial.toString()) json.localidade = { ...json.localidade, cidade_id: cidade };
        if (complemento !== undefined && complemento !== "" && complemento !== dados.localizacao.complemento) json.localidade = { ...json.localidade, complemento };

        json.paisagem = {};

        if (solo !== undefined && solo !== "" && solo !== dados.soloInicial.toString()) json.paisagem = { ...json.paisagem, solo_id: solo };
        if (relevoDescricao !== undefined && relevoDescricao !== "" && relevoDescricao !== dados.local_coleta.descricao) json.paisagem = { ...json.paisagem, descricao: relevoDescricao };
        if (relevo !== undefined && relevo !== "" && relevo !== dados.relevoInicial.toString()) json.paisagem = { ...json.paisagem, relevo_id: relevo };
        if (vegetacao !== undefined && vegetacao !== "" && vegetacao !== dados.vegetacaoInicial.toString()) json.paisagem = { ...json.paisagem, vegetacao_id: vegetacao };
        if (fases !== undefined && fases !== "" && fases !== dados.faseInicial.toString()) json.paisagem = { ...json.paisagem, fase_sucessional_id: fases };

        json.identificacao = {};

        if (identificador !== undefined && identificador !== "" && identificador !== dados.identificadorInicial) json.identificacao = { identificador_id: identificador };
        if (dataIdentDia !== undefined && dataIdentDia !== "" && dataIdentDia !== dados.data_identificacao_dia) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    dia: dataIdentDia
                }
            }
        }
        if (dataIdentMes !== undefined && dataIdentMes !== "" && dataIdentMes !== dados.data_identificacao_mes) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    mes: dataIdentMes
                }
            }
        }
        if (dataIdentAno !== undefined && dataIdentAno !== "" && dataIdentAno !== dados.data_identificacao_ano) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    ano: dataIdentAno
                }
            }
        }

        const converterInteiroColetores = () => coletores.map(item => parseInt(item.key));
        console.log("estes sao meus coletores",  dados.coletoresInicial.map(item => parseInt(item.key)));
        if (converterInteiroColetores().toString() !== dados.coletoresInicial.map(item => parseInt(item.key)).toString()) json.coletores = converterInteiroColetores()

        json.colecoes_anexas = {};
        
        if (tipoColecaoAnexa !== undefined && tipoColecaoAnexa !== "" && tipoColecaoAnexa !== dados.colecao_anexa.tipo) json.colecoes_anexas = { tipo: tipoColecaoAnexa };
        if (observacoesColecaoAnexa !== undefined && observacoesColecaoAnexa !== "" && observacoesColecaoAnexa !== dados.colecao_anexa.observacao) json.colecoes_anexas = { ...json.colecoes_anexas, observacoes: observacoesColecaoAnexa };
        if (observacoesTombo !== undefined && observacoesTombo !== "" && observacoesTombo !== dados.observacao) json.observacoes = observacoesTombo;

        json.autores = {};

        if (autorEspecie !== undefined && autorEspecie !== "") json.autores = { especie: autorEspecie };
        if (autoresSubespecie !== undefined && autoresSubespecie !== "") json.autores = { ...json.autores, subespecie: autoresSubespecie };
        if (autorVariedade !== undefined && autorVariedade !== "") json.autores = { ...json.autores, variedade: autorVariedade };

        console.log("este e o json que a gente querrrrr!!!", json);
        
        const tomboId = this.props.match.params.tombo_id;
        console.log("foi na atualizacao mesmo que chegouuuuuuu!!!!", tomboId);
        axios.put(`/api/tombos/${tomboId}`, { json })
            .then(response => {
                const pendencia = response.data
                console.log("tombo!\n", response);
                if (response.status === 200) {
                    const criaRequisicaoFoto = (hcf, emVivo, foto) => {
                        const form = new FormData();
                        form.append('imagem', foto);
                        form.append('tombo_hcf', this.props.match.params.tombo_id);
                        form.append('em_vivo', emVivo);

                        axios.post('/api/uploads', form, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                        })
                    };

                    const pendencia_id = pendencia.id;
                    axios.post(`/api/pendencias/${pendencia_id}`)
                    .then(response2 => {
                        console.log(response2);
                    });

                    const criaFuncaoMap = (hcf, emVivo) => foto => criaRequisicaoFoto(hcf, emVivo, foto);

                    
                    const { fotosEmVivo, fotosExsicata } = this.state;

                    const promises = [
                        ...fotosEmVivo.map(criaFuncaoMap(pendencia.hcf, true)),
                        ...fotosExsicata.map(criaFuncaoMap(pendencia.hcf, false)),
                    ];

                    return Promise.all(promises);

                }

            })
            .then(response => {
                this.setState({
                    loading: false
                });

                this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                window.location.reload();

            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;

                if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo tombo tente novamente.")
                }
                if (response && response.data) {
                    const { error } = response.data;
                    console.log(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    handleSubmitForm = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    optionEntidades = () => this.state.herbarios.map(item => (
        <Option value={`${item.id}`}>{item.sigla} - {item.nome}</Option>
    ));

    optionTipo = () => this.state.tipos.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionFase = () => this.state.fases.map(item => (
        <Option value={`${item.numero}`}>{item.nome}</Option>
    ));

    optionPais = () => this.state.paises.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionEstado = () => this.state.estados.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionCidade = () => this.state.cidades.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionFamilia = () => this.state.familias.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionSubfamilia = () => this.state.subfamilias.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionGenero = () => this.state.generos.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionEspecie = () => this.state.especies.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionSubespecie = () => this.state.subespecies.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionVariedade = () => this.state.variedades.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionAutores = () => this.state.autores.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionVegetacao = () => this.state.vegetacoes.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionRelevo = () => this.state.relevos.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionSolo = () => this.state.solos.map(item => (
        <Option value={`${item.id}`}>{item.nome}</Option>
    ));

    optionColetores = () => this.state.coletores.map(item => (
        <Option key={`${item.id}`}>{item.nome}</Option>
    ));

    optionIdentificador = () => this.state.identificadores.map(item => (
        <Option key={`${item.id}`}>{item.nome}</Option>
    ));


    requisitaEstados = (id) => {
        axios.get('/api/estados/', {
            params: {
                id
            }
        })
            .then(response => {

                if (response.data && response.status === 200) {
                    this.setState({
                        estados: response.data
                    });

                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar os estados desse país, tente novamente.")
                }

            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaCidades = (id) => {
        axios.get('/api/cidades/', {
            params: {
                id
            }
        })
            .then(response => {

                if (response.data && response.status === 200) {
                    this.setState({
                        cidades: response.data
                    });

                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar as cidades desse estado, tente novamente.")
                }

            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
            duration: 10
        });
    };

    cadastraNovoTipo() {
        this.setState({
            loading: true,
        });
        axios.post('/api/tipos/', {
            nome: this.props.form.getFieldsValue().campo
        })
            .then(response => {
                this.setState({
                    loading: false,
                });
                if (response.status === 204) {
                    this.requisitaTipos();
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo tipo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaTipos = () => {
        this.setState({
            loading: true,
        });
        axios.get('/api/tipos/')
            .then(response => {
                this.setState({
                    loading: false,
                });
                if (response.status === 200) {
                    this.setState({
                        tipos: response.data
                    });
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar os tipos do tombo, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema a listar os tipos, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaFamilia() {
        this.setState({
            loading: true,
        });
        axios.post('/api/familias/', {
            nome: this.props.form.getFieldsValue().campo
        })
            .then(response => {
                this.setState({
                    loading: false,
                });
                if (response.status === 204) {
                    this.requisitaFamilias();
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova familia, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaFamilias = () => {
        this.setState({
            loading: true,
        });
        axios.get('/api/familias/', {
            params: {
                limite: 9999999999,
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                });
                if (response.status === 200) {
                    this.setState({
                        familias: response.data.resultado
                    });
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar familias, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem das familias, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaSubfamilia() {
        if (!this.props.form.getFieldsValue().familia) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma familia para cadastrar uma subfamilia.');
        } else {
            this.setState({
                loading: true,
            });
            axios.post('/api/subfamilias/', {
                nome: this.props.form.getFieldsValue().campo,
                familia_id: this.props.form.getFieldsValue().familia
            })
                .then(response => {
                    this.setState({
                        loading: false,
                    });
                    if (response.status === 204) {
                        this.requisitaSubfamilias(this.props.form.getFieldsValue().familia);
                        this.setState({
                            search: {
                                subfamilia: 'validating'
                            }
                        });
                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    }
                    this.props.form.setFields({
                        campo: {
                            value: '',
                        },
                    });
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    const { response } = err;
                    if (response && response.data) {
                        if (response.status === 400 || response.status === 422) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova subfamilia, tente novamente.")
                        }
                        const { error } = response.data;
                        throw new Error(error.message);
                    } else {
                        throw err;
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaSubfamilias = (id) => {
        // this.setState({
        //     loading: true,
        // });
        axios.get('/api/subfamilias/', {
            params: {
                familia_id: id,
                limite: 999999999,
            }
        })
            .then(response => {
                // this.setState({
                //     loading: false,
                // });
                this.setState({
                    search: {
                        subfamilia: ''
                    }
                })
                if (response.status === 200) {
                    this.setState({
                        subfamilias: response.data.resultado
                    });
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar as subfamilias, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        subfamilia: ''
                    },
                    //loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem de subfamilia, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovoGenero() {
        if (!this.props.form.getFieldsValue().familia) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma familia para cadastrar uma subfamilia.');
        } else {
            this.setState({
                loading: true,
            });
            axios.post('/api/generos/', {
                nome: this.props.form.getFieldsValue().campo,
                familia_id: this.props.form.getFieldsValue().familia
            })
                .then(response => {
                    this.setState({
                        loading: false,
                    });
                    if (response.status === 204) {
                        this.requisitaGeneros(this.props.form.getFieldsValue().familia);
                        this.setState({
                            search: {
                                genero: 'validating'
                            }
                        });
                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    }
                    this.props.form.setFields({
                        campo: {
                            value: '',
                        },
                    });
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    const { response } = err;
                    if (response && response.data) {
                        if (response.status === 400 || response.status === 422) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo genero, tente novamente.")
                        }
                        const { error } = response.data;
                        throw new Error(error.message);
                    } else {
                        throw err;
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaGeneros = (id) => {
        // this.setState({
        //     loading: true,
        // });
        axios.get('/api/generos/', {
            params: {
                familia_id: id,
                limite: 9999999999,
            }
        })
            .then(response => {
                this.setState({
                    search: {
                        genero: ''
                    },
                    //loading: false,
                })
                if (response.status === 200) {
                    this.setState({
                        generos: response.data.resultado
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        genero: ''
                    },
                    //loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem de generos, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaEspecie() {
        if (!this.props.form.getFieldsValue().genero) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione um gênero para cadastrar uma subfamilia.');
        }
        if (!this.props.form.getFieldsValue().familia) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma familia para cadastrar uma subfamilia.');
        } else {
            this.setState({
                loading: true,
            });
            axios.post('/api/especies/', {
                nome: this.props.form.getFieldsValue().campo,
                familia_id: this.props.form.getFieldsValue().familia,
                genero_id: this.props.form.getFieldsValue().genero,
                autor_id: this.props.form.getFieldsValue().autor
            })
                .then(response => {
                    this.setState({
                        loading: false,
                    });
                    if (response.status === 204) {
                        this.requisitaEspecies(this.props.form.getFieldsValue().genero);
                        this.setState({
                            search: {
                                especie: 'validating'
                            }
                        });
                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    }
                    this.props.form.setFields({
                        campo: {
                            value: '',
                        },
                    });
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    const { response } = err;
                    if (response && response.data) {
                        if (response.status === 400 || response.status === 422) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova especie, tente novamente.")
                        }
                        const { error } = response.data;
                        throw new Error(error.message);
                    } else {
                        throw err;
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaEspecies = (id) => {
        // this.setState({
        //     loading: true,
        // });
        axios.get('/api/especies/', {
            params: {
                genero_id: id,
                limite: 9999999999,
            }
        })
            .then(response => {
                this.setState({
                    search: {
                        especie: ''
                    },
                    //loading: false,
                })
                if (response.status === 200) {
                    this.setState({
                        especies: response.data.resultado
                    });
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar as especies, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        especie: ''
                    },
                   // loading: false,
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem de especies, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaSubespecie() {
        if (!this.props.form.getFieldsValue().especie) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma especie para cadastrar uma subespecie.');
        }
        if (!this.props.form.getFieldsValue().genero) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione um gênero para cadastrar uma subespecie.');
        }
        if (!this.props.form.getFieldsValue().familia) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma familia para cadastrar uma subespecie.');
        } else {
            this.setState({
                loading: true,
            });
            axios.post('/api/subespecies/', {
                nome: this.props.form.getFieldsValue().campo,
                familia_id: this.props.form.getFieldsValue().familia,
                genero_id: this.props.form.getFieldsValue().genero,
                especie_id: this.props.form.getFieldsValue().especie,
                autor_id: this.props.form.getFieldsValue().autor
            })
                .then(response => {
                    this.setState({
                        loading: false,
                    });
                    if (response.status === 204) {
                        this.requisitaSubespecies(this.props.form.getFieldsValue().especie);
                        this.setState({
                            search: {
                                subespecie: 'validating'
                            }
                        });
                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    }
                    this.props.form.setFields({
                        campo: {
                            value: '',
                        },
                    });
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    const { response } = err;
                    if (response && response.data) {
                        if (response.status === 400 || response.status === 422) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova subespecie, tente novamente.")
                        }
                        const { error } = response.data;
                        throw new Error(error.message);
                    } else {
                        throw err;
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaSubespecies = (id) => {
        // this.setState({
        //     loading: true,
        // });
        axios.get('/api/subespecies/', {
            params: {
                especie_id: id,
                limite: 999999999,
            }
        })
            .then(response => {
                this.setState({
                    search: {
                        subespecie: ''
                    },
                    //loading: false
                })
                if (response.status === 200) {
                    this.setState({
                        subespecies: response.data.resultado
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        subespecie: ''
                    },
                   // loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem das subespecies, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaVariedade() {
        if (!this.props.form.getFieldsValue().especie) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma especie para cadastrar uma variedade.');
        }
        if (!this.props.form.getFieldsValue().genero) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione um gênero para cadastrar uma variedade.');
        }
        if (!this.props.form.getFieldsValue().familia) {
            this.openNotificationWithIcon('warning', 'Falha', 'Selecione uma familia para cadastrar uma variedade.');
        } else {
            this.setState({
                loading: true,
            });
            axios.post('/api/variedades/', {
                nome: this.props.form.getFieldsValue().campo,
                familia_id: this.props.form.getFieldsValue().familia,
                genero_id: this.props.form.getFieldsValue().genero,
                especie_id: this.props.form.getFieldsValue().especie,
                autor_id: this.props.form.getFieldsValue().autor
            })
                .then(response => {
                    this.setState({
                        loading: false,
                    });
                    if (response.status === 204) {
                        this.requisitaVariedades(this.props.form.getFieldsValue().especie)
                        this.setState({
                            search: {
                                variedade: 'validating'
                            }
                        });
                        this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                    }
                    this.props.form.setFields({
                        campo: {
                            value: '',
                        },
                    });
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    });
                    const { response } = err;
                    if (response && response.data) {
                        if (response.status === 400 || response.status === 422) {
                            this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                        } else {
                            this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova variedade, tente novamente.")
                        }
                        const { error } = response.data;
                        throw new Error(error.message);
                    } else {
                        throw err;
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaVariedades = (id) => {
        // this.setState({
        //     loading: true,
        // });
        axios.get('/api/variedades/', {
            params: {
                especie_id: id,
                limite: 999999999,
            }
        })
            .then(response => {
                this.setState({
                    search: {
                        variedade: ''
                    },
                  //  loading: false
                })
                if (response.status === 200) {
                    this.setState({
                        variedades: response.data.resultado
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        variedade: ''
                    },
                  //  loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar a listagem de variedade, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovoAutor() {
        axios.post('/api/autores/', {
            nome: this.props.form.getFieldsValue().campo,
            iniciais: ''
        })
            .then(response => {
                if (response.status === 204) {
                    this.requisitaAutores();
                    this.setState({
                        search: {
                            autor: 'validating'
                        }
                    });
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                } else if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo autor, tente novamente.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);

    }

    requisitaAutores = (id) => {
        this.setState({
            loading: true,
        })
        axios.get('/api/autores/')
            .then(response => {
                this.setState({
                    loading: false,
                })
                if (response.status === 200) {
                    this.setState({
                        search: {
                            autor: ''
                        }
                    })
                    this.setState({
                        autores: response.data
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        autor: ''
                    },
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao requisitar os autores, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovoSolo() {
        this.setState({
            loading: true,
        })
        axios.post('/api/solos/', {
            nome: this.props.form.getFieldsValue().campo,
        })
            .then(response => {
                if (response.status === 204) {
                    this.requisitaSolos();
                    this.setState({
                        search: {
                            solo: 'validating'
                        },
                        loading: false,
                    });
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo solo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);

    }

    requisitaSolos = (id) => {
        this.setState({
            loading: true,
        })
        axios.get('/api/solos/')
            .then(response => {
                this.setState({
                    loading: false,
                })
                if (response.status === 200) {
                    this.setState({
                        search: {
                            solo: ''
                        }
                    })
                    this.setState({
                        solos: response.data
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        solo: ''
                    },
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo solo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovoRelevo() {
        this.setState({
            loading: true,
        })
        axios.post('/api/relevos/', {
            nome: this.props.form.getFieldsValue().campo,
        })
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 204) {
                    this.requisitaRelevos();
                    this.setState({
                        search: {
                            relevo: 'validating'
                        }
                    });
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                } else if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo relevo, tente novamente.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
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
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo relevo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);

    }

    requisitaRelevos = (id) => {
        this.setState({
            loading: true
        })
        axios.get('/api/relevos/')
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 200) {
                    this.setState({
                        search: {
                            relevo: ''
                        }
                    })
                    this.setState({
                        relevos: response.data
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        relevo: ''
                    },
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao requisitar o relevo, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovaVegetacao() {
        this.setState({
            loading: true
        })
        axios.post('/api/vegetacoes/', {
            nome: this.props.form.getFieldsValue().campo,
        })
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 204) {
                    this.requisitaVegetacoes();
                    this.setState({
                        search: {
                            vegetacao: 'validating'
                        }
                    });
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                }
                this.props.form.setFields({
                    campo: {
                        value: '',
                    },
                });
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
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar a nova vegetação, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);

    }

    requisitaVegetacoes = (id) => {
        this.setState({
            loading: true
        })
        axios.get('/api/vegetacoes/')
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 200) {
                    this.setState({
                        search: {
                            vegetacao: ''
                        }
                    })
                    this.setState({
                        vegetacoes: response.data
                    });
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao buscar as vegetações, tente novamente.")
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        vegetacao: ''
                    },
                    loading: false
                })
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao requisitar as vegetacoes, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    cadastraNovoColetor() {
        this.setState({
            formColetor: false,
            loading: true
        })
        axios.post('/api/coletores/', {
            nome: this.props.form.getFieldsValue().nomeColetor,
            email: this.props.form.getFieldsValue().emailColetor,
            numero: this.props.form.getFieldsValue().numeroColetor
        })
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 204) {
                    this.requisitaColetores('');
                    this.setState({
                        search: {
                            coletor: 'validating'
                        }
                    });
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                }
                this.props.form.setFields({
                    nomeColetor: {
                        value: '',
                    },
                    emailColetor: {
                        value: '',
                    },
                    numeroColetor: {
                        value: '',
                    },
                });
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
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo coletor, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);

    }

    ajustaColetores = (value) => {
        if(value.length !== 0) {
            axios.get(`/api/tombos/numeroColetor/${value[0].key}`)
                .then(response => {
                    if (response.status === 200) {
                        var todosNumeros = response.data;
                        var numeros = todosNumeros.map(e => e.numero_coleta);

                        numeros.sort((a, b)=> {return (a - b)});
                        var numero = 0;
                        var result = 0;
                        var lacuna = [];
                        if(numeros === []) numero = 1;
                        else if(numeros.length == 1) numero = numero + 1;
                        else {
                            numeros = [0].concat(numeros);
                            for(var i = 0; i < numeros.length; i++){
                                if(numeros[i+1] - numeros[i] !== 1 && numeros[i+1] - numeros[i] !== 0){
                                    lacuna.push(numeros[i]);
                                }
                            }
                            if(lacuna.length === 0){
                                result = numeros[numeros.length -1] + 1;
                            }else{
                                var index = lacuna.indexOf(Math.min(...lacuna));
                                result = lacuna.splice(index, 1)[0] + 1;

                            }
                            this.props.form.setFields({
                                numColeta: {
                                    value: result
                                }
                            })
                        }
                    }
                })
                .catch(this.catchRequestError);
        }
    }

    requisitaColetores = (nome) => {
        this.setState({
            coletores: [],
            fetchingColetores: true 
        })
        axios.get(`/api/coletores-predicao?nome=${nome}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        coletores: response.data
                    })
                }
                this.setState({ fetchingColetores: false });
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao requisitar coletores, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaIdentificadores = (nome) => {
        this.setState({
            identificadores: [],
            fetchingIdentificadores: true 
        })
        axios.get(`/api/identificadores-predicao?nome=${nome}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        identificadores: response.data
                    })
                }
                this.setState({ fetchingIdentificadores: false });
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                    } else {
                        this.openNotificationWithIcon("error", "Falha", "Houve um problema ao requisitar os identificadores, tente novamente.")
                    }
                    const { error } = response.data;
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    renderPrincipaisCaracteristicas(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Número da coleta:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('numColeta', {
                                    rules: [{
                                        required: true,
                                        message: 'Insira o numero da coleta',
                                    }]
                                })(
                                    <Input type="text" placeholder={"785"} style={{ width: "100%" }} />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Data de Coleta:</span>
                        </Col>
                        <Col span={24}>
                            <Row type={"flex"} gutter={4}>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataColetaDia')(
                                            <InputNumber
                                                min={1}
                                                max={31}
                                                initialValue={17}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataColetaMes')(
                                            <InputNumber
                                                min={1}
                                                max={12}
                                                initialValue={11}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataColetaAno')(
                                            <InputNumber
                                                min={500}
                                                max={5000}
                                                initialValue={2018}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Localidade:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('localidadeCor', {
                                    initialValue: String(this.state.localidadeInicial),
                                    rules: [{
                                        required: true,
                                        message: 'Escolha uma localidade',
                                    }]
                                })(
                                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                                        <Radio value={'VERMELHO'}><Tag color="red">Paraná</Tag></Radio>
                                        <Radio value={'VERDE'}><Tag color="green">Brasil</Tag></Radio>
                                        <Radio value={'AZUL'}><Tag color="blue">Outros países</Tag></Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Nome Popular:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('nomePopular')(
                                    <Input placeholder={"Maracujá Doce"} type="text" />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Herbário:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('entidade', {
                                    initialValue: String(this.state.herbarioInicial),
                                    rules: [{
                                        required: true,
                                        message: 'Escolha uma entidade',
                                    }]
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma entidade"
                                        optionFilterProp="children"

                                    >

                                        {this.optionEntidades()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Tipo:</span>
                        </Col>
                        <Col xs={22} sm={22} md={12} lg={12} xl={12}>
                            <FormItem>
                                {getFieldDecorator('tipo', {
                                   initialValue: String(this.state.tipoInicial),
                                })(                                    
                                    <Select
                                        showSearch
                                        placeholder="Selecione o tipo"
                                        optionFilterProp="children"

                                    >
                                        {this.optionTipo()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'do novo tipo',
                                        tipo: 0,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>
            </div >
        );
    }

    renderLocalTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Latitude:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('latitude')(
                                    <CoordenadaInputText
                                        placeholder={`48°40'30"O`}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Longitude:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('longitude')(
                                    <CoordenadaInputText
                                        placeholder={`48°40'30"O`}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Altitude:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('altitude')(
                                    <InputNumber style={{ width: "100%" }} />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>País:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('pais', {
                                    initialValue: String(this.state.paisInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione um país"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            this.requisitaEstados(value)
                                        }}
                                    >
                                        {this.optionPais()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Estado:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('estado', {
                                    initialValue: String(this.state.estadoInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione um estado"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            this.requisitaCidades(value);
                                        }}
                                    >
                                        {this.optionEstado()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Cidade:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('cidade', {
                                    initialValue: String(this.state.cidadeInicial),
                                    rules: [{
                                        required: true,
                                        message: 'Escolha uma cidade',
                                    }]
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma cidade"
                                        optionFilterProp="children"
                                        
                                    >
                                        {this.optionCidade()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col>
                            <span>Local de coleta:</span>
                            {getFieldDecorator('complemento', {
                                initialValue: String(this.state.complementoInicial),
                            })(
                                <TextArea rows={4} />
                            )}
                        </Col>
                    </Col>
                    
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col>
                            <span>Descrição:</span>
                            {getFieldDecorator('relevoDescricao')(
                                <TextArea rows={4} />
                            )}
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }

    renderFamiliaTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Numero de Tombo:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('numeroTombo')(
                                    <Input disabled type="text" />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Data do Tombo:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('dataTombo')(
                                    <Input disabled type="text" />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Família:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem>
                                {getFieldDecorator('familia', {
                                    initialValue: String(this.state.familiaInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma família"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            this.requisitaSubfamilias(value);
                                            this.requisitaGeneros(value);
                                            this.setState({
                                                search: {
                                                    subfamilia: 'validating',
                                                    genero: 'validating',
                                                }
                                            });
                                            this.props.form.setFields({
                                                subfamilia: {
                                                    value: ''
                                                },
                                                genero: {
                                                    value: ''
                                                },
                                                especie: {
                                                    value: ''
                                                },
                                                subespecie: {
                                                    value: ''
                                                },
                                                variedade: {
                                                    value: ''
                                                },
                                            });
                                        }}

                                    >
                                        {this.optionFamilia()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova familia',
                                        tipo: 1
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Subfamília:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.subfamilia}>
                                {getFieldDecorator('subfamilia', {
                                    initialValue: String(this.state.subfamiliaInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma subfamília"
                                        optionFilterProp="children"

                                    >
                                        {this.optionSubfamilia()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova subfamilia',
                                        tipo: 2,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>

                <Divider dashed />
                
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Gênero:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.genero}>
                                {getFieldDecorator('genero', {
                                    initialValue: String(this.state.generoInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione um gênero"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            this.requisitaEspecies(value);
                                            this.setState({
                                                search: {
                                                    especie: 'validating'
                                                }
                                            });
                                            this.props.form.setFields({
                                                especie: {
                                                    value: ''
                                                },
                                                subespecie: {
                                                    value: ''
                                                },
                                                variedade: {
                                                    value: ''
                                                },
                                            });
                                        }}

                                    >
                                        {this.optionGenero()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'do novo genero',
                                        tipo: 3,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Espécie:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.especie}>
                                {getFieldDecorator('especie', {
                                    initialValue: String(this.state.especieInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma espécie"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            this.requisitaSubespecies(value);
                                            this.requisitaVariedades(value);
                                            this.setState({
                                                search: {
                                                    subespecie: 'validating',
                                                    variedade: 'validating',
                                                },
                                                formComAutor: true,
                                            });
                                            this.props.form.setFields({
                                                subespecie: {
                                                    value: ''
                                                },
                                                variedade: {
                                                    value: ''
                                                },
                                            });
                                        }}

                                    >
                                        {this.optionEspecie()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova especie',
                                        tipo: 4,
                                    },
                                    formComAutor: true,
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Subespécie:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.subespecie}>
                                {getFieldDecorator('subespecie', {
                                    initialValue: String(this.state.subespecieInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma subespécie"
                                        optionFilterProp="children"

                                    >
                                        {this.optionSubespecie()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova subespecie',
                                        tipo: 5
                                    },
                                    formComAutor: true,
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Variedade:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.variedade}>
                                {getFieldDecorator('variedade', {
                                    initialValue: String(this.state.variedadeInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma variedade"
                                        optionFilterProp="children"

                                    >
                                        {this.optionVariedade()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova variedade',
                                        tipo: 6,
                                    },
                                    formComAutor: true,
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>

            </div>
        );
    }

    renderTipoSoloTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Solo:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.solo}>
                                {getFieldDecorator('solo', {
                                    initialValue: String(this.state.soloInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione um solo"
                                        optionFilterProp="children"

                                    >
                                        {this.optionSolo()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'do novo solo',
                                        tipo: 8,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Relevo:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.relevo}>
                                {getFieldDecorator('relevo', {
                                    initialValue: String(this.state.relevoInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione um relevo"
                                        optionFilterProp="children"

                                    >
                                        {this.optionRelevo()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'do novo relevo',
                                        tipo: 9,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Vegetação:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.vegetacao}>
                                {getFieldDecorator('vegetacao', {
                                    initialValue: String(this.state.vegetacaoInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma vegetacao"
                                        optionFilterProp="children"

                                    >
                                        {this.optionVegetacao()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.setState({
                                    formulario: {
                                        desc: 'da nova vegetação',
                                        tipo: 10,
                                    },
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Fase sucessional:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('fases', {
                                    initialValue: String(this.state.faseInicial),
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Selecione uma fase sucessional"
                                        optionFilterProp="children"

                                    >
                                        {this.optionFase()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                
            </div>
        );
    }

    renderIdentificador(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span> Identificador: </span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('identificador', {
                                    initialValue: String(this.state.identificadorInicial),
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        // onChange={this.handleChangeIdentificadores}
                                        placeholder="Selecione o idenficador"
                                        onSearch = {value => {
                                            this.requisitaIdentificadores(value)
                                        }}
                                        filterOption={false}
                                        // filterOption={(input, option) =>
                                        //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        // }
                                    >
                                        {this.optionIdentificador()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span> Data Identificação: </span>
                        </Col>
                        <Col span={24}>
                            <Row type={"flex"} gutter={4}>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataIdentDia')(
                                            <InputNumber
                                                min={1}
                                                max={31}
                                                initialValue={17}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataIdentMes')(
                                            <InputNumber
                                                min={1}
                                                max={12}
                                                initialValue={11}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem>
                                        {getFieldDecorator('dataIdentAno')(
                                            <InputNumber
                                                min={500}
                                                max={5000}
                                                initialValue={2018}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </div>
        )
    }

    handleChangeColetores = valores => {
        this.setState({
            fetchingColetores: false,
            valoresColetores: valores,
            coletores: []
        })
    }

    handleChangeIdentificadores = valor => {
        this.setState({
            fetchingIdentificadores: false,
            //identificadorInicial: `${valor}`,
            identificadores: []
        })
    }

    renderColetores(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <Col span={24}>
                            <span>Coletores:</span>
                        </Col>
                        <Col span={22}>
                            <FormItem validateStatus={this.state.search.coletor}>
                                {getFieldDecorator('coletores', {
                                    //initialValue:  this.state.coletoresInicial != '' ? String(this.state.coletoresInicial) : "oi",
                                    rules: [{
                                        required: true,
                                        message: 'Insira ao menos um coletor',
                                    }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        notFoundContent={this.state.fetchingColetores ? <Spin size="small" /> : null}
                                        labelInValue
                                        value={this.state.valoresColetores}
                                        // onChange={this.handleChangeColetores}
                                        placeholder="Selecione os coletores"
                                        filterOption={false}
                                        onSearch = {value => {
                                            this.requisitaColetores(value)
                                        }}
                                        onChange = {value => {
                                            this.ajustaColetores(value)
                                        }}
                                    >
                                        {this.optionColetores()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button shape="dashed" icon="plus" style={{
                                marginTop: '5px',
                            }} onClick={() => {
                                this.requisitaNumeroColetor();
                                this.setState({
                                    formulario: {
                                        tipo: 11,
                                    },
                                    formColetor: true,
                                    visibleModal: true
                                })
                            }} />
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }

    renderColecoesAnexas(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Col span={24}>
                            <span>Coleções anexas:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('tipoColecaoAnexa', {
                                    initialValue: String(this.state.colecaoInicial),
                                })(
                                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                                        <Radio value={'CARPOTECA'}><Tag color="red">Carpoteca</Tag></Radio>
                                        <Radio value={'XILOTECA'}><Tag color="green">Xiloteca</Tag></Radio>
                                        <Radio value={'VIA LIQUIDA'}><Tag color="blue">Via Líquida</Tag></Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span> Observações da coleção anexa: </span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('observacoesColecaoAnexa')(
                                    <TextArea rows={4} />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }

    renderFormulario(getFieldDecorator) {
        if (this.state.formColetor) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Nome:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('nomeColetor')(
                                        <Input placeholder={""} type="text" />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Email:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('emailColetor')(
                                        <Input placeholder={""} type="text" />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Col span={24}>
                                <span>Nº Coletor:</span>
                            </Col>
                            <Col span={24}>
                                <FormItem>
                                    {getFieldDecorator('numeroColetor')(
                                        <Input placeholder={""} type="text" />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                    </Row>
                </div>
            );
        } else if (this.state.formComAutor) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={24}>
                            <span>Informe o nome {this.state.formulario.desc}:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('campo')(
                                    <Input placeholder={""} type="text" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={24}>
                            <span>Informe o nome do autor:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={24}>
                            <FormItem >
                                {getFieldDecorator('autor')(
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Selecione um autor"
                                        optionFilterProp="children"

                                    >
                                        {this.optionAutores()}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            )
        }
        return (
            <div>
                <Row gutter={8}>
                    <Col span={24}>
                        <span>Informe o nome {this.state.formulario.desc}:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <FormItem>
                            {getFieldDecorator('campo')(
                                <Input placeholder={""} type="text" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }

    validacaoModal() {
        if (this.state.formColetor) {
            if (!this.props.form.getFieldsValue().nomeColetor || !this.props.form.getFieldsValue().numeroColetor) {
                this.openNotificationWithIcon("warning", "Falha", "O nome e o número do coletor são obrigatórios.")
                return false;
            } else {
                return true;
            }
        } else {
            if (!this.props.form.getFieldsValue().campo) {
                this.openNotificationWithIcon("warning", "Falha", "Informe o nome para o cadastro.")
                return false;
            }
            return true;
        }
    }

    renderConteudoIdentificador() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmitForm}>
                <ModalCadastroComponent title={'Edição'} visibleModal={this.state.visibleModal} loadingModal={this.state.loadingModal}
                    onCancel={
                        () => {
                            this.setState({
                                visibleModal: false,
                                formColetor: 0,
                                formComAutor: false,
                            })
                        }
                    }
                    onOk={() => {
                        if (this.validacaoModal()) {
                            switch (this.state.formulario.tipo) {
                                case 1:
                                    this.cadastraNovaFamilia();
                                    break;
                                case 2:
                                    this.cadastraNovaSubfamilia();
                                    break;
                                case 3:
                                    this.cadastraNovoGenero();
                                    break;
                                case 4:
                                    this.cadastraNovaEspecie();
                                    break;
                                case 5:
                                    this.cadastraNovaSubespecie();
                                    break;
                                case 6:
                                    this.cadastraNovaVariedade();
                                    break;
                                case 7:
                                    this.cadastraNovoAutor();
                                    break;
                                default:
                                    break;
                            }
                        }

                        this.setState({
                            visibleModal: false,
                            formComAutor: false,
                            formColetor: 0
                        })
                    }}>

                    {this.renderFormulario(getFieldDecorator)}

                </ModalCadastroComponent>
            </Form>
            <Form onSubmit={this.handleSubmitIdentificador}>
                <Row>
                    <Col span={12}>
                        <h2 style={{ fontWeight: 200 }}>Tombo</h2>
                    </Col>
                </Row>
                <Divider dashed />
                {this.renderFamiliaTombo(getFieldDecorator)}
                <Divider dashed />
                <Row type="flex" justify="end">
                    <Col xs={24} sm={8} md={3} lg={3} xl={3}>
                        <ButtonComponent titleButton="Salvar" />
                    </Col>
                </Row>
            </Form>
            </div>
        )
    }

    renderConteudo() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div>
                <Form onSubmit={this.handleSubmitForm}>
                    <ModalCadastroComponent title={'Cadastro'} visibleModal={this.state.visibleModal} loadingModal={this.state.loadingModal}
                        onCancel={
                            () => {
                                this.setState({
                                    visibleModal: false,
                                    formColetor: 0,
                                    formComAutor: false,
                                })
                            }
                        }
                        onOk={() => {
                            if (this.validacaoModal()) {
                                switch (this.state.formulario.tipo) {
                                    case 0:
                                        this.cadastraNovoTipo();
                                        break;
                                    case 1:
                                        this.cadastraNovaFamilia();
                                        break;
                                    case 2:
                                        this.cadastraNovaSubfamilia();
                                        break;
                                    case 3:
                                        this.cadastraNovoGenero();
                                        break;
                                    case 4:
                                        this.cadastraNovaEspecie();
                                        break;
                                    case 5:
                                        this.cadastraNovaSubespecie();
                                        break;
                                    case 6:
                                        this.cadastraNovaVariedade();
                                        break;
                                    case 7:
                                        this.cadastraNovoAutor();
                                        break;
                                    case 8:
                                        this.cadastraNovoSolo();
                                        break;
                                    case 9:
                                        this.cadastraNovoRelevo();
                                        break;
                                    case 10:
                                        this.cadastraNovaVegetacao();
                                        break;
                                    case 11:
                                        this.cadastraNovoColetor();
                                        break;
                                    default:
                                        break;
                                }
                            }

                            this.setState({
                                visibleModal: false,
                                formComAutor: false,
                                formColetor: 0
                            })
                        }}>

                        {this.renderFormulario(getFieldDecorator)}

                    </ModalCadastroComponent>
                </Form>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={12}>
                            <h2 style={{ fontWeight: 200 }}>Tombo</h2>
                        </Col>
                    </Row>

                    {this.renderFamiliaTombo(getFieldDecorator)}
                    
                    <Divider dashed />
                    {this.renderColetores(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderPrincipaisCaracteristicas(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderLocalTombo(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderTipoSoloTombo(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderIdentificador(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderColecoesAnexas(getFieldDecorator)}
                    <Divider dashed />
                    <Row gutter={8}>
                        <Col span={24}>
                            <span> Observações do tombo: </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('observacoesTombo')(
                                    <TextArea rows={4} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                    {this.props.match.params.tombo_id ? <div>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Col span={24}>
                                <span> Fotos da exsicata: </span>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('fotosExsicata')(
                                        <UploadPicturesComponent
                                            fileList={this.state.fotosExsicata}
                                            beforeUpload={foto => {
                                                this.setState(({ fotosExsicata }) => ({
                                                    fotosExsicata: [
                                                        ...fotosExsicata,
                                                        foto
                                                    ],
                                                }));
                                                this.handleSubmit();
                                                return false;
                                            }}
                                            onRemove={foto => {
                                                this.setState(({ fotosExsicata: listaAntiga }) => {
                                                    const index = listaAntiga.indexOf(foto);

                                                    const fotosExsicata = listaAntiga
                                                        .filter((item, i) => i !== index);

                                                    return { fotosExsicata };
                                                });
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Col span={24}>
                                <span> Fotos em vivo: </span>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('fotosVivo')(
                                        <UploadPicturesComponent
                                            fileList={this.state.fotosEmVivo}
                                            beforeUpload={foto => {
                                                this.setState(({ fotosEmVivo }) => ({
                                                    fotosEmVivo: [
                                                        ...fotosEmVivo,
                                                        foto
                                                    ],
                                                }));
                                                this.handleSubmit();
                                                return false;
                                            }}
                                            onRemove={foto => {
                                                this.setState(({ fotosEmVivo: listaAntiga }) => {
                                                    const index = listaAntiga.indexOf(foto);

                                                    const fotosEmVivo = listaAntiga
                                                        .filter((item, i) => i !== index);

                                                    return { fotosEmVivo };
                                                });
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        </div>
                         : <div></div>}
                        {this.props.match.params.tombo_id ? 
                            <div>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Col span={24}>
                                        <span> Exsicata sem foto: </span>
                                    </Col>
                                    <Col span={8}>
                                    <Button onClick={() => this.criaCodigoBarrasSemFotos(false)} >
                                        <Icon type="upload" /> Enviar
                                    </Button>
                                    </Col>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Col span={24}>
                                        <span> Em vivo sem foto: </span>
                                    </Col>
                                    <Col span={8}>
                                    <Button onClick={() => this.criaCodigoBarrasSemFotos(true)} >
                                        <Icon type="upload" /> Enviar
                                    </Button>
                                    </Col>
                                </Col>
                            </div>
                         : <div></div>}
                    </Row>
                    
                    <Divider dashed />
                    <Row gutter={8}>
                    <Table
                        columns={this.tabelaFotosColunas}
                        dataSource={this.state.fotosTeste.length !== 0 ? this.state.fotosTeste : this.state.fotos}
                        loading={this.state.loading}
                        rowKey="id"
                    />
                    
                    </Row>             
                    <Row gutter={10} type="flex" justify="end">
                        <Col >
                            <Button
                                disabled = {this.props.match.params.tombo_id ? false : true}
                                type = "primary"
                            >
                                <Link
                                    to={{
                                    pathname: `${baseUrl}/api/fichas/tombos/${this.state.numeroHcf}/1`
                                    }}
                                    target="_blank"
                                    > imprimir ficha c/ código
                                </Link>
                            </Button>
                        </Col>
                        <Col >
                            <Button
                                disabled = {this.props.match.params.tombo_id ? false : true}
                                type = "primary"
                            >
                                <Link
                                    to={{
                                    pathname: `${baseUrl}/api/fichas/tombos/${this.state.numeroHcf}/0`
                                    }}
                                    target="_blank"
                                    > imprimir ficha s/ código
                                </Link>
                            </Button>
                        </Col>
                        <Col >
                            <Button
                                disabled = {this.props.match.params.tombo_id ? false : true}
                                type = "primary"
                            >
                                <Link
                                    to={{
                                    pathname: '/pendencias/' + this.state.numeroHcf,
                                    }}
                                    target="_blank"
                                    > ver pendencias
                                </Link>
                            </Button>
                        </Col>
                        <Col >
                            <ButtonComponent titleButton={"Salvar"} htmlType="submit"/>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }

    mostraMensagemDelete(id) {
		const self = this;
		confirm({
			title: 'Você tem certeza que deseja excluir esta foto?',
			content: 'Ao clicar em SIM, a foto será excluída.',
			okText: 'SIM',
			okType: 'danger',
			cancelText: 'NÃO',
			onOk() {
				
			},
			onCancel() {
			},
		});
	}

    gerarAcaoFoto = id => {
        return (
            <span>
                <a href="#" onClick={() => this.mostraMensagemDelete(id)}>
                    <Icon type="delete" style={{ color: "#e30613" }} />
                </a>
            </span>
        )
	}

    renderPorTipo() {
        if (isIdentificador()) {
            return this.renderConteudoIdentificador()
        }
        return this.renderConteudo()
    }

    render() {
        if (this.state.loading) {
            return (
                <Spin tip="Carregando...">
                    {this.renderPorTipo()}
                </Spin>
            )
        }
        return (
            this.renderPorTipo()
        );
    }
}

export default Form.create()(NovoTomboScreen);
