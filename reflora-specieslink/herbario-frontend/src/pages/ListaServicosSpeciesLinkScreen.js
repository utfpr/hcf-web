import React, { Component } from 'react';
import {
    Divider, Card, Row, Col, Form,
    Button, Upload, Switch, Icon,
} from 'antd';
import HeaderListComponent from '../components/HeaderListComponent';

const FormItem = Form.Item;

class ListaServicosSpeciesLinkScreen extends Component {

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
    renderPainelEnviarInformacoes(getFieldDecorator) {
        return (
            <Card title="Buscar informações no speciesLink">
                <Form onSubmit={this.onSubmit} className="login-form">

                    <Row gutter={8}>
                        <Col span={6} >
                            {getFieldDecorator('arquivo')(
                                <Upload>
                                    <Button size="large">
                                        <Icon type="upload" /> Inserir o arquivo .TXT do speciesLink
                                    </Button>
                                </Upload>
                            )}
                        </Col>
                        <Col span={6} >
                            <FormItem>
                                <Button size="small" type="primary">
                                    Enviar arquivo
								</Button>
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
                <HeaderListComponent title={"SpeciesLink"} link={"/specieslink/novo"} />
                <Divider dashed />
                {this.renderPainelEnviarInformacoes(getFieldDecorator)}
                <Divider dashed />
            </Form>
        );
    }
}

// Arquivo baseado no arquivo ListaTaxonomiaScreeen.js
export default Form.create()(ListaServicosSpeciesLinkScreen);
