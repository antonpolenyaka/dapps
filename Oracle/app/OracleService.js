// Llamada a las dependecias del proyecto

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const fetch = require('cross-fetch'); // node-fetch no podemos incluir con require, ya que es un modulo simple del JS

// Llamada a los archivos JSON
const contractJson = require('../build/contracts/Oracle.json');

// Instancia del web3
const web3 = new Web3('ws://127.0.0.1:7545');

const addressContract = '0x2aAE3C56431a7F89141Ea6cD6c71f1597589ebC7';
const contractInstance = new web3.eth.Contract(contractJson.abi, addressContract);
const private_key = Buffer.from('a050892ce61e3933e9f797eda99512f9ca3247192bf6c488b0cdb3c306387019', 'hex');
const address = '0xE006097Bb89376d7a57F85E697Cd9a58E0dAEBB9';

// Obtener el numero del bloque
web3.eth.getBlockNumber().then(n => listenEvent(n - 1));

function listenEvent(lastBlock) {
    console.log("called listenEvent(...) lastBlock="+lastBlock);
    contractInstance.events.__calbackNewData({}, { fromBlock: lastBlock, toBlock: 'latest' }, (err, event) => {
        if (event) {
            console.log("call updateData from listenEvent(...)");
            updateData();
        } else if (err) {
            console.log("error in listenEvent(...)");
            console.log(err);
        }
        //event ? updateData() : null;
        //err ? console.log(err) : null;
    })
}

function updateData() {
    console.log("called updateData()");

    // https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-11&api_key=DEMO_KEY';

    fetch(url)
    .then(response => response.json())
    .then(json => setDataContract(json.element_count));
}

function setDataContract(_value) {
    console.log("called setDataContract(...)");
    web3.eth.getTransactionCount(address, (err, txNum) => {
        contractInstance.methods.setNumberAsteroids(_value).estimateGas({}, (err, gasAmount) => {
                let rawTx = {
                    nonce: web3.utils.toHex(txNum),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('1.4', 'gwei')),
                    gasLimit: web3.utils.toHex(gasAmount),
                    to: addressContract,
                    value: '0x00',
                    data: contractInstance.methods.setNumberAsteroids(_value).encodeABI()
                }
                
                const tx = new Tx(rawTx);
                tx.sign(private_key);
                const serializedTx = tx.serialize().toString('hex');
                web3.eth.sendSignedTransaction('0x' + serializedTx);
            })
        })
}