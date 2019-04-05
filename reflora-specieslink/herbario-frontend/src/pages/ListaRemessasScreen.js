import React, { Component } from 'react';
import {
	Divider, Icon, Modal, Card, Row, Col,
	Spin, Form, Select, Button, InputNumber
} from 'antd';
import axios from 'axios';
import HeaderListComponent from '../components/HeaderListComponent';
import { formatarDataBDtoDataHora } from '../helpers/conversoes/ConversoesData';
import { Link } from 'react-router-dom';
import ExpansiveTableComponent from '../components/ExpansiveTableComponent';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

const columns = [
	{
		title: "Código",
		dataIndex: "codigo",
		key: "codigo"
	},
	{
		title: "Data de Envio",
		dataIndex: "dataEnvio",
		key: "dataEnvio"
	},
	{
		title: "Doador",
		dataIndex: "doador",
		key: "doador"
	},
	{
		title: "Receptor",
		dataIndex: "receptor",
		key: "receptor"
	},
	{
		title: "Observação",
		dataIndex: "observacao",
		key: "observacao"
	},
	{
		title: "Ação",
		key: "acao"
	}
];

const subColumns = [
	{
		title: "Tombo",
		dataIndex: "tombo",
		key: "tombo"
	},
	{
		title: "Tipo",
		dataIndex: "tipo",
		key: "tipo"
	},
	{
		title: "Data Vencimento",
		dataIndex: "dataVencimento",
		key: "dataVencimento"
	},
	{
		title: "Ação",
		dataIndex: "acao",
		key: "acao"
	}
];



class ListaRemessasScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			remessas: [],
			metadados: [],
			herbarios: [],
			pagina: 1,
			loading: false,
			loadingPg: false,
		}
	}

	componentDidMount() {
		this.setState({
			loading: true
		});
		this.requisitaListaRemessas({}, this.state.pagina);
		this.requisitaListaHerbarios();
	}

	requisitaListaHerbarios = () => {
		let params = {
			limite: 9999999
		}

		axios.get('/herbarios', { params })
			.then(response => {
				this.setState({
					loading: false
				})
				if (response.status === 200) {
					this.setState({
						herbarios: response.data.herbarios,
					});
				}
			})
			.catch(err => {
				this.setState({
					loading: false
				})
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


	mostraMensagemDelete(id) {
		const self = this;
		confirm({
			title: 'Você tem certeza que deseja excluir esta remessa?',
			content: 'Ao clicar em SIM, a remessa será excluída.',
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

	mostraMensagemDevolucao(idRemessa, idTombo) {
		const self = this;
		confirm({
			title: 'Você tem certeza que deseja devolver este tombo?',
			content: 'Ao clicar em SIM, o tombo será devolvido.',
			okText: 'SIM',
			okType: 'warning',
			cancelText: 'NÃO',
			onOk() {
				self.requisitaDevolucao(idRemessa, idTombo);
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	requisitaExclusao(id) {
		axios.delete(`/remessas/${id}`)
			.then(response => {
				if (response.status === 204) {
					this.requisitaListaRemessas(this.state.valores, this.state.pagina)
					this.notificacao('success', 'Excluir remessa', 'A remessa foi excluída com sucesso.')
				}
			})
			.catch(err => {
				const { response } = err;
				if (response && response.data) {
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
	}

	requisitaDevolucao(idRemessa, idTombo) {

		axios.get('/remessas-devolver', {
			params: {
				tombo_id: idTombo,
				remessa_id: idRemessa,
			}
		})
			.then(response => {
				if (response.status === 204) {
					this.requisitaListaRemessas(this.state.valores, this.state.pagina)
					this.notificacao('success', 'Devolver tombo', 'O tombo foi devolvido com sucesso.')
				}
			})
			.catch(err => {
				const { response } = err;
				if (response && response.data) {
					this.notificacao('error', 'Erro ao devolver o tombo', response.data.error.message)
					const { error } = response.data;
					throw new Error(error.message);
				} else {
					throw err;
				}
			})
	}

	gerarAcao(id) {
		return (
			<span>
				<Link to={`/remessas/${id}`}>
					<Icon type="edit" style={{ color: "#FFCC00" }} />
				</Link>
				<Divider type="vertical" />
				<a href="#" onClick={() => this.mostraMensagemDelete(id)}>
					<Icon type="delete" style={{ color: "#e30613" }} />
				</a>
			</span>
		)
	}

	gerarAcaoRetirada = (idRemessa, idTombo) =>
		<Button type="dashed" icon="check"
			onClick={() => this.mostraMensagemDevolucao(idRemessa, idTombo)}
		>Devolver</Button>


	formataDadosRemessa = remessas => remessas.remessas.map(item => {
		const doador = remessas.herbarios.filter(herbario => herbario.id === item.herbario_id)[0];
		const receptor = remessas.herbarios.filter(herbario => herbario.id === item.entidade_destino_id)[0];

		const subdata = item.tombos.map(item => ({
			tombo: item.hcf,
			tipo: item.retirada_exsiccata_tombos.tipo,
			dataVencimento: item.retirada_exsiccata_tombos.data_vencimento !== (null && undefined) ? formatarDataBDtoDataHora(item.retirada_exsiccata_tombos.data_vencimento) : "",
			acao: item.retirada_exsiccata_tombos.tipo === 'EMPRESTIMO' && item.retirada_exsiccata_tombos.devolvido === false ? this.gerarAcaoRetirada(item.retirada_exsiccata_tombos.retirada_exsiccata_id, item.hcf) : ''
		}));

		return ({
			codigo: item.id,
			dataEnvio: item.data_envio !== (null && undefined) ? formatarDataBDtoDataHora(item.data_envio) : "",
			receptor: `${receptor.sigla} - ${receptor.nome}`,
			doador: `${doador.sigla} - ${doador.nome}`,
			observacao: item.observacao === null ? "" : item.observacao,
			acao: this.gerarAcao(item.id),
			subdata,
		})
	});

	requisitaListaRemessas = (valores, pg) => {
		let params = {
			pagina: pg
		}

		if (valores !== undefined) {
			const { numRemessa, numTombo, herbario } = valores;

			if (numRemessa) {
				params.numero_remessa = numRemessa;
			}
			if (numTombo) {
				params.numero_tombo = numTombo;
			}
			if (herbario) {
				params.numero_herbario = herbario;
			}
		}

		axios.get('/remessas', { params })
			.then(response => {
				this.setState({
					loading: false
				})
				if (response.status === 200) {
					const { data } = response;
					this.setState({
						remessas: this.formataDadosRemessa(data.resultado),
						metadados: data.metadados
					});
				} else if (response.status === 400) {
					this.notificacao('warning', 'Buscar Genero', response.data.error.message)
				} else {
					this.notificacao('error', 'Error', 'Erro de servidor ao buscar os generos.')
				}
			})
			.catch(err => {
				this.setState({
					loading: false
				})
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
		<Option value={item.id}>{item.nome}</Option>
	));

	renderPainelBusca() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title="Buscar Remessas">
				<Form onSubmit={this.onSubmit}>
					<Row gutter={8}>
						<Col span={8}>
							<span>Número da remessa:</span>
						</Col>
						<Col span={8}>
							<span>Número do tombo:</span>
						</Col>
						<Col span={8}>
							<span>Herbário:</span>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('numRemessa')(
									<InputNumber
										initialValue={17}
										style={{ width: "100%" }}
									/>
								)}
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('numTombo')(
									<InputNumber
										initialValue={17}
										style={{ width: "100%" }}
									/>
								)}
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem>
								{getFieldDecorator('herbario')(
									<Select initialValue="2">
										{this.optionHerbario()}
									</Select>
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
													usuarios: []
												})
												this.requisitaListaRemessas({}, 1);
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

	handleSubmit = (err, valores) => {
		if (!err) {
			this.setState({
				valores: valores,
				loading: true
			})
			this.requisitaListaRemessas(valores, this.state.pagina);
		}
	}

	onSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(this.handleSubmit);
	};

	renderFormulario() {
		return (
			<div>
				<HeaderListComponent title={"Remessas"} link={"/remessas/novo"} />
				<Divider dashed />
				{this.renderPainelBusca()}
				<Divider dashed />
				<ExpansiveTableComponent
					columns={columns}
					metadados={this.state.metadados}
					data={this.state.remessas}
					subColumns={subColumns}
					loading={this.state.loading}
					changePage={(pg) => {
						this.setState({
							pagina: pg,
							loading: true
						})
						this.requisitaListaRemessas(this.state.valores, pg);
					}}
				/>
				<Divider dashed />
			</div>
		);
	}

	render() {
		if (this.state.loadingPg) {
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

export default Form.create()(ListaRemessasScreen);
