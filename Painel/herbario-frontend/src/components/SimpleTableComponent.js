import React, { Component } from 'react';
import { Table } from 'antd';

export default class SimpleTableComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			filteredInfo: null,
			sortedInfo: null,
			pagina: {
				total: 0,
				current: 1,
				defaultPageSize: 10
			},
		};


		this.columns = this.buildColumns(props, this.state);
	}

	componentWillReceiveProps(props) {
		if (props.metadados) {
			this.setState({
				pagina: {
					total: props.metadados.total,
					current: props.metadados.pagina,
					defaultPageSize: props.metadados.limite
				}
			})
		}
	}

	handleChange = (pagination, filters, sorter) => {
		console.log("Various parameters", pagination, filters, sorter);
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;

		this.setState({
			filteredInfo: filters,
			sortedInfo: sorter,
			pagina: pager
		});

		this.props.changePage(pagination.current);
	};
	clearFilters = () => {
		this.setState({ filteredInfo: null });
	};


	buildColumns = (props, state) => props.columns.map(item => {
		let itemColumn = {}
		if (itemColumn.key !== "acao") {
			itemColumn = {
				title: item.title,
				dataIndex: item.key,
				key: item.key,
			};
		} else {
			itemColumn = {
				title: item.title,
				dataIndex: item.key,
				key: item.key
			}
		}

		return itemColumn;
	});

	render() {
		return (
			<Table
				columns={this.columns}
				dataSource={this.props.data}
				onChange={this.handleChange}
				pagination={this.state.pagina}
				loading={this.props.loading}
				scroll={{ x: 800 }}
			/>
		);
	}
}
