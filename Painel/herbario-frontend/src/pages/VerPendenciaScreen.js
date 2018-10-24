import React, { Component } from 'react';
import { Divider, Col, Row, Input, Form, Button } from 'antd';
import SimpleTableComponent from '../components/SimpleTableComponent';
import HeaderListComponent from '../components/HeaderListComponent';
import GalleryComponent from '../components/GalleryComponent';

const { TextArea } = Input;

const data = [
    {
        key: "1",
        campo: "Nome Popular",
        antigo: "Maracuja Doce",
        novo: "Maracuja Azedo"
    },
    {
        key: "2",
        campo: "Especie",
        antigo: "Passi",
        novo: "Passiflora Alata"
    },
    {
        key: "3",
        campo: "Variedade",
        antigo: "Maracuja Doce",
        novo: "Maracuja Azedo"
    },
    {
        key: "4",
        campo: "Familia",
        antigo: "Passi",
        novo: "Passiflora Alata"
    }
];


const columns = [
    {
        title: "Campo",
        type: "text",
        key: "campo"
    },
    {
        title: "Valor antigo",
        type: "text",
        key: "antigo"
    },
    {
        title: "Valor novo",
        type: "text",
        key: "novo"
    }
];

export default class VerPendenciaScreen extends Component {

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <HeaderListComponent title={"Modificações"} add={false} />
                <Divider dashed />
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <GalleryComponent />
                    </Col>
                </Row>
                <Divider dashed />
                <Row gutter={8} style={{ marginBottom: "20px" }}>
                    <SimpleTableComponent columns={columns} data={data} noAction={true} pagination={false} />
                </Row>
                <Row gutter={8} style={{ marginBottom: "10px" }}>
                    <Col span={8}>
                        <span>Observação:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <TextArea rows={8} />
                    </Col>
                </Row>
                <Divider dashed />
                <Row>
                    <Col span={24}>
                        <Row type="flex" justify="end">
                            <Col span={4}>
                                <Button type="primary" icon="check" style={{
                                    backgroundColor: "#5cb85c",
                                    borderColor: "#4cae4c"
                                }}>Aprovar</Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" icon="exclamation" style={{
                                    backgroundColor: "#f0ad4e",
                                    borderColor: "#eea236"
                                }}>Arrumar</Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" icon="close" style={{
                                    backgroundColor: "#d9534f",
                                    borderColor: "#d43f3a"
                                }}>Reprovar</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }
}
