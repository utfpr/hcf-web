import React, { Component } from 'react';
import { Divider, Col, Row, Input, Form, Button, Spin } from 'antd';
import SimpleTableComponent from '../components/SimpleTableComponent';
import HeaderListComponent from '../components/HeaderListComponent';
import GalleryComponent from '../components/GalleryComponent';
import axios from 'axios';

const { TextArea } = Input;
const FormItem = Form.Item;

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

    constructor(props) {
		super(props);
		this.state = {
            loading: false,
            data: [],
            fotos: {
                novas: [],
                antigas: []
            }
		};
	}
    
    componentDidMount() {
        if (this.props.match.params.pendencia_id !== undefined) {
            this.requisitaPendencia();
        }
    }

    requisitaPendencia = () => {
        this.setState({
            loading: true
        });
        axios.get(`/pendencias/${this.props.match.params.pendencia_id}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        data: response.data.tabela,
                        fotos: response.data.fotos,
                    });                
                }
                this.setState({
                    loading: false
                });
            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                const { response } = err;
                if (response && response.data) {
                    if (response.status === 400 || response.status === 422) {
                        this.notificacao("warning", "Falha", response.data.error.message);
                    } else {
                        this.notificacao("error", "Falha", "Houve um problema ao buscar as pendências, tente novamente.")
                    }
                    const { error } = response.data;
                    console.log(error.message)
                } else {
                    throw err;
                }
            })
    }

    renderFotos() {
        if (this.state.fotos.novas.length > 0) {
            return (
                <div>
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
                </div>
            )
        }
    }

    renderFormulario() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <HeaderListComponent title={"Modificações"} add={false} />
                {this.renderFotos()}
                <Divider dashed />
                <Row gutter={8} style={{ marginBottom: "20px" }}>
                    <SimpleTableComponent pageSize={30} columns={columns} data={this.state.data} noAction={true} pagination={false} />
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
                <Row type="flex" justify="end">
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <FormItem>
                            <Button type="primary" icon="check" style={{
                                backgroundColor: "#5cb85c",
                                borderColor: "#4cae4c"
                            }}>Aprovar</Button>
                        </FormItem>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
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

    render() {
		if (this.state.loading) {
			return (
				<Spin tip="Carregando...">
					{this.renderFormulario()}
				</Spin>
			)
		}
		return (
			this.renderFormulario()
		);
	}
}

export default Form.create()(VerPendenciaScreen);
