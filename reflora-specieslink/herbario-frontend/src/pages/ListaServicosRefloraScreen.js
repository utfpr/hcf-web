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
        this.state = { disabled: false }
    }

    onChange = checked => {
        console.log(`switch to ${checked}`);
    }

    handleSubmit = (err, valores) => {
        if (!err) {
            console.log(`switch to ${valores}`);
        }
    }

    onSubmit = event => {
        event.preventDefault();
        this.props.form.validateFields(this.handleSubmit);
    };

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
                            {getFieldDecorator('horas')(
                                <Switch defaultChecked onChange={this.onChange} />
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
                                <Input
                                    setfieldsvalue="0"
                                    placeholder={"Insira a hora desejada"} type="number"
                                    min="0" max="23"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            {getFieldDecorator('minutos')(
                                <Input
                                    setfieldsvalue="0"
                                    placeholder={"Insira os minutos desejados"} type="number"
                                    min="0" max="59"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            {getFieldDecorator('segundos')(
                                <Input
                                    setfieldsvalue="0"
                                    placeholder={"Insira os segundos desejados"} type="number"
                                    min="0" max="60"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            {getFieldDecorator('periodicidade')(
                                <Select setfieldsvalue="Semanalmente" >
                                    <Option value="Semanalmente">Semanalmente</Option>
                                    <Option value="Mensalmente">Mensalmente</Option>
                                </Select>
                            )}
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
