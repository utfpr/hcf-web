import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Col } from 'antd';
import masker from 'vanilla-masker';
import decimalParaGrausMinutosSegundos from '../helpers/conversoes/Coordenadas';


class CoordenadaInputText extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coordenadas: '',
            valorSaida: '',
        };
    }

    // atualiza( ){
    //     this.state.coordenadas = decimalParaGrausMinutosSegundos(this.props.value, true);
    //     console.log("props", this.props.value);
    //     this.graus = this.state.coordenadas.graus;
    //     this.minutos = this.state.coordenadas.minutos;
    //     this.segundos = this.state.coordenadas.segundos;
    //     this.pontoCardeal = this.state.coordenadas.direcao;

    //     console.log(this.state.coordenadas);
    // }

    aplicaMascaraNoCampo = (campo, mascara, valor) => {
        const valorMascarado = masker.toPattern(valor, mascara);
        // console.log("meu valoorrrrrr", this.state.graus);
        this.setState({ [campo]: valorMascarado }, this.onStateChanged);
    }

    onStateChanged = () => {
        const { graus, minutos, segundos, pontoCardeal } = this.state;
        // console.log("minhas coordenadas\n\n\n", this.state);
        this.props.onChange(`${graus}°${minutos}'${segundos}"${pontoCardeal}`);
    }

    temValorValido = (valor1, valor2) => {
        console.log("valores\n\n\n\n",valor1, valor2);
        const invalido = valor1 === undefined || valor1 === null;
        return invalido ? valor2 : valor1;
    }

    render() {

        const semValoresEmPropriedades = !this.graus && !this.minutos && !this.segundos;
        const semValoresEmEstados = !this.state.graus && !this.state.minutos && !this.state.graus;
        if (this.props.value && semValoresEmPropriedades && semValoresEmEstados) {
            this.state.coordenadas = decimalParaGrausMinutosSegundos(this.props.value, true);
            this.aplicaMascaraNoCampo('graus', '999', this.state.coordenadas.graus)
            this.aplicaMascaraNoCampo('minutos', '99', this.state.coordenadas.minutos)
            this.aplicaMascaraNoCampo('segundos', '99,99', this.state.coordenadas.segundos)
            const pontoCardeal = this.state.coordenadas.direcao.replace(/[^WENS]+/i, '').toUpperCase();
            this.setState({ pontoCardeal }, this.onStateChanged);
            this.graus = this.state.coordenadas.graus;
            this.minutos = this.state.coordenadas.minutos;
            this.segundos = this.state.coordenadas.segundos;
            this.pontoCardeal = this.state.coordenadas.direcao;
        }

        return (
            <Row gutter={6}>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="48"
                        defaultValue={this.temValorValido(this.state.graus, this.graus)}
                        value={this.temValorValido(this.state.graus, this.graus)}
                        onChange={event => {
                            const { value } = event.target;
                            this.aplicaMascaraNoCampo('graus', '999', value);
                            // this.atualiza();
                        }}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="56"
                        defaultValue={this.temValorValido(this.state.minutos, this.minutos)}
                        value={this.temValorValido(this.state.minutos, this.minutos)}
                        onChange={event => {
                            const { value } = event.target;
                            this.aplicaMascaraNoCampo('minutos', '99', value);
                        }}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="15,5"
                        defaultValue={this.temValorValido(this.state.segundos, this.segundos)}
                        value={this.temValorValido(this.state.segundos, this.segundos)}
                        onChange={event => {
                            const { value } = event.target;
                            this.aplicaMascaraNoCampo('segundos', '99,99', value);
                        }}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="W"
                        defaultValue={this.temValorValido(this.state.pontoCardeal, this.pontoCardeal)}
                        value={this.temValorValido(this.state.pontoCardeal, this.pontoCardeal)}
                        maxLength="1"
                        onChange={event => {
                            const { value } = event.target;
                            const pontoCardeal = value.replace(/[^WENS]+/i, '')
                                .toUpperCase();

                            this.setState({ pontoCardeal }, this.onStateChanged);
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

CoordenadaInputText.propTypes = {
    onChange: PropTypes.func,
};

CoordenadaInputText.defaultProps = {
    onChange: () => { },
};

export default CoordenadaInputText;
