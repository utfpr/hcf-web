import React, { Component } from 'react';
import axios from 'axios';
import {
    Row, Col, Divider,
    Form, Input, Button,
} from 'antd';

import SimpleTableComponent from '../components/SimpleTableComponent';
// import ButtonExportComponent from '../components/ButtonExportComponent';

const FormItem = Form.Item;

const columns = [
    {
        title: 'HCF',
        type: 'number',
        key: 'hcf'
    },
    {
        title: 'Data Coleta',
        type: 'text',
        key: 'data_coleta'
    },
    {
        title: 'Nome científico',
        type: 'text',
        key: 'nome_cientifico'
    },
    {
        title: 'Ação',
        render: () => (
            <span>Ações</span>
        ),
    }
];

class FichaTomboScreen extends Component {

    state = {
        tombos: [],
    };

    handleFormSubmit = event => {
        event.preventDefault();
        this.props.form.validateFields(this.validateFieldsCallback);
    };

    validateFieldsCallback = (err, values) => {

        const params = Object.entries(values)
            .filter(entry => {
                const [, value] = entry;
                return !!value;
            })
            .reduce((output, entry) => {
                const [key, value] = entry;
                return {
                    ...output,
                    [key]: value,
                };
            }, {});

        this.setState({ loading: true });

        axios.get('/api/tombos', { params })
            .then(response => {
                const { status, data } = response;
                const { metadados, tombos } = data;

                this.setState({ loading: false, metadados, tombos });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row>
                    <Col span="24">
                        <h2 style={{ fontWeight: 200 }}>Ficha Tombo</h2>
                    </Col>
                </Row>
                <Divider dashed />

                <Row gutter="8">
                    <Col span="2">
                        <FormItem label={<span>HCF</span>}>
                            {getFieldDecorator('hcf')(
                                <Input type="text" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label={<span>Data de coleta</span>}>
                            {getFieldDecorator('data_coleta')(
                                <Input type="text" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label={<span>Nome científico</span>}>
                            {getFieldDecorator('nome_cientifico')(
                                <Input type="text" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter="8">
                    <Col span="24">
                        <Button type="primary" htmlType="submit" icon="search">
                            Pesquisar
                        </Button>
                    </Col>
                </Row>
                <Divider dashed />

                <SimpleTableComponent
                    columns={columns}
                    data={this.state.tombos}
                    metadados={this.state.metadados}
                    loading={this.state.loading}
                    changePage={page => {
                        console.log(`Clicou na página ${page}`);
                    }}
                />
            </Form>
        );
    }
}

export default Form.create()(FichaTomboScreen);
