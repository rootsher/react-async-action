import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const createInstance = (defaultProps = {}) => {
    const { Consumer, Provider } = React.createContext();

    function isFunction(children) {
        return (typeof children === 'function');
    }

    function renderChildren(children, data) {
        return isFunction(children) ? children(data) : children;
    }

    function consumerFactory(condition) {
        return ({ children }) => (
            <Consumer>
                {state => condition(state) && renderChildren(children, condition(state))}
            </Consumer>
        );
    }

    class Async extends Component {
        static propTypes = {
            children: PropTypes.oneOfType([
                PropTypes.arrayOf(PropTypes.node),
                PropTypes.node,
                PropTypes.func
            ]).isRequired,
            action: PropTypes.func.isRequired,
            transformer: PropTypes.func,
            onResolve: PropTypes.func,
            onReject: PropTypes.func,
            delay: PropTypes.number,
            onDemand: PropTypes.bool,
        };

        static defaultProps = {
            transformer: response => response,
            onResolve: response => {},
            onReject: error => {},
            onDemand: false,
            ...defaultProps,
        };

        static LOADING_STATUS = {
            PENDING: 'pending',
            LOADING: 'loading',
            LOADED: 'loaded',
            CANCELLED: 'cancelled',
        };

        static Pending = consumerFactory(state => (state.loadingStatus === Async.LOADING_STATUS.PENDING));
        static Loading = consumerFactory(state => (state.loadingStatus === Async.LOADING_STATUS.LOADING));

        static Resolved = consumerFactory(state => (
            (state.loadingStatus === Async.LOADING_STATUS.LOADED)
            && !state.error
            && (state.response !== undefined)
            && { response: state.response }
        ));

        static Rejected = consumerFactory(state => (
            (state.loadingStatus === Async.LOADING_STATUS.LOADED)
            && !state.response
            && (state.error !== undefined)
            && { error: state.error }
        ));

        _timeoutIdentifier = null;

        state = {
            loadingStatus: Async.LOADING_STATUS.PENDING,
            response: undefined,
            error: undefined,
        };

        componentDidMount() {
            if (!isFunction(this.props.action)) {
                throw new Error('"action" props must be a function');
            }

            if (!this.props.onDemand) {
                this._handleAction();
            }
        }

        render() {
            const { children, onDemand } = this.props;

            return (
                <Provider value={this.state}>
                    {renderChildren(children, {
                        ...this.state,
                        isPending: (this.state.loadingStatus === Async.LOADING_STATUS.PENDING),
                        cancel: () => this._cancel(),
                        run: () => onDemand && this._handleAction(),
                        reload: () => this._handleAction(),
                    })}
                </Provider>
            );
        }

        _handleAction() {
            const { action, transformer, onResolve, onReject, delay, ...rest } = this.props;
            let request = Promise.resolve();

            if (this.state.loadingStatus === Async.LOADING_STATUS.LOADING) {
                return;
            }

            clearTimeout(this._timeoutIdentifier);

            this.setState({
                loadingStatus: Async.LOADING_STATUS.LOADING,
                response: undefined,
                error: undefined,
            });

            if (delay) {
                request = this._timeout(delay);
            }

            request
                .then(this._cancelResolver(() => action(rest)))
                .then(this._cancelResolver(response => {
                    onResolve(response);

                    this.setState({
                        response: transformer(response || null),
                        loadingStatus: Async.LOADING_STATUS.LOADED,
                    });
                }))
                .catch(this._cancelResolver(error => {
                    onReject(error);

                    this.setState({
                        error: (error || null),
                        loadingStatus: Async.LOADING_STATUS.LOADED,
                    });
                }));
        }

        _cancel() {
            if (this.state.loadingStatus === Async.LOADING_STATUS.LOADING) {
                console.warn('Nothing to cancel...');

                return;
            }

            this.setState({
                loadingStatus: Async.LOADING_STATUS.CANCELLED,
            });
        }

        _timeout(ms) {
            return new Promise(resolve => {
                this._timeoutIdentifier = setTimeout(this._cancelResolver(resolve), ms);
            });
        }

        _cancelResolver(fn) {
            return (data) => ((this.state.loadingStatus === Async.LOADING_STATUS.CANCELLED) || fn(data));
        }
    }

    return Async;
};

export default createInstance();
