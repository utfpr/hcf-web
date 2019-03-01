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
            disabled: true,
        }
    }

    handleGameClik() {
        this.setState({ disabled: !this.state.disabled })
    }

    /** Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert */
    renderPainelBuscarInformacoes(getFieldDecorator) {
        return (
            <Card title="Buscar informações no Reflora">
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Deseja atualizar agora?</span>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Atualizar
							</Button>
                    </Col>
                </Row>
                <Row gutter={6}>
                    <Col span={6} style={{ top: '21px' }}>
                        <span>Atualização automática</span>
                    </Col>
                    <Col span={6} style={{ top: '12px', textAlign: 'center' }}>
                        <FormItem>
                            <Switch onChange={this.handleGameClik.bind(this)} />
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
                            <Input
                                setfieldsvalue="0"
                                disabled={this.state.disabled}
                                placeholder={"Insira a hora desejada"} type="number"
                                min="0" max="23"
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Input
                                setfieldsvalue="0"
                                disabled={this.state.disabled}
                                placeholder={"Insira os minutos desejados"} type="number"
                                min="0" max="59"
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Input
                                setfieldsvalue="0"
                                disabled={this.state.disabled}
                                placeholder={"Insira os segundos desejados"} type="number"
                                min="0" max="60"
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Select defaultValue="Semanalmente" disabled={this.state.disabled}>
                                <Option value="Semanalmente">Semanalmente</Option>
                                <Option value="Mensalmente">Mensalmente</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

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
