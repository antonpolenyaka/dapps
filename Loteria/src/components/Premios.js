import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import { Icon } from 'semantic-ui-react';
import tokens from '../imagenes/loteria.png';

class Tokens extends Component {
    async componentWillMount() {
        // Carga de Web3
        await this.loadWeb3();
        // Carga de datos de Blockchain
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('No hay ningún navegador detectado. Deberías considerar de usar Metamask!');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        console.log("Account:", this.state.account);
        const networkId = '5777'; // Ganache 5777, rinkeby 4, BSC 97
        console.log('Network id:', networkId);
        const networkData = contrato_loteria.networks[networkId];
        console.log("Network data:", networkData);

        if (networkData) {
            const abi = contrato_loteria.abi;
            console.log("abi", abi);
            const address = networkData.address;
            console.log("address", address);
            const contract = new web3.eth.Contract(abi, address);
            this.setState({ contract });
            console.log('contract', contract);
        } else {
            window.alert('El Smart Contract no se ha desplegado en la red!');
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: null,
            account: "",
            loading: false,
            errorMessage: "",
            comprador_tokens: "",
            cantidad: 0,
            balance_user: 0,
            direccion: ""
        }
    }

    // Funcion para realizar consulta de cual es el bote actual
    bote = async (mensaje) => {
        try {
            console.log(mensaje);
            const bote_loteria = await this.state.contract.methods.Bote().call();
            alert(parseFloat(bote_loteria));
        } catch (err) {
            this.setState({ errorMessage: err.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    // Funcion para consultar el precio del boleto
    precio_boleto = async (mensaje) => {
        try {
            console.log(mensaje);
            const precio = await this.state.contract.methods.PrecioBoleto().call();
            alert(parseFloat(precio));
        } catch (err) {
            this.setState({ errorMessage: err.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    // Funcion para realizar la compra de los tokens
    comprar_boletos = async (numBoletos, mensaje) => {
        try {
            console.log(mensaje);
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            alert("¡Mucha suerte!");
            await this.state.contract.methods.CompraBoleto(numBoletos).send({from: accounts[0]});
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});
        }
    }

    // TODO: visualizar boletos que tiene el usuario

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="https://antonp.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        DApp de Anton
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white">
                                <span id="account">
                                    Cuenta activa: {this.state.account}
                                </span>
                            </small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1>Loteria con tokens ERC-20</h1>
                                <h2>Premois de la Loteria</h2>
                                <a href='https://www.linkedin.com/in/antonpolenyaka/'
                                    target='_blank' rel='noopener noreferrer'>
                                    <p> </p>
                                    <img src={tokens} width='450px' height='400px' alt='' />
                                </a>

                                <p> </p>
                                <h3><Icon circular inverted color='red' name='eye' /> Bote de loteria</h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const mensaje = 'Consultar bote actual';
                                    this.bote(mensaje);
                                }
                                } className='mb-3'>
                                    <input type='submit' className='btn btn-block btn-danger btn-sm'
                                        value='CONSULTAR BOTE' />
                                </form>

                                <p> </p>
                                <h3><Icon circular inverted color='blue' name='dollar sign' /> Bote de loteria</h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const mensaje = 'Consulta del precio del boleto';
                                    this.precio_boleto(mensaje);
                                }
                                } className='mb-3'>
                                    <input type='submit' className='btn btn-block btn-primary btn-sm'
                                        value='CONSULTAR PRECIO' />
                                </form>

                                <p> </p>
                                <h3><Icon circular inverted color='green' name='payment' /> Comprar boletos de loteria</h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const numBoletos = this.numBoletos.value;
                                    const mensaje = 'Compra de boletos';
                                    this.comprar_boletos(numBoletos, mensaje);
                                }
                                } className='mb-3'>
                                    <input type='text' className='form-control mb-1'
                                        placeholder='Numero de tokens a comprar' 
                                        ref={(input) => this.cantidad = input } />

                                    <input type='submit' className='btn btn-block btn-success btn-sm'
                                        value='COMPRAR BOLETOS' />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tokens;