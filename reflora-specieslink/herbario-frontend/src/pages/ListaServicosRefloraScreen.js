import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Input, Button, Select, Switch,
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
    renderPainelBuscarInformacoes(getFieldDecorator) {
        return (
            <Card title="Buscar informações no Reflora">
                <Form onSubmit={this.onSubmit} className="login-form">
                    <Row justifyContent="space-between" gutter={6}>
                        <Col span={6}>
                            <span>Deseja atualizar agora?</span>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Atualizar
							</Button>
                        </Col>
                    </Row>
                </Form>

                <Form onSubmit={this.onSubmit} className="login-form">

                    <Row gutter={8}>
                        <Col span={6} style={{ top: '21px' }}>
                            <span>Atualização automática</span>
                        </Col>
                        <Col span={6} style={{ top: '15px', left: '170px' }}>
                            <FormItem>
                                {getFieldDecorator('horas')(
                                    <Switch defaultChecked={false} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>

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
                                        <Option value="Semanalmente">Semanalmente</Option>
                                        <Option value="Mensalmente">Mensalmente</Option>
                                    </Select>
                                )}
                            </FormItem>
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
                {this.renderPainelBuscarInformacoes(getFieldDecorator)}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosRefloraScreen);
