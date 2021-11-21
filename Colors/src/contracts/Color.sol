pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Full.sol";

contract Color is ERC721Full {

    string[] public colors;
    mapping(string => bool) _colorsExists;
    
    constructor() public ERC721Full("Color", "COLOR") {}

    function mint(string memory color) public {
        require(_colorsExists[color] != true, 'Color already exist');
        uint id = colors.push(color);
        _mint(msg.sender, id);
        _colorsExists[color] = true;
    }
}