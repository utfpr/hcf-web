import React, { Component } from 'react';
import {
    Form,
    Row,
    Col,
    Divider,
    Select,
    InputNumber,
    Tag,
    Input,
    Button,
    notification,
    Spin,
    Radio,
} from 'antd';
import axios from 'axios';
import UploadPicturesComponent from '../components/UploadPicturesComponent';
import ModalCadastroComponent from '../components/ModalCadastroComponent';
import ButtonComponent from '../components/ButtonComponent';

import tomboParaRequisicao from '../helpers/conversoes/TomboParaRequisicao';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class NovoTomboScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        };
    }

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

    requisitaDadosFormulario = () => {
        axios.get('/tombos/dados')
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 200) {
                    this.setState(response.data)
                    this.props.form.setFields({
                        numeroColeta: {
                            value: response.data.numero_coleta,
                        },
                    });

                } else {
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
                    throw new Error(error.message);
                } else {
                    throw err;
                }
            })
            .catch(this.catchRequestError);
    }

    requisitaNumeroColetor = () => {
        axios.get('/numero-coletores')
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

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(tomboParaRequisicao(values));
            if (!err) {
                if (!(this.props.form.getFieldsValue().dataColetaDia || this.props.form.getFieldsValue().dataColetaMes || this.props.form.getFieldsValue().dataColetaAno)) {
                    this.openNotificationWithIcon("warning", "Falha", "É necessário pelo menos o dia ou o mês ou o ano da data de coleta para o cadastro.")
                    return false;
                } else {
                    this.requisitaCadastroTombo(values);
                    this.setState({
                        loading: true
                    })
                }
            }
        });
    };

    requisitaCadastroTombo(values) {
        console.log(values);

        const {
            altitude, autorEspecie, autorVariedade, autoresSubespecie, cidade, coletores, complemento,
            dataColetaAno, dataColetaDia, dataColetaMes, dataIdentAno, dataIdentDia, dataIdentMes,
            especie, familia, fases, genero, identificador, latitude, localidadeCor, longitude,
            nomePopular, numeroColeta, observacoesColecaoAnexa, observacoesTombo, relevo, solo,
            subespecie, subfamilia, tipo, tipoColecaoAnexa, variedade, vegetacao, entidade, relevoDescricao,
        } = values;
        let json = {}

        if (nomePopular) json.principal = { nome_popular: nomePopular };
        json.principal = { ...json.principal, entidade_id: entidade };
        json.principal.numero_coleta = numeroColeta;
        if (dataColetaDia) json.principal.data_coleta = { dia: dataColetaDia };
        if (dataColetaMes) json.principal.data_coleta = { ...json.principal.data_coleta, mes: dataColetaMes };
        if (dataColetaAno) json.principal.data_coleta = { ...json.principal.data_coleta, ano: dataColetaAno };
        if (tipo) json.principal.tipo_id = tipo;
        json.principal.cor = localidadeCor;
        if (familia) json.taxonomia = { ...json.taxonomia, familia_id: familia };
        if (genero) json.taxonomia = { ...json.taxonomia, genero_id: genero };
        if (subfamilia) json.taxonomia = { ...json.taxonomia, sub_familia_id: subfamilia };
        if (especie) json.taxonomia = { ...json.taxonomia, especie_id: especie };
        if (variedade) json.taxonomia = { ...json.taxonomia, variedade_id: variedade };
        if (subespecie) json.taxonomia = { ...json.taxonomia, sub_especie_id: subespecie };
        if (latitude) json.localidade = { latitude: latitude };
        if (longitude) json.localidade = { ...json.localidade, longitude: longitude };
        if (altitude) json.localidade = { ...json.localidade, altitude: altitude };
        json.localidade = { ...json.localidade, cidade_id: cidade };
        json.localidade = { ...json.localidade, complemento };
        if (solo) json.paisagem = { ...json.paisagem, solo_id: solo };
        if (relevoDescricao) json.paisagem = { ...json.paisagem, descricao: relevoDescricao };
        if (relevo) json.paisagem = { ...json.paisagem, relevo_id: relevo };
        if (vegetacao) json.paisagem = { ...json.paisagem, vegetacao_id: vegetacao };
        if (fases) json.paisagem = { ...json.paisagem, fase_sucessional: fases };
        if (identificador) json.identificacao = { identificador_id: identificador };
        if (dataIdentDia) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    dia: dataIdentDia
                }
            }
        }
        if (dataIdentMes) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    mes: dataIdentMes
                }
            }
        }
        if (dataIdentAno) {
            json.identificacao = {
                ...json.identificacao,
                data_identificacao: {
                    ...json.identificacao.data_identificacao,
                    ano: dataIdentAno
                }
            }
        }
        const converterInteiroColetores = () => coletores.map(item => parseInt(item));
        json.coletores = converterInteiroColetores()
        if (tipoColecaoAnexa) json.colecoes_anexas = { tipo: tipoColecaoAnexa };
        if (observacoesColecaoAnexa) json.colecoes_anexas = { ...json.colecoes_anexas, observacoes: observacoesColecaoAnexa };
        if (observacoesTombo) json.observacoes = observacoesTombo;
        if (autorEspecie) json.autores = { especie: autorEspecie };
        if (autoresSubespecie) json.autores = { ...json.autores, subespecie: autoresSubespecie };
        if (autorVariedade) json.autores = { ...json.autores, variedade: autorVariedade };

        console.log(json);
        axios.post('/tombos', { json })
            .then(response => {
                this.setState({
                    loading: false
                });
                if (response.status === 201) {
                    this.openNotificationWithIcon("success", "Sucesso", "O cadastro foi realizado com sucesso.")
                } else if (response.status === 400) {
                    this.openNotificationWithIcon("warning", "Falha", response.data.error.message);
                } else {
                    this.openNotificationWithIcon("error", "Falha", "Houve um problema ao cadastrar o novo , tombo tente novamente.")
                }

                return response.data;
            })
            .then(response => {
                if (response.status === 201) {
                    const tombo = response.data
                    const criaRequisicaoFoto = (hcf, emVivo, foto) => {
                        const form = new FormData();
                        form.append('imagem', foto);
                        form.append('tombo_hcf', hcf);
                        form.append('em_vivo', emVivo);

                        return axios.post('/uploads', form, {
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
            .then(() => {
                console.log('Acabou as requisições de foto');
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
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

    handleSubmitForm = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    optionEntidades = () => this.state.herbarios.map(item => (
        <Option value={item.id}>{item.sigla} - {item.nome}</Option>
    ));

    optionTipo = () => this.state.tipos.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionFase = () => this.state.fases.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionPais = () => this.state.paises.map(item => (
        <Option value={item.sigla + "|" + item.nome}>{item.sigla} - {item.nome}</Option>
    ));

    optionEstado = () => this.state.estados.map(item => (
        <Option value={item.sigla + "|" + item.nome}>{item.sigla} - {item.nome}</Option>
    ));

    optionCidade = () => this.state.cidades.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionFamilia = () => this.state.familias.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionSubfamilia = () => this.state.subfamilias.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionGenero = () => this.state.generos.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionEspecie = () => this.state.especies.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionSubespecie = () => this.state.subespecies.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionVariedade = () => this.state.variedades.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionAutores = () => this.state.autores.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionVegetacao = () => this.state.vegetacoes.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionRelevo = () => this.state.relevos.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionSolo = () => this.state.solos.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));

    optionColetores = () => this.state.coletores.map(item => (
        <Option key={parseInt(item.id)}>{item.nome}</Option>
    ));

    optionIdentificador = () => this.state.identificadores.map(item => (
        <Option value={item.id}>{item.nome}</Option>
    ));


    requisitaEstados = (sigla, nome) => {
        axios.get('/estados/', {
            params: {
                pais_sigla: sigla,
                pais_nome: nome
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

    requisitaCidades = (sigla, nome) => {
        axios.get('/cidades/', {
            params: {
                estado_sigla: sigla,
                estado_nome: nome
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
            duration: 15
        });
    };

    cadastraNovoTipo() {
        this.setState({
            loading: true,
        });
        axios.post('/tipos/', {
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
        axios.get('/tipos/')
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
        axios.post('/familias/', {
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
        axios.get('/familias/', {
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
            axios.post('/subfamilias/', {
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
        this.setState({
            loading: true,
        });
        axios.get('/subfamilias/', {
            params: {
                familia_id: id,
                limite: 999999999,
            }
        })
            .then(response => {
                this.setState({
                    loading: false,
                });
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
                    loading: false
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
            axios.post('/generos/', {
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
        this.setState({
            loading: true,
        });
        axios.get('/generos/', {
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
                    loading: false,
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
                    loading: false
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
            axios.post('/especies/', {
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
        this.setState({
            loading: true,
        });
        axios.get('/especies/', {
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
                    loading: false,
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
                    loading: false,
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
            axios.post('/subespecies/', {
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
        this.setState({
            loading: true,
        });
        axios.get('/subespecies/', {
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
                    loading: false
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
                    loading: false
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
            axios.post('/variedades/', {
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
        this.setState({
            loading: true,
        });
        axios.get('/variedades/', {
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
                    loading: false
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
                    loading: false
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
        axios.post('/autores/', {
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
        axios.get('/autores/')
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
        axios.post('/solos/', {
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
        axios.get('/solos/')
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
        axios.post('/relevos/', {
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
        axios.get('/relevos/')
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
        axios.post('/vegetacoes/', {
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
        axios.get('/vegetacoes/')
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
        axios.post('/coletores/', {
            nome: this.props.form.getFieldsValue().nomeColetor,
            email: this.props.form.getFieldsValue().emailColetor,
            numero: this.props.form.getFieldsValue().numeroColetor
        })
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 204) {
                    this.requisitaColetores();
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

    requisitaColetores = (id) => {
        this.setState({
            loading: true
        })
        axios.get('/coletores/')
            .then(response => {
                this.setState({
                    loading: false
                })
                if (response.status === 200) {
                    this.setState({
                        search: {
                            coletor: ''
                        }
                    })
                    this.setState({
                        coletores: response.data
                    });
                }
            })
            .catch(err => {
                this.setState({
                    search: {
                        coletor: ''
                    },
                    loading: false
                })
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

    renderPrincipaisCaracteristicas(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Nome Popular:</span>
                    </Col>
                    <Col span={12}>
                        <span>Entidade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator('nomePopular')(
                                <Input placeholder={"Maracujá Doce"} type="text" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator('entidade')(
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
                </Row>
                <Row gutter={8}>
                    <Col span={4}>
                        <span>Número da coleta:</span>
                    </Col>
                    <Col span={8}>
                        <span>Data de Coleta:</span>
                    </Col>
                    <Col span={8}>
                        <span>Localidade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={4}>
                        <FormItem>
                            {getFieldDecorator('numeroColeta', {
                                rules: [{
                                    required: true,
                                    message: 'Insira o numero da coleta',
                                }]
                            })(
                                <Input type="text" placeholder={"785"} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
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
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('localidadeCor', {
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
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <span>Tipo:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem>
                            {getFieldDecorator('tipo')(
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
                </Row>
            </div >
        );
    }

    renderLocalTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={8}>
                        <span>Latitude:</span>
                    </Col>
                    <Col span={8}>
                        <span>Longitude:</span>
                    </Col>
                    <Col span={8}>
                        <span>Altitude:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('latitude')(
                                <Input placeholder={`28°05'56"S`} type="text" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('longitude')(
                                <Input placeholder={`48°40'30"O`} type="text" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('altitude')(
                                <InputNumber style={{ width: "100%" }}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <span>País:</span>
                    </Col>
                    <Col span={8}>
                        <span>Estado:</span>
                    </Col>
                    <Col span={8}>
                        <span>Cidade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('pais', {
                                rules: [{
                                    required: true,
                                    message: 'Informe o nome do pais',
                                }]
                            })(
                                <Select
                                    showSearch
                                    placeholder="Selecione um país"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                        let siglaNome = value.split("|");
                                        this.requisitaEstados(siglaNome[0], siglaNome[1]);
                                    }}
                                >
                                    {this.optionPais()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('estado', {
                                rules: [{
                                    required: true,
                                    message: 'Informe o nome do estado',
                                }]
                            })(
                                <Select
                                    showSearch
                                    placeholder="Selecione um estado"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                        let siglaNome = value.split("|");
                                        this.requisitaCidades(siglaNome[0], siglaNome[1]);
                                    }}
                                >
                                    {this.optionEstado()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('cidade', {
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
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <span>Complemento:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={16}>
                        {getFieldDecorator('complemento', {
                            rules: [{
                                required: true,
                                message: 'Informe um complemento válido',
                            }]
                        })(
                            <TextArea rows={4} />
                        )}
                    </Col>
                </Row>
            </div>
        );
    }

    renderFamiliaTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Família:</span>
                    </Col>
                    <Col span={12}>
                        <span>Subfamília:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem>
                            {getFieldDecorator('familia')(
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
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.subfamilia}>
                            {getFieldDecorator('subfamilia')(
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
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Gênero:</span>
                    </Col>
                    <Col span={12}>
                        <span>Espécie:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.genero}>
                            {getFieldDecorator('genero')(
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
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.especie}>
                            {getFieldDecorator('especie')(
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
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Subespécie:</span>
                    </Col>
                    <Col span={12}>
                        <span>Variedade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.subespecie}>
                            {getFieldDecorator('subespecie')(
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
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.variedade}>
                            {getFieldDecorator('variedade')(
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
                </Row>
            </div>
        );
    }

    renderTipoSoloTombo(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Solo:</span>
                    </Col>
                    <Col span={12}>
                        <span>Relevo:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.solo}>
                            {getFieldDecorator('solo')(
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
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.relevo}>
                            {getFieldDecorator('relevo')(
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
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <span>Vegetação:</span>
                    </Col>
                    <Col span={12}>
                        <span>Fase sucessional:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={10}>
                        <FormItem validateStatus={this.state.search.vegetacao}>
                            {getFieldDecorator('vegetacao')(
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
                    <Col span={10}>
                        <FormItem>
                            {getFieldDecorator('fases')(
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
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <span>Descrição:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={16}>
                        {getFieldDecorator('relevoDescricao')(
                            <TextArea rows={4} />
                        )}
                    </Col>
                </Row>
            </div>
        );
    }

    renderIdentificador(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={12}>
                        <span> Identificador: </span>
                    </Col>
                    <Col span={12}>
                        <span> Data Identificação: </span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator('identificador')(
                                <Select
                                    showSearch
                                    placeholder="Selecione um identificador"
                                    optionFilterProp="children"

                                >
                                    {this.optionIdentificador()}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
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
                </Row>
            </div>
        )
    }

    renderColetores(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={16}>
                        <span>Coletores:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={16}>
                        <FormItem validateStatus={this.state.search.coletor}>
                            {getFieldDecorator('coletores', {
                                rules: [{
                                    required: true,
                                    message: 'Insira ao menos um coletor',
                                }]
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Selecione os coletores"
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
                </Row>
            </div>
        );
    }

    renderColecoesAnexas(getFieldDecorator) {
        return (
            <div>
                <Row gutter={8}>
                    <Col span={8}>
                        <span>Coleções anexas:</span>
                    </Col>
                    <Col span={12}>
                        <span> Observações da coleção anexa: </span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator('tipoColecaoAnexa')(
                                <RadioGroup onChange={this.onChange} value={this.state.value}>
                                    <Radio value={'CARPOTECA'}><Tag color="red">Carpoteca</Tag></Radio>
                                    <Radio value={'XILOTECA'}><Tag color="green">Xiloteca</Tag></Radio>
                                    <Radio value={'VIA LIQUIDA'}><Tag color="blue">Via Líquida</Tag></Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator('observacoesColecaoAnexa')(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
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
                        <Col span={8}>
                            <span>Nome:</span>
                        </Col>
                        <Col span={8}>
                            <span>Email:</span>
                        </Col>
                        <Col span={8}>
                            <span>Nº Coletor:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('nomeColetor')(
                                    <Input placeholder={""} type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('emailColetor')(
                                    <Input placeholder={""} type="text" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem>
                                {getFieldDecorator('numeroColetor')(
                                    <Input placeholder={""} type="text" />
                                )}
                            </FormItem>
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
                    <Divider dashed />
                    {this.renderPrincipaisCaracteristicas(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderLocalTombo(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderFamiliaTombo(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderTipoSoloTombo(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderIdentificador(getFieldDecorator)}
                    <Divider dashed />
                    {this.renderColetores(getFieldDecorator)}
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
                        <Col span={12}>
                            <span> Fotos da exsicata: </span>
                        </Col>
                        <Col span={12}>
                            <span> Fotos em vivo: </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormItem>
                                {getFieldDecorator('fotosExsicata')(
                                    <UploadPicturesComponent
                                        beforeUpload={foto => {
                                            const { fotosExsicata } = this.state;
                                            this.setState({
                                                fotosExsicata: [
                                                    ...fotosExsicata,
                                                    foto
                                                ],
                                            });

                                            console.log(this.state);
                                            return false;
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                {getFieldDecorator('fotosVivo')(
                                    <UploadPicturesComponent
                                        beforeUpload={foto => {
                                            const { fotosEmVivo } = this.state;
                                            this.setState({
                                                fotosEmVivo: [
                                                    ...fotosEmVivo,
                                                    foto
                                                ],
                                            });

                                            return false;
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col span={3}>
                            <ButtonComponent titleButton={"Salvar"} />
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <Spin tip="Carregando...">
                    {this.renderConteudo()}
                </Spin>
            )
        }
        return (
            this.renderConteudo()
        );
    }
}

export default Form.create()(NovoTomboScreen);