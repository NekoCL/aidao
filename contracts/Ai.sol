// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';

contract Ai is ERC20, Ownable, ERC20Permit, ERC20Votes {
  constructor() ERC20('AiDAO', 'AI') ERC20Permit('AiDAO') {}
  mapping(address => uint256) public balance;

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function burn(address from, uint256 amount) public virtual onlyOwner {
    _burn(from, amount);
  }

  function getETHBalance(address addr) public view returns (uint256) {
    return balance[addr];
  }

  function deposit() external payable {
    require(msg.value > 0, 'Cannot deposit 0 ETH');
    balance[msg.sender] += msg.value;
    mint(msg.sender, msg.value);
  }

  function burnAI(uint256 amount) public {
    require(amount > 0, 'Cannot burn 0');
    require(balance[msg.sender] >= amount, 'Cannot burn more than equivalent of ETH deposited');
    burn(msg.sender, amount);
    _sendETH(_msgSender(), amount);
  }

  function _sendETH(address to, uint256 amount) internal {
    balance[to] -= amount;
    (bool success, ) = to.call{value: amount}('');
    require(success, 'Failed to transfer ETH');
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

  function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._burn(account, amount);
  }
}