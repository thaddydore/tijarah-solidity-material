// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract Lottery {
   // instantiate the owner at the point of contract creation
   // create an array to store the address of the user
   address[] public playersList;
   address payable public owner;
   uint256 public lotteryPrice = playersList.length * 0.5 ether;
   // create a map to store players address and the players details
   struct User {
      address player;
      uint256 balance;
   }
   mapping(address => User) players;
   //create a method to add users to the lottery 
   constructor() payable {
      owner = payable(msg.sender);
   }

   event AddPlayers(address player, uint256 playersNumber);
   // create a method to add User to the lottery poll

   event Winner(address winner, uint256 amountWon);

   function addPlayers(address  payable  lotteryPlayer) public payable returns(bool) {

      require(msg.value >= 0.5 ether, "insufficient balance to enter the draw");

      owner.transfer(0.5 ether);
      User memory playerToAdd = User({player: lotteryPlayer, balance: lotteryPlayer.balance});
      playersList.push(lotteryPlayer);
      players[lotteryPlayer] = playerToAdd;
      
      emit AddPlayers(lotteryPlayer, playersList.length);
      return true;
   }


   // create a method to draw the lottery 
   function pickWiner()  _owner() public payable returns(address, uint256) {
      uint256 hash = uint256(keccak256(abi.encodePacked(block.coinbase, block.timestamp, msg.sender)));

      uint256 randomIndex = (hash % block.timestamp) * playersList.length;

      address payable winner = payable(playersList[randomIndex]);

      winner.transfer(lotteryPrice);
      emit Winner(winner, lotteryPrice);

      return (winner, randomIndex);
   }

   modifier _owner() {
      require(owner == msg.sender, "you must be the owner");
      _;
   }

}