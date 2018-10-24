import React, { Component } from 'react';
import {
	Divider, Icon, Modal, Card, Row, Col, Form,
	Input, Button, notification,
} from 'antd';
import axios from 'axios';
import SimpleTableComponent from '../components/SimpleTableComponent';
import { Link } from 'react-router-dom';
import HeaderListComponent from '../components/HeaderListComponent';
import { isCuradorOuOperador } from '../helpers/usuarios';

const confirm = Modal.confirm;
const FormItem = Form.Item;


class ListaHerbariosScreen extends Component {

	columns = [
		{
			title: "Sigla",
			type: "text",
			key: "sigla"
		},
		{
			title: "Nome",
			type: "text",
			key: "nome"
		},
		{
			title: "Endereço",
			type: "text",
			key: "endereco"
		},
		{
			title: "Email",
			type: "text",
			key: "email"
		},
	];

	constructor(props) {
		super(props);
		this.state = {
			herbarios: [],
			metadados: {},
			loading: true,
			pagina: 1
		}

		if (isCuradorOuOperador()) {
			this.columns.push({
				title: "Ação",
				key: "acao"
			});
		}
	}

	componentDidMount() {
		this.requisitaListaHerbarios({}, this.state.pagina);
	}

	gerarAcao = id => {
		if (isCuradorOuOperador()) {
			return (
				<span>
					<Link to={`/herbarios/${id}`}>
						<Icon type="edit" style={{ color: "#FFCC00" }} />
					</Link>
					<Divider type="vertical" />
					<a href="#" onClick={() => this.mostraMensagemDelete(id)}>
						<Icon type="delete" style={{ color: "#e30613" }} />
					</a>
				</span>
			)
		}
	}

	notificacao = (type, titulo, descricao) => {
		notification[type]({
			message: titulo,
			description: descricao,
		});
	};

	requisitaExclusao(id) {
		axios.delete(`/herbarios/${id}`)
			.then(response => {
				if (response.status === 204) {
					this.requisitaListaHerbarios(this.state.valores, this.state.pagina)
					this.notificacao('success', 'Excluir herbário', 'O herbário foi excluído com sucesso.')
				}
			})
			.catch(err => {
				const { response } = err;
				if (response && response.data) {
					if (response.status === 400 || response.status === 422) {
						this.notificacao("warning", "Falha", response.data.error.message);
					} else {
						this.notificacao("error", "Falha", "Houve um problema ao excluir o herbários, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao excluir o herbário, tente novamente.")
			});
	}

	formataDadosHerbarios = herbarios => herbarios.map(item => ({
		key: item.id,
		nome: item.nome,
		email: item.email === null ? "" : item.email,
		sigla: item.sigla,
		endereco: `${item.endereco.logradouro} ${item.endereco.numero}, ${item.endereco.cidade.nome} - ${item.endereco.cidade.estados_nome}, ${item.endereco.cidade.estados_paises_nome}`,
		acao: this.gerarAcao(item.id),
	}));

	mostraMensagemDelete(id) {
		const self = this;
		confirm({
			title: 'Você tem certeza que deseja excluir este herbário?',
			content: 'Ao clicar em SIM, o herbário será excluído.',
			okText: 'SIM',
			okType: 'danger',
			cancelText: 'NÃO',
			onOk() {
				self.requisitaExclusao(id);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	requisitaListaHerbarios = (valores, pg) => {
		let params = {
			pagina: pg
		}

		if (valores !== undefined) {
			const { nome, email, sigla } = valores;

			if (nome) {
				params.nome = nome;
			}
			if (email) {
				params.email = email;
			}
			if (sigla) {
				params.sigla = sigla;
			}
		}

		axios.get('/herbarios', { params })
			.then(response => {
				this.setState({
					loading: false
				})
				if (response.status === 200) {
					const { data } = response;
					this.setState({
						herbarios: this.formataDadosHerbarios(data.herbarios),
						metadados: data.metadados,
					});
				}
			})
			.catch(err => {
				this.setState({
					loading: false
				})
				const { response } = err;
				if (response && response.data) {
					if (response.status === 400 || response.status === 422) {
						this.notificacao("warning", "Falha", response.data.error.message);
					} else {
						this.notificacao("error", "Falha", "Houve um problema ao buscar os herbários, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao buscar os herbários, tente novamente.")
			});
	}

	handleSubmit = (err, valores) => {
		if (!err) {
			if (valores.nome || valores.sigla || valores.email) {
				this.setState({
					valores: valores,
					loading: true
				})
				this.requisitaListaHerbarios(valores, this.state.pagina);
			} else {
				this.notificacao('warning', 'Buscar', 'Informe ao menos um campo para realizar a busca.');
			}
		}
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(this.handleSubmit);
	};

	renderPainelBusca(getFieldDecorator) {
		return (
			<Card title="Buscar Herbário">
				<Form onSubmit={this.onSubmit}>
					<Row gutter={8}>
						<Col span={8}>
							<span>Nome:</span>
						</Col>
						<Col span={8}>
							<span>Email:</span>
						</Col>
						<Col span={8}>
							<span>Sigla:</span>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('nome')(
									<Input placeholder={"Herbario do Centro Federal"} type="text" />
								)}
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('email')(
									<Input placeholder={"herbariofederal@gmail.com"} type="text" />
								)}
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('sigla')(
									<Input placeholder={"HCF"} type="text" />
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
													herbarios: []
												})
												this.requisitaListaHerbarios({}, 1);
											}}
											className="login-form-button"
										>
											Limpar
									</Button>
									</FormItem>
								</Col>
								<Col span={4}>
									<FormItem>
										<Button
											type="primary"
											htmlType="submit"
											className="login-form-button"
										>
											Pesquisar
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
			<div>
				<HeaderListComponent title={"Listagem de Herbários"} link={"/herbarios/novo"} />
				<Divider dashed />
				{this.renderPainelBusca(getFieldDecorator)}
				<Divider dashed />
				<SimpleTableComponent
					columns={this.columns}
					data={this.state.herbarios}
					metadados={this.state.metadados}
					loading={this.state.loading}
					changePage={(pg) => {
						console.log("pagina")
						console.log(pg)
						this.setState({
							pagina: pg,
							loading: true
						})
						this.requisitaListaHerbarios(this.state.valores, pg);
					}}
				/>
				<Divider dashed />
			</div>
		);
	}
}

export default Form.create()(ListaHerbariosScreen);
