import React, { Component } from 'react';
import Input from './Input';
import Table from './Table';

import { httpClient } from './HttpClient';
import Keycloak from 'keycloak-js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            names: [],
            loading: true,
        };
    }

    componentDidMount() {
        const initOptions = {
            url: 'https://sso.nuwas.nn',
            realm: 'master',
            clientId: 'react-client',
        };

        const kc = new Keycloak(initOptions);

        kc.init({
            onLoad: 'login-required',
            checkLoginIframe: true,
            pkceMethod: 'S256',
        })
            .then(auth => {
                if (auth) {
                    console.info('Authenticated');
                    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

                    kc.onTokenExpired = () => {
                        console.log('Token expired, refreshing...');
                        kc.updateToken(30)
                            .then(refreshed => {
                                if (refreshed) {
                                    console.log('Token refreshed');
                                    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;
                                } else {
                                    console.warn('Token is still valid.');
                                }
                            })
                            .catch(err => {
                                console.error('Failed to refresh token', err);
                            });
                    };
                } else {
                    window.location.reload();
                }
            })
            .catch(err => {
                console.error('Authentication failed', err);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    onAddClick = (name, nickname) => {
        this.setState(prevState => {
            const result = prevState.names.map(nameData => {
                if (nameData.name === name) {
                    return { name, nickname };
                }
                return nameData;
            });
            if (!result.some(nameData => nameData.name === name)) {
                result.push({ name, nickname });
            }
            return { names: result };
        });
    };

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        }

        return (
            <div className="App">
                <Input onAddClick={this.onAddClick} />
                <Table names={this.state.names} />
            </div>
        );
    }
}

export default App;
