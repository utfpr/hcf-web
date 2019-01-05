import React, { Component } from 'react';
import {
    Row,
    Col,
    Divider,
    notification,
    Spin
} from 'antd';
import GalleryComponent from '../components/GalleryComponent';
import MapWithControlledZoom from '../components/MapWithControlledZoom';
import { formatarDataBDtoDataHora } from '../helpers/conversoes/ConversoesData';
import axios from 'axios';

export default class DetalhesTomboScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.tombo_id !== undefined) {
            this.requisitaTombo();
            this.setState({
                loading: true
            })
        }
    }

    openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    requisitaTombo = () => {
        axios.get(`/tombos/${this.props.match.params.tombo_id}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        loading: false,
                        tombo: response.data
                    });
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
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    renderMainCharacteristics() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Número de tombo:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Nome Popular:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Herbário:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.hcf} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.nomes_populares} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.herbario.sigla === null ? "" : tombo.herbario.sigla} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Número da coleta:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Data de Coleta:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Data de Tombo:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.numero_coleta} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.data_coleta_dia || '00'}/{tombo.data_coleta_mes || '00'}/{tombo.data_coleta_ano || '0000'} </span>
                        </Col>
                        <Col span={8}>
                            <span> {formatarDataBDtoDataHora(tombo.data_tombo)} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Tipo:</h4>
                        </Col>
                        <Col span={16}>
                            <h4>Nome cientifico:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.tipo !== null ? tombo.tipo.nome : ""} </span>
                        </Col>
                        <Col span={16}>
                            <span> {tombo.nome_cientifico !== null ? tombo.nome_cientifico : ""} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderFamily() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Família:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Subfamília:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Gênero:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.familia !== null ? tombo.familia.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.sub_familia !== null ? tombo.sub_familia.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.genero !== null ? tombo.genero.nome : ""} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Espécie:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Subespécie:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Variedade:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.especy !== null ? tombo.especy.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.sub_especy !== null ? tombo.sub_especy.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.variedade !== null ? tombo.variedade.nome : ""} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Autor Espécie:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Autor Subespécie:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Autor Variedade:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.especy !== null && tombo.especy.autore !== null ? tombo.especy.autore.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.especy !== null && tombo.especy.autore !== null ? tombo.sub_especy.autore.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.especy !== null && tombo.especy.autore !== null ? tombo.variedade.autore.nome : ""} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderLocal() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Latitude: (datum wgs84)</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Longitude: (datum wgs84)</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Altitude:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.latitude} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.longitude} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.altitude}m </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Cidade:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Estado:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>País:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.cidade.nome} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.cidade.estados_nome} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.cidade.estados_paises_nome} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Complemento:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.complemento} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderGround() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Solo:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Relevo:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Vegetação:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.solo !== null ? tombo.locais_coletum.solo.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.relevo !== null ? tombo.locais_coletum.relevo.nome : ""} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.vegetacao !== null && tombo.locais_coletum.vegetacao !== undefined ? tombo.locais_coletum.vegetacao.nome : ""} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Fase sucessional:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.locais_coletum.fase_sucessional !== null ? tombo.locais_coletum.fase_sucessional.nome : ""} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    spanColetores = () => this.state.tombo.coletores.map(item => (
        <span value={item.id}>{item.nome}, </span>
    ));

    renderCollectors() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Coletores:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            {this.spanColetores()}
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderComments() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <h4>Observações:</h4>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col span={24}>
                            <span>{tombo.observacao}</span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderIdentificador() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Identificador:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Data Identificação:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.usuarios.nome} </span>
                        </Col>
                        <Col span={8}>
                            <span>
                                {tombo.data_identificacao_dia !== (undefined && null) ? tombo.data_identificacao_dia : '00'}/
                                {tombo.data_identificacao_mes !== (undefined && null) ? tombo.data_identificacao_mes : '00'}/
                                {tombo.data_identificacao_ano !== (undefined && null) ? tombo.data_identificacao_ano : '0000'}
                            </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderColecoesAnexas() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row gutter={24}>
                        <Col span={8}>
                            <h4>Coleções Anexas:</h4>
                        </Col>
                        <Col span={12}>
                            <h4>Observações da coleção anexa:</h4>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <span> {tombo.colecoes_anexa !== null ? tombo.colecoes_anexa.tipo : ""} </span>
                        </Col>
                        <Col span={12}>
                            <span> {tombo.colecoes_anexa !== null ? tombo.colecoes_anexa.observacoes : ""} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    renderConteudo() {
        const tombo = this.state.tombo;
        if (tombo) {
            return (
                <div>
                    <Row type="flex" justify="center">
                        <Col span={12}>
                            <GalleryComponent />
                        </Col>
                    </Row>
                    <Divider dashed />
                    {this.renderMainCharacteristics()}
                    <Divider dashed />
                    {this.renderFamily()}
                    <Divider dashed />
                    {this.renderLocal()}
                    <Divider dashed />
                    {this.renderGround()}
                    <Divider dashed />
                    {this.renderCollectors()}
                    <Divider dashed />
                    {this.renderIdentificador()}
                    <Divider dashed />
                    {this.renderColecoesAnexas()}
                    <Divider dashed />
                    {this.renderComments()}
                    <Divider dashed />

                    <MapWithControlledZoom lat={tombo.latitude} lng={tombo.longitude} />
                </div>
            );
        }
        return (
            <div>
            </div>
        )
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
