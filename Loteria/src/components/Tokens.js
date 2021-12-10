import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import {Icon} from 'semantic-ui-react';
import tokens from '../imagenes/tokens.png';

class Tokens extends Component {
    async componentWillMount() {
        // Carga de Web3
        await this.loadWeb3();
        // Carga de datos de Blockchain
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('No hay ningún navegador detectado. Deberías considerar de usar Metamask!');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        console.log("Account:", this.state.account);
        const networkId = '5777'; // Ganache 5777, rinkeby 4, BSC 97
        console.log('Network id:', networkId);
        const networkData = contrato_loteria.networks[networkId];
        console.log("Network data:", networkData);

        if(networkData) {
            const abi = contrato_loteria.abi;
            console.log("abi", abi);
            const address = networkData.address;
            console.log("address", address);
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract});
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
            errorMessage: ""
        }
    }

    // Funcion para realizar la compra de los tokens
    envio = async (comprador_tokens, cantidad, ethers, mensaje) => {
        try {
            console.log(mensaje);
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            await this.state.contract.methods.CompraTokens(comprador_tokens, cantidad).send({from: accounts[0], value: ethers});
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});
        }
    }

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
                    <h2>Gestión y control de tokens de la Loteria</h2>
                    <a href='https://www.linkedin.com/in/antonpolenyaka/'
                        target='_blank' rel='noopener noreferrer'>
                        <p> </p>
                        <img src={tokens} width='450px' height='400px' alt='' />
                    </a>
                    <p> </p>
                    <h3><Icon circular inverted color='red' name='euro' /> Compra tokens ERC-20</h3>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        const comprador_tokens = this.comprador_tokens.value;
                        const cantidad = this.cantidad.value;
                        const web3 = window.web3;
                        const ethers = web3.utils.toWei(this.cantidad.value, 'ether');
                        const mensaje = 'Compra de tokens en ejecución';
                        this.envio(comprador_tokens, cantidad, ethers, mensaje);
                    }
                    } className='mb-3'>
                        <input type='text' className='form-control mb-1'
                            placeholder='Dirección de envio de los tokens' 
                            ref={(input) => this.comprador_tokens = input } />

                        <input type='text' className='form-control mb-1'
                            placeholder='Numero de tokens a comprar' 
                            ref={(input) => this.cantidad = input } />

                        <input type='submit' className='btn btn-block btn-danger btn-sm'
                            value='Comprar tokens' />
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