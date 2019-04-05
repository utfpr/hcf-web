import React, { Component } from 'react';
import {
	Form,
	Row,
	Col,
	Divider,
	Input,
	Button,
	Select,
	notification,
	InputNumber,
	Spin
} from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class NovoHerbarioScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			cidades: [],
			estados: [],
			paises: [],
		};
	}

	formataDadosPais(paises) {
		let itens = []
		paises.forEach(function (item) {
			itens.push(<Option key={`${item.sigla};${item.nome}`}>{item.nome}</Option>);
		});
		return itens;
	}

	formataDadosEstados(estados) {
		let itens = []
		estados.forEach(function (item) {
			itens.push(<Option key={`${item.sigla};${item.nome}`}>{item.nome}</Option>);
		});
		return itens;
	}

	formataDadosCidades(cidades) {
		let itens = []
		cidades.forEach(function (item) {
			itens.push(<Option key={item.id}>{item.nome}</Option>);
		});
		return itens;
	}

	requisitaPaises = () => {
		this.setState({
			loading: true
		});
		axios.get('/paises/')
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.data && response.status === 200) {
					this.setState({
						paises: this.formataDadosPais(response.data)
					})
				}
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
						this.notificacao("error", "Falha", "Houve um problema ao buscar os países, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao buscar os países, tente novamente.")
			});
	}

	requisitaEstados = (sigla, nome) => {
		this.setState({
			loading: true
		});
		axios.get('/estados/', {
			params: {
				sigla,
				nome,
			}
		})
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.data && response.status === 200) {
					this.setState({
						estados: this.formataDadosEstados(response.data)
					})
				}
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
						this.notificacao("error", "Falha", "Houve um problema ao buscar os estados, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao buscar os estados, tente novamente.")
			});
	}

	requisitaCidades = (sigla, nome) => {
		this.setState({
			loading: true
		});
		axios.get('/cidades/', {
			params: {
				sigla,
				nome,
			}
		})
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.data && response.status === 200) {
					this.setState({
						cidades: this.formataDadosCidades(response.data)
					})
				}
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
						this.notificacao("error", "Falha", "Houve um problema ao buscar as cidades, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao buscar as cidades, tente novamente.")
			});
	}

	componentDidMount() {
		this.requisitaPaises();
		if (this.props.match.params.herbario_id !== undefined) {
			this.requisitaHerbario();
			this.setState({
				loading: true
			})
		}
	}

	notificacao = (type, message, description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};

	handleSubmit = (err, valores) => {
		if (!err) {
			if (this.props.match.params.herbario_id !== undefined) {
				this.requisitaEdicaoHerbario(valores);
			} else {
				this.requisitaCadastroHerbario(valores);
			}
		}
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(this.handleSubmit);
	};

	requisitaCadastroHerbario = valores => {
		this.setState({
			loading: true
		});
		const {
			nome,
			sigla,
			email,
			logradouro,
			numero,
			cidade,
			complemento,
		} = valores;

		let json = {
			herbario: {},
			endereco: {}
		};

		if (nome) json.herbario.nome = nome;
		if (sigla) json.herbario.sigla = sigla;
		if (email) json.herbario.email = email;
		if (cidade) json.endereco.cidade_id = cidade;
		if (logradouro) json.endereco.logradouro = logradouro;
		if (numero) json.endereco.numero = numero;
		if (complemento) json.endereco.complemento = complemento;

		axios.post('/herbarios', json)
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.status === 201) {
					this.props.history.goBack()
				}
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
						this.notificacao("error", "Falha", "Houve um problema ao cadastrar o herbários, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao cadastrar o herbário, tente novamente.")
			});
	}

	requisitaHerbario = () => {
		this.setState({
			loading: true
		});
		axios.get(`/herbarios/${this.props.match.params.herbario_id}`)
			.then(response => {
				const { nome, email, sigla, endereco } = response.data;

				if (response.status === 200) {
					Promise.resolve()
						.then(() => {
							this.requisitaCidades(endereco.cidade.estados_sigla, endereco.cidade.estados_nome);
						})
						.then(() => {
							this.requisitaEstados(endereco.cidade.estados_paises_sigla, endereco.cidade.estados_paises_nome);
						})
						.then(() => {
							this.props.form.setFields({
								nome: { value: nome },
								email: { value: email },
								sigla: { value: sigla },
								logradouro: { value: endereco.logradouro },
								numero: { value: endereco.numero },
								complemento: { value: endereco.complemento },
								pais: { value: `${endereco.cidade.estados_paises_sigla};${endereco.cidade.estados_paises_nome}` },
								estado: { value: `${endereco.cidade.estados_sigla};${endereco.cidade.estados_nome}` },
								cidade: { value: endereco.cidade.id },
							});
						})
						.catch(() => {
							this.props.history.goBack();
						})

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
						this.notificacao("error", "Falha", "Houve um problema ao buscar os dados do herbário, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao buscar os dados do herbário, tente novamente.")
			});
	}

	requisitaEdicaoHerbario = valores => {
		this.setState({
			loading: true
		});
		const {
			nome,
			sigla,
			email,
			logradouro,
			numero,
			cidade,
			complemento,
		} = valores;

		let json = {
			herbario: {},
			endereco: {}
		};

		if (nome) json.herbario.nome = nome;
		if (sigla) json.herbario.sigla = sigla;
		if (email) json.herbario.email = email;
		if (cidade) json.endereco.cidade_id = cidade;
		if (logradouro) json.endereco.logradouro = logradouro;
		if (numero) json.endereco.numero = numero;
		if (complemento) json.endereco.complemento = complemento;

		axios.put(`/herbarios/${this.props.match.params.herbario_id}`, json)
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.status === 200) {
					this.props.history.goBack()
				}
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
						this.notificacao("error", "Falha", "Houve um problema ao atualizar o herbário, tente novamente.")
					}
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(() => {
				this.notificacao("error", "Falha", "Houve um problema ao atualizar o herbário, tente novamente.")
			});
	}

	renderFormulario() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.onSubmit}>
				<Row>
					<Col span={12}>
						<h2 style={{ fontWeight: 200 }}>Herbário</h2>
					</Col>
				</Row>
				<Divider dashed />

				<Row gutter={8}>
					<Col span={8} >
						<span>Nome:</span>
					</Col>
					<Col span={8}>
						<span>Sigla:</span>
					</Col>
					<Col span={8}>
						<span>Email:</span>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('nome', {
								rules: [{
									required: true,
									message: 'Insira o nome do herbário',
								}]
							})(
								<Input placeholder={"Herbário do Centro Federal"} type="text" />
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
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('email', {
								rules: [{
									required: true,
									message: 'Insira o email do herbário',
								}]
							})(
								<Input placeholder={"hcfcampomourao@gmail.com"} type="text" />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<span>Endereço:</span>
					</Col>
					<Col span={8}>
						<span>Número:</span>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('logradouro', {
								rules: [{
									required: true,
									message: 'Insira o logradouro do herbário',
								}]
							})(
								<Input placeholder={"Av. das torres"} type="text" />
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('numero', {
								rules: [{
									required: true,
									message: 'Insira o numero do logradouro do herbário',
								}]
							})(
								<InputNumber min={1} placeholder={1920} style={{ width: '100%' }} />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<span>País:</span>
					</Col>
					<Col span={8}>
						<span>Estado:</span>
					</Col>
					<Col span={8}>
						<span>Cidade:</span>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('pais', {
								rules: [{
									required: true,
									message: 'Selecione ou insira um pais',
								}]
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									placeholder="Brasil"
									onChange={(value) => {
										let valores = String(value).split(';');
										if (valores.length > 1) {
											this.requisitaEstados(valores[0], valores[1]);
										}
									}}
								>
									{this.state.paises}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('estado', {
								rules: [{
									required: true,
									message: 'Selecione ou insira um estado',
								}]
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									placeholder="Paraná"

									onChange={(value) => {
										let valores = String(value).split(';');
										if (valores.length > 1) {
											this.requisitaCidades(valores[0], valores[1]);
										}
									}}
								>
									{this.state.estados}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem>
							{getFieldDecorator('cidade', {
								rules: [{
									required: true,
									message: 'Selecione ou insira uma cidade',
								}]
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									placeholder="Campo Mourão"

								>
									{this.state.cidades}
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={8}>
						<span>Complemento de localização:</span>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={16}>
						<FormItem>
							{getFieldDecorator('complemento')(
								<TextArea rows={4} />
							)}
						</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span={24}>
						<Row type="flex" justify="end">
							<Col span={8}>
								<FormItem>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
									>
										Salvar
									</Button>
								</FormItem>
							</Col>
						</Row>
					</Col>
				</Row>
				<Divider dashed />
			</Form>
		);
	}

	render() {
		console.log('Cidades')
		console.log(this.state.cidades)
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

export default Form.create()(NovoHerbarioScreen);
