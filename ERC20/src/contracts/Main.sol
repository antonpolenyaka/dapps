// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.10 <0.9.0;
import "./ERC20.sol";

contract Main {

    // Clase del token
    ERC20Basic private token;

    // Direccion del propietario
    address public owner;

    // Direccion del contrato
    address public contrato;

    constructor () {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getContract() public view returns(address) {
        return contrato;
    }

    function PrecioTokens(uint _numTokens) internal pure returns(uint) {
        return (_numTokens * (1 ether));
    }

    // En esta funciona no hay compra de los tokens, son gratuitos
    function send_tokens(address _destinatario, uint _numTokens) public payable {
        require(_numTokens <= 10, 'La cantidad de tokens es demasiado alta');
        uint coste = PrecioTokens(_numTokens);
        require(msg.value >= coste, 'Compra menos tokens o paga con mas ethers');
        // Diferencia de lo que cliente paga
        uint returnValue = msg.value - coste;
        // Devolvemos lo que sobra
        payable(msg.sender).transfer(returnValue); 
        // Obtener de balance de tokens disponible
        uint balance = balance_contrato();
        require(balance >= _numTokens, 'Compra un numero menor de tokens');
        token.transfer(_destinatario, _numTokens);
    } 

    function GenerarTokens(uint _numTokens) public onlyByOwner {
        token.increaseTotalSupply(_numTokens);
    }

    modifier onlyByOwner() {
        require(msg.sender == owner, 'No tiene permisos par ejecutar esta funcion');
        _;
    }

    function balance_direccion(address _direccion) public view returns(uint) {
        return token.balanceOf(_direccion);
    }

    function balance_contrato() public view returns(uint) {
        return token.balanceOf(contrato);
    }

}