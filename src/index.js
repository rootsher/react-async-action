import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const createInstance = (defaultProps = {}) => {
    class Async extends Component {
        static propTypes = {
            children: PropTypes.func.isRequired,
            action: PropTypes.func.isRequired,
            onDemand: PropTypes.bool,
        };

        static defaultProps = {
            onDemand: false,
            ...defaultProps,
        };

        state = {
            isLoading: false,
            response: null,
            error: null,
        };

        componentDidMount() {
            if (!this.props.onDemand) {
                this._handleAction();
            }
        }

        render() {
            return this.props.children({
                isPending: this._isPending(),
                isLoading: this.state.isLoading,
                response: this.state.response,
                error: this.state.error,
                run: () => this.props.onDemand && this._handleAction(),
                reload: () => this._handleAction(),
            });
        }

        _handleAction() {
            const action = Promise.resolve(this.props.action());

            this.setState({
                isLoading: true,
            });

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

        /**
         * Returns true if the request has not yet been fired.
         *
         * @returns {boolean}
         * @private
         */
        _isPending() {
            const { isLoading, response, error } = this.state;

            return (!isLoading && !response && !error);
        }
    }

    return Async;
};

export default createInstance();
