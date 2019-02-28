import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Input, Button, Select,
} from 'antd';
import HeaderListComponent from '../components/HeaderListComponent';

const FormItem = Form.Item;
const Option = Select.Option;

class ListaServicosRefloraScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            taxonomias: [],
            metadados: {},
            loading: true,
            pagina: 1
        }
    }

    /** Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert */
    renderPainelBuscarImediatamente(getFieldDecorator) {
        return (
            <Card title="Buscar informações imediatamente">
                <Form onSubmit={this.onSubmit}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Definir
							</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        )
    }

    renderPainelBuscarAutomatico(getFieldDecorator) {
        return (
            <Card title="Programar a busca de informações">
                <Form onSubmit={this.onSubmit}>
                    <Row gutter={8}>
                        <Col span={6}>
                            <span>Horas:</span>
                        </Col>
                        <Col span={6}>
                            <span>Minutos:</span>
                        </Col>
                        <Col span={6}>
                            <span>Segundos:</span>
                        </Col>
                        <Col span={6}>
                            <span>Periodicidade:</span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('horas')(
                                    <Input placeholder={"Insira a hora desejada"} type="number" min="0" max="23" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('minutos')(
                                    <Input placeholder={"Insira os minutos desejados"} type="number" min="0" max="59" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('segundos')(
                                    <Input placeholder={"Insira os segundos desejados"} type="number" min="0" max="60" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {getFieldDecorator('periodicidade')(
                                    <Select defaultValue="Diariamente" style={{ width: 383.25 }} >
                                        <Option value="Diariamente">Diariamente</Option>
                                        <Option value="Semanalmente">Semanalmente</Option>
                                        <Option value="Mensalmente">Mensalmente</Option>
                                    </Select>
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
                                                this.requisitaListaTaxonomias({}, 1);
                                            }}
                                            className="login-form-button"
                                        >
                                            Limpar
									    </Button>
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            Definir
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
            <Form onSubmit={this.onSubmit}>
                <HeaderListComponent title={"Reflora"} link={"/reflora/novo"} />
                <Divider dashed />
                {this.renderPainelBuscarImediatamente(getFieldDecorator)}
                <Divider dashed />
                {this.renderPainelBuscarAutomatico(getFieldDecorator)}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosRefloraScreen);
