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
                            <span> {tombo.taxonomia.nome_popular} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.herbario} </span>
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
                            <span> {tombo.data_coleta} </span>
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
                            <span> {tombo.tipo} </span>
                        </Col>
                        <Col span={16}>
                            <span> {tombo.taxonomia.nome_cientifico} </span>
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
                            <span> {tombo.taxonomia.familia} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.sub_familia} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.genero} </span>
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
                            <span> {tombo.taxonomia.especie.nome} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.sub_especie.nome} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.variedade.nome} </span>
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
                            <span> {tombo.taxonomia.especie.autor} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.sub_especie.autor} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.taxonomia.variedade.autor} </span>
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
                            <span> {tombo.localizacao.latitude} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.localizacao.longitude} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.localizacao.altitude}m </span>
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
                            <span> {tombo.localizacao.cidade} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.localizacao.estado} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.localizacao.pais} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Complemento:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {} </span>
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
                            <span> {tombo.local_coleta.solo} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.local_coleta.relevo} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.local_coleta.vegetacao} </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={8}>
                            <h4>Fase sucessional:</h4>
                        </Col>
                        <Col span={8}>
                            <h4>Descrição:</h4>
                        </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: "20px" }}>
                        <Col span={8}>
                            <span> {tombo.local_coleta.fase_sucessional} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.local_coleta.descricao} </span>
                        </Col>
                    </Row>
                </div>
            );
        }
    }


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
                            <span> {tombo.coletores} </span>
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
                            <span> {} </span>
                        </Col>
                        <Col span={8}>
                            <span> {tombo.data_identificacao} </span>
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
                            <span> {tombo.colecao_anexa.tipo} </span>
                        </Col>
                        <Col span={12}>
                            <span> {tombo.colecao_anexa.observacao} </span>
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
                            <GalleryComponent fotos={tombo.fotos} />
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
