import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Input, Button, Select, Switch,
} from 'antd';
import axios from 'axios';
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

    /**
     * 1.Os botões vem do módulo antd, que tem os tipos primary, default, dashed e alert;
     * 2.O switch da atualização automática, usa essa função, que quando clicado alterado o estado;
     * 2.1 O estado inicial do switch tá definido no construtor.
     * */

    handleSwitch() {
        this.setState({ disabled: !this.state.disabled })
    }

    compareReflora() {
        axios.get('/reflora')
            .then(response => {
                console.log(`b${response}`)
            });
    }

    renderPainelBuscarInformacoes(getFieldDecorator) {
        return (
            <Card title="Buscar informações no Reflora">
                <Row gutter={6}>
                    <Col span={6}>
                        <span>Deseja atualizar agora?</span>
                    </Col>
                    <Col span={6}>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.compareReflora}>
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
                            <Switch onChange={this.handleSwitch.bind(this)} />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <span>Horas:</span>
                    </Col>
                    <Col span={6}>
                        <span>Periodicidade:</span>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <FormItem>
                            <Input
                                disabled={this.state.disabled}
                                placeholder={"Insira a hora desejada"} type="number"
                                min="0" max="23"
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
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <FormItem>
                            <span style={{ fontWeight: "bold" }}>A última atualização foi HH:MM:SS DD/MM/YYYY</span>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.state.disabled}>
                                Verificar LOG de saída
                            </Button>
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
