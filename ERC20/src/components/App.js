import React, { Component } from 'react';
//import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import web3 from '../ethereum/web3'
import contrato_token from '../abis/main.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchain();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-ethereum browser detected. You should trying Metamask!");
    }
  }

  async loadBlockchain() {
    const web3 = window.web3;
    // Carga de cuentas
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log('account:', this.state.account);
    const networkId = '97'; // Ganache fixed id: 5777, Rinkeby Id: 4, BSC: 97
    console.log('networkId: ', networkId);
    const networkData = contrato_token.networks[networkId];
    console.log(networkData);
    if (networkData) {
      const abi = contrato_token.abi;
      console.log("abi: ", abi);
      const address = networkData.address;
      console.log("address: ", address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract: contract });
      // Direccion del contrato. call() cuando recibimos info, send() cuando enviamos info
      const smart_contract = await this.state.contract.methods.getContract().call();
      console.log('Direccion del Smart Contract:', smart_contract);
      this.setState({ direccion_smart_contract: smart_contract });
    } else {
      window.alert('El Smart Contract no se ha desplegado en la red');
    }
  }

  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      direccion_smart_contract: '',
      owner: '',
      direccion: '',
      cantidad: 0,
      loading: false,
      errorMessage: '',
      address_balance: ''
    };
  }

  envio = async (direccion, cantidad, ethers, mensaje) => {
    try {
      console.log(mensaje);
      const accounts = await web3.eth.getAccounts();
      console.log('web3.eth.getAccounts');
      await this.state.contract.methods.send_tokens(direccion, cantidad).send({ from: accounts[0], value: ethers });
      console.log('methods.send_tokens');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  balance_persona = async (address_balance, mensaje) => {
    try {
      console.log(mensaje);
      const balance_direccion = await this.state.contract.methods.balance_direccion(address_balance).call();
      alert(parseFloat(balance_direccion)); // Usamos pareseFloat por si trabajamos con cantidades altas
      this.setState({ address_balance: balance_direccion });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  balance_contrato = async (mensaje) => {
    try {
      console.log(mensaje);
      const balance_contract = await this.state.contract.methods.balance_contrato().call();
      alert(parseFloat(balance_contract)); // Usamos pareseFloat por si trabajamos con cantidades altas
      //this.setState({ address_balance: balance_direccion });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  generar = async (cantidad, mensaje) => {
    try {
      console.log(mensaje);
      const accounts = await web3.eth.getAccounts();
      console.log('web3.eth.getAccounts');
      await this.state.contract.methods.GenerarTokens(cantidad).send({ from: accounts[0] });
      console.log('methods.send_tokens');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp de Anton
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">
                  {this.state.direccion_smart_contract}
                </span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Compar tokens ERC-20</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const direccion = this.direccion.value;
                  const cantidad = this.cantidad.value;
                  const ethers = web3.utils.toWei(this.cantidad.value, 'ether');
                  const mensaje = 'Compra de tokens en ejecución...';
                  this.envio(direccion, cantidad, ethers, mensaje);
                }}>
                  <input type='text'
                    className='form-control mb-1'
                    placeholder='Dirección de destino'
                    ref={input => { this.direccion = input }} />

                  <input type='text'
                    className='form-control mb-1'
                    placeholder='Cantidad de tokens a comprar (1 token = 1 ether)'
                    ref={input => { this.cantidad = parseInt(input) }} />

                  <input type='submit'
                    className='btn btn-block btn-danger btn-sm'
                    value='Comprar tokens' />
                </form>

                &nbsp;

                <h1>Balance de tokens de un usuario</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const direccion = this.direccion.value;
                  const mensaje = 'Balance de tokens de un usuario en ejecución...';
                  this.balance_persona(direccion, mensaje);
                }}>
                  <input type='text'
                    className='form-control mb-1'
                    placeholder='Dirección de usuario'
                    ref={input => { this.direccion = input }} />

                  <input type='submit'
                    className='btn btn-block btn-success btn-sm'
                    value='Balance de tokens' />
                </form>

                &nbsp;

                <h1>Balance de tokens del contrato</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const mensaje = 'Balance de tokens del contrato en ejecución...';
                  this.balance_contrato(mensaje);
                }}>
                  <input type='submit'
                    className='btn btn-block btn-success btn-sm'
                    value='Balance contato' />
                </form>

                &nbsp;

                <h1>Generar tokens</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const cantidad = this.cantidad.value;
                  const mensaje = 'Generar tokens en ejecución...';
                  this.generar(cantidad, mensaje);
                }}>
                  <input type='text'
                    className='form-control mb-1'
                    placeholder='Cantidad de tokens a generar'
                    ref={input => { this.cantidad = input }} />

                  <input type='submit'
                    className='btn btn-block btn-danger btn-sm'
                    value='Generar tokens' />
                </form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
