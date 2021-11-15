// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    // API que vamos utilizar de la NASA: GET https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY 
    address owner;
    
    // Numero de asteroides
    uint public numberAsteroids;

    event __calbackNewData();
    
    constructor () {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender, 'No tiene permisos para ejecutar esta funcion.');
        _;
    }
    
    function update() public onlyOwner {
        emit __calbackNewData();
    }
    
    function setNumberAsteroids(uint _num) public onlyOwner {
        numberAsteroids = _num;
    }
    
}