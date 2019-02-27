import React, { Component } from 'react';
import { Divider, Col, Row, Input, Form, Button } from 'antd';
import SimpleTableComponent from '../components/SimpleTableComponent';
import HeaderListComponent from '../components/HeaderListComponent';
import GalleryComponent from '../components/GalleryComponent';

const { TextArea } = Input;
const FormItem = Form.Item;

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

class VerPendenciaScreen extends Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <HeaderListComponent title={"Modificações"} add={false} />
                <Divider dashed />
                <Row gutter={8}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Fotos antigas:</span>
                        </Col>
                        <Col span={24}>
                            <GalleryComponent />
                        </Col>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Col span={24}>
                            <span>Novas fotos:</span>
                        </Col>
                        <Col span={24}>
                            <GalleryComponent />
                        </Col>
                    </Col>
                </Row>
                <Divider dashed />
                <Row gutter={8} style={{ marginBottom: "20px" }}>
                    <SimpleTableComponent pageSize={30} columns={columns} data={data} noAction={true} pagination={false} />
                </Row>
                <Divider dashed />


                <Row gutter={8} style={{ marginBottom: "10px" }}>
                    <Col span={24}>
                        <Col span={24}>
                            <span>Observação:</span>
                        </Col>
                        <Col span={24}>
                            <FormItem>
                                {getFieldDecorator('observacao')(
                                    <TextArea rows={8} />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
                <Divider dashed />
                <Row type="flex" justify="end" gutter={4}>
                    <Col xs={24} sm={8} md={6} lg={4} xl={4}>
                        <FormItem>
                            <Button type="primary" icon="check" style={{
                                backgroundColor: "#5cb85c",
                                borderColor: "#4cae4c"
                            }}>Aprovar</Button>
                        </FormItem>
                    </Col>
                    <Col xs={24} sm={8} md={6} lg={4} xl={4}>
                        <FormItem>
                            <Button type="primary" icon="close" style={{
                                backgroundColor: "#d9534f",
                                borderColor: "#d43f3a"
                            }}>Reprovar</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(VerPendenciaScreen);
