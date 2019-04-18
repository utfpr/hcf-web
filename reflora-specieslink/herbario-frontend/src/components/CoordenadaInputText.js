import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Col } from 'antd';
import masker from 'vanilla-masker';


class CoordenadaInputText extends Component {

    state = {
        valorSaida: '',

        graus: '',
        minutos: '',
        segundos: '',
        pontoCardeal: '',
    };

    aplicaMascaraNoCampo = (campo, mascara, valor) => {
        const valorMascarado = masker.toPattern(valor, mascara);
        this.setState({ [campo]: valorMascarado }, this.onStateChanged);
    }

    onStateChanged = () => {
        const { graus, minutos, segundos, pontoCardeal } = this.state;
        this.props.onChange(`${graus}°${minutos}'${segundos}"${pontoCardeal}`);
    }

    render() {
        return (
            <Row gutter={6}>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="48"
                        value={this.state.graus}
                        onChange={event => {
                            const { value } = event.target;
                            this.aplicaMascaraNoCampo('graus', '999', value);
                        }}
                    />
                </Col>
                <Col span={6}>
                    <Input
                        type="text"
                        placeholder="56"
                        value={this.state.minutos}
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
                        value={this.state.segundos}
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
                        value={this.state.pontoCardeal}
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
