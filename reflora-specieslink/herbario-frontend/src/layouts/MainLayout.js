import React, { Component } from 'react';
import { Layout, Menu, Icon, Col } from 'antd';
import { Link } from 'react-router-dom';
import {
	isCurador,
	isCuradorOuOperador,
	isLogado,
} from '../helpers/usuarios';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class MainLayout extends Component {

	state = {
		collapsed: false
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};

	render() {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Sider trigger={null} collapsible collapsed={this.state.collapsed}>
					<Col align="center" style={{ marginTop: 20, marginBottom: 20 }}>
						<Link to="/">
							<img
								src={require("./../assets/img/logo-hcf-branco.png")}
								alt="logo-hcf"
								height="87"
								width="61"
							/>
						</Link>
					</Col>
					<Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
						<Menu.Item key="1">
							<Link to="/">
								<Icon type="pie-chart" />
								<span>Dashboard</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="3">
							<Link to="/tombos">
								<Icon type="desktop" />
								<span>Tombos</span>
							</Link>
						</Menu.Item>
						<SubMenu
							key="subTaxo"
							title={
								<span>
									<Icon type="desktop" />
									<span>Taxonomias</span>
								</span>
							}
						>
							<Menu.Item key="20">
								<Link to="/familias">Familias</Link>
							</Menu.Item>
							<Menu.Item key="21">
								<Link to="/subfamilias">Subfamilias</Link>
							</Menu.Item>
							<Menu.Item key="22">
								<Link to="/generos">Gêneros</Link>
							</Menu.Item>
							<Menu.Item key="23">
								<Link to="/especies">Espécies</Link>
							</Menu.Item>
							<Menu.Item key="24">
								<Link to="/subespecies">Subespecies</Link>
							</Menu.Item>
							<Menu.Item key="25">
								<Link to="/variedades">Variedades</Link>
							</Menu.Item>
							<Menu.Item key="26">
								<Link to="/autores">Autores</Link>
							</Menu.Item>
						</SubMenu>
						{isCuradorOuOperador() ? (
							<Menu.Item key="8">
								<Link to="/remessas">
									<Icon type="database" />
									<span>Remessas</span>
								</Link>
							</Menu.Item>
						) : null}
						{isCurador() ? (
							<Menu.Item key="7">
								<Link to="/pendencias">
									<Icon type="bars" />
									<span>Pendências</span>
								</Link>
							</Menu.Item>
						) : null}
						{isCurador() ? (
							<Menu.Item key="9">
								<Link to="/usuarios">
									<Icon type="team" />
									<span>Usuários</span>
								</Link>
							</Menu.Item>
						) : null}
						<Menu.Item key="10">
							<Link to="/herbarios">
								<Icon type="flag" />
								<span>Herbários</span>
							</Link>
						</Menu.Item>
						<SubMenu
							key="sub1"
							title={
								<span>
									<Icon type="folder" />
									<span>Relatórios</span>
								</span>
							}
						>
							<Menu.Item key="11">
								{" "}
								<Link to="/relatorio-especies">Espécies coletadas</Link>
							</Menu.Item>
							<Menu.Item key="13">
								<Link to="/relatorio-familia">Família & Gênero</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub2"
							title={
								<span>
									<Icon type="file-text" />
									<span>Fichas</span>
								</span>
							}
						>
							<Menu.Item key="14">
								{" "}
								<Link to="/livro-tombo"> Livro Tombo </Link>{" "}
							</Menu.Item>
							<Menu.Item key="15">Tombo</Menu.Item>
						</SubMenu>
						<Menu.Item key="16">
							<Link to="/">
								<Icon type="desktop" />
								<span>Darwin Core</span>
							</Link>
						</Menu.Item>
						{/**
						 * Adicionando ao menu lateral o botão de serviços,
						 * Reflora e speciesLink.
						 */}
						<SubMenu
							key="servicos"
							title={
								<span>
									<Icon type="search" />
									<span>Serviços</span>
								</span>
							}
						>
							<Menu.Item key="20">
								<Link to="/reflora">Reflora</Link>
							</Menu.Item>
							<Menu.Item key="21">
								<Link to="/subfamilias">speciesLink</Link>
							</Menu.Item>
						</SubMenu>
						{isLogado() ? (
							<Menu.Item key="17">
								<Link to="/inicio">
									<Icon type="logout" />
									<span>Sair</span>
								</Link>
							</Menu.Item>
						) : null}
					</Menu>
				</Sider>
				<Layout>
					<Header style={{ background: "#fff" }}>
						<div style={{ cursor: "pointer" }}>
							<Icon
								className="trigger"
								type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
								onClick={this.toggle}
							/>
						</div>
					</Header>
					<Content
						style={{
							margin: "24px 16px",
							padding: 24,
							background: "#fdfdfd",
							minHeight: 280
						}}
					>
						{this.props.children}
					</Content>
				</Layout>
			</Layout>
		);
	}
}
