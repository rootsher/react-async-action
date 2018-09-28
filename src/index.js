import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Async extends Component {
    state = {
        response: null,
        error: null,
        isLoading: true,
    };

    componentDidMount() {
        this._handleAction();
    }

    render() {
        return this.props.children({
            response: this.state.response,
            error: this.state.error,
            isLoading: this.state.isLoading,
        });
    }

    _handleAction() {
        const action = Promise.resolve(this.props.action());

        action
            .then(response => this.setState({
                response,
                isLoading: false,
            }))
            .catch(error => this.setState({
                error,
                isLoading: false,
            }));
    }

    static propTypes = {
        action: PropTypes.func.isRequired,
        children: PropTypes.func,
    };
}
