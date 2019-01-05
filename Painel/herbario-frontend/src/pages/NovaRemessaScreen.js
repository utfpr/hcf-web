import React, { Component } from 'react';
import {
	Form,
	Button,
	Select,
	Input,
	InputNumber,
	notification,
	Spin,
	Icon,
	Modal,
	Row,
	Col,
	DatePicker,
	Divider,
} from 'antd';
import ButtonComponent from '../components/ButtonComponent';
import ModalCadastroComponent from '../components/ModalCadastroComponent';
import SimpleTableComponent from '../components/SimpleTableComponent';
import axios from 'axios';
import 'moment/locale/pt-br';

import { formatarDataENtoBR, formatarDataBDtoDataHora } from '../helpers/conversoes/ConversoesData';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const { TextArea } = Input;

const columns = [
	{
		title: "Tombo",
		type: "text",
		key: "hcf"
	},
	{
		title: "Tipo",
		type: "text",
		key: "tipo"
	},
	{
		title: "Data Vencimento",
		type: "text",
		key: "data_vencimento"
	},
	{
		title: "Ação",
		key: "acao"
	}

];


class NovaRemessaScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			herbarios: [],
			data: [],
			visibleModal: false
		}
	}

	componentDidMount() {
		this.requisitaHerbarios();
		if (this.props.match.params.remessa_id !== undefined) {
			this.buscaRemessa();
		}
	}

	buscaRemessa() {
		this.setState({
			loading: true
		});
		axios.get(`/remessas/${this.props.match.params.remessa_id}`)
			.then(response => {
				console.log(response)
				if (response.status === 200) {
					this.setState({
						loading: false
					});
				}
				const { remessa } = response.data;
				this.props.form.setFields({
					doador: {
						value: remessa.herbario_id,
					},
					receptor: {
						value: remessa.entidade_destino_id,
					},
					/* dataEnvio: {
						value: remessa.data_envio,
					},*/
					observacoes: {
						value: remessa.observacao,
					},
				});
				this.setState({
					data: this.formataTombos(remessa.tombos),
				})
			})
			.catch(err => {
				this.setState({
					loading: false
				});
				const { response } = err;
				if (response && response.data) {
					const { error } = response.data;
					this.notificacao("error", "Falha", "Houve um problema ao buscar os dados da remessa, tente novamente.")
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(this.catchRequestError);

	}

	formataTombos = tombos => tombos.map(item => ({
		hcf: item.hcf,
		tipo: item.retirada_exsiccata_tombos.tipo,
		data_vencimento: item.retirada_exsiccata_tombos.data_vencimento !== (null && undefined) ? formatarDataBDtoDataHora(item.retirada_exsiccata_tombos.data_vencimento) : "",
	}));

	requisitaHerbarios() {

		this.setState({
			loading: true
		});

		axios.get('/herbarios/', {
			params: {
				limite: 9999999,
			}
		})
			.then(response => {
				if (response.status !== 200) {
					this.notificacao('error', 'Buscar', 'Erro ao buscar a lista de herbários.');
				}
				this.setState({
					loading: false,
					herbarios: response.data.herbarios
				});
			})
			.catch(err => {
				this.setState({
					loading: false
				});
				const { response } = err;
				if (response && response.data) {
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(this.catchRequestError);
	}

	handleSubmit = (err, valores) => {
		if (!err) {
			if (this.state.data.length > 0) {
				if (this.props.match.params.remessa_id !== undefined) {
					this.requisitaEdicaoRemessa(valores);
				} else {
					this.cadastroRemessa(valores);
				}
			} else {
				this.notificacao('warning', 'Cadastro/Alteração', 'É necessário adicionar um tombo para a lista de remessa.')
			}
		}
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(this.handleSubmit);
	};

	cadastroRemessa(valores) {
		this.setState({
			loading: true
		});

		const {
			observacoes,
			dataEnvio,
			receptor,
			doador
		} = valores;

		axios.post('/remessas/', {
			remessa: {
				observacao: observacoes,
				data_envio: dataEnvio,
				entidade_destino_id: receptor,
				herbario_id: doador
			},
			tombos: this.state.data
		})
			.then(response => {
				console.log(response)
				if (response.status === 204) {
					this.setState({
						loading: false
					});
					this.notificacao("success", "Sucesso", "O cadastro foi realizado com sucesso.")
				}
				this.props.form.setFields({
					campo: {
						value: '',
					},
				});
			})
			.catch(err => {
				this.setState({
					loading: false
				});
				const { response } = err;
				if (response && response.data) {
					const { error } = response.data;
					if (response.status === 400) {
						this.notificacao("warning", "Falha", error.message);
					} else {
						this.notificacao("error", "Falha", "Houve um problema ao cadastrar a novo genero, tente novamente.")
					}
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(this.catchRequestError);

	}

	requisitaEdicaoRemessa = (valores) => {

		this.setState({
			loading: true
		});

		const {
			observacoes,
			dataEnvio,
			receptor,
			doador
		} = valores;

		axios.put(`/remessas/${this.props.match.params.remessa_id}`, {
			remessa: {
				observacao: observacoes,
				data_envio: dataEnvio,
				entidade_destino_id: receptor,
				herbario_id: doador
			},
			tombos: this.state.data
		})
			.then(response => {
				if (response.status !== 201) {
					this.openNotificationWithIcon("error", "Edição", "Houve um problema ao realizar a edição, verifique os dados e tente novamente.")
				} else {
					this.props.form.resetFields();
					this.openNotificationWithIcon('success', 'Edição', 'O usuário foi alterado com sucesso.')
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
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
			.catch(this.catchRequestError);
	}

	optionHerbario = () => this.state.herbarios.map(item => (
		<Option value={item.id}>{item.sigla} - {item.nome}</Option>
	));

	notificacao = (type, titulo, descricao) => {
		notification[type]({
			message: titulo,
			description: descricao,
			duration: 15
		});
	};

	gerarAcao(item) {
		return (
			<span>
				<a href="" onClick={() => this.mostraMensagemDelete(item.id)}>
					<Icon type="delete" style={{ color: "#e30613" }} />
				</a>
			</span>
		)
	}

	mostraMensagemDelete(id) {
		const self = this;
		confirm({
			title: 'Você tem certeza que deseja excluir da lista esse tombo?',
			content: 'Ao clicar em SIM, o tombo será excluída.',
			okText: 'SIM',
			okType: 'danger',
			cancelText: 'NÃO',
			onOk() {
				let vetor = self.state.data;
				vetor = self.state.data.splice(id, 1);
				self.setState({
					data: vetor
				})
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	formataDados = dados => dados.map(item => (
		{
			hcf: item.hcf,
			tipo: item.tipo,
			data_vencimento: item.data_vencimento ? formatarDataENtoBR(item.data_vencimento) : "",
			acao: this.gerarAcao(item)
		}
	));

	renderFormulario() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form onSubmit={this.handleSubmitForm}>
					<ModalCadastroComponent title={'Adicionar tombo a remessa'} visibleModal={this.state.visibleModal}
						onCancel={
							() => {
								this.setState({
									visibleModal: false,
								})
							}
						}
						onOk={() => {
							let vetor = this.state.data;
							vetor.push({
								hcf: this.props.form.getFieldsValue().hcf,
								tipo: this.props.form.getFieldsValue().tipo,
								data_vencimento: this.props.form.getFieldsValue().dataVencimento ? this.props.form.getFieldsValue().dataVencimento.format('YYYY-MM-DD') : ""
							})

							this.setState({
								visibleModal: false,
								data: vetor
							})
						}}>

						<div>
							<Row gutter={8}>
								<Col span={12}>
									<span>Nº tombo:</span>
								</Col>
							</Row>
							<Row gutter={8}>
								<Col span={12}>
									<FormItem>
										{getFieldDecorator('hcf')(
											<InputNumber
												style={{ width: "100%" }}
											/>
										)}
									</FormItem>
								</Col>
							</Row>
							<Row gutter={8}>
								<Col span={12}>
									<span>Tipo:</span>
								</Col>
								<Col span={12}>
									<span>Data de vencimento:</span>
								</Col>
							</Row>
							<Row gutter={8}>
								<Col span={12}>
									<FormItem>
										{getFieldDecorator('tipo')(
											<Select
												showSearch
												style={{ width: '100%' }}
												placeholder="Selecione um tipo"
												optionFilterProp="children"
												
											>
												<Option value={'EMPRESTIMO'}>{'Emprestimo'}</Option>
												<Option value={'DOACAO'}>{'Doação'}</Option>
												<Option value={'PERMUTA'}>{'Permuta'}</Option>
											</Select>
										)}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem>
										{getFieldDecorator('dataVencimento')(
											<DatePicker />
										)}
									</FormItem>
								</Col>
							</Row>
						</div>

					</ModalCadastroComponent>
				</Form>
				<Form onSubmit={this.handleSubmit}>
					<Row>
						<Col span={12}>
							<h2 style={{ fontWeight: 200 }}>Cadastrar Remessa</h2>
						</Col>
					</Row>
					<Divider dashed />

					<Row gutter={8}>
						<Col span={24}>
							<span>Doador:</span>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={24}>
							<FormItem>
								{getFieldDecorator('doador', {
									rules: [{
										required: true,
										message: 'Selecione um doador',
									}]
								})(
									<Select
										showSearch
										placeholder="Selecione um doador"
										optionFilterProp="children"
										
									>
										{this.optionHerbario()}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={24}>
							<span>Receptor:</span>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={24}>
							<FormItem>
								{getFieldDecorator('receptor', {
									rules: [{
										required: true,
										message: 'Selecione um receptor',
									}]
								})(
									<Select
										showSearch
										placeholder="Selecione um receptor"
										optionFilterProp="children"
										
									>
										{this.optionHerbario()}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={12}>
							<span>Data de envio:</span>
						</Col>
						<Col span={12}>
							<span>Observação:</span>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={12}>
							<FormItem>
								{getFieldDecorator('dataEnvio')(
									<DatePicker format={'DD-MM-YYYY'} />
								)}
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem>
								{getFieldDecorator('observacoes')(
									<TextArea rows={4} />
								)}
							</FormItem>
						</Col>
					</Row>
					<Divider dashed />

					<Row type="flex" justify="end">
						<Col span={4}>
							<Button type="dashed" icon="plus" onClick={() => {
								this.setState({
									visibleModal: true,
								})
							}}>Adicionar tombo</Button>
						</Col>
					</Row>

					<SimpleTableComponent
						columns={columns}
						data={this.formataDados(this.state.data)}
					/>

					<Divider dashed />

					<Row type="flex" justify="end">
						<Col span={6}>
							<ButtonComponent titleButton={"Salvar"} style={{ backgroundColor: "#28a745" }} />
						</Col>
					</Row>

				</Form>
			</div>
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

export default Form.create()(NovaRemessaScreen);