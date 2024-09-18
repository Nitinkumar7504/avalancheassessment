// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FinanceManager {
    address payable public admin;
    uint256 public accountBalance;

    event FundsAdded(uint256 amount);
    event FundsRemoved(uint256 amount);

    constructor(uint initialFunds) payable {
        admin = payable(msg.sender);
        accountBalance = initialFunds;
    }

    function checkBalance() public view returns(uint256){
        return accountBalance;
    }

    function addFunds(uint256 _amount) public payable {
        uint _oldBalance = accountBalance;

        // ensure only admin can add funds
        require(msg.sender == admin, "Unauthorized: Only admin can add funds");

        // add funds to balance
        accountBalance += _amount;

        // check transaction success
        assert(accountBalance == _oldBalance + _amount);

        // emit event
        emit FundsAdded(_amount);
    }

    // custom error
    error LowBalance(uint256 accountBalance, uint256 removalAmount);

    function removeFunds(uint256 _removalAmount) public {
        require(msg.sender == admin, "Unauthorized: Only admin can remove funds");
        uint _oldBalance = accountBalance;

        if (accountBalance < _removalAmount) {
            revert LowBalance({
                accountBalance: accountBalance,
                removalAmount: _removalAmount
            });
        }

        // subtract the funds
        accountBalance -= _removalAmount;

        // ensure balance is correct
        assert(accountBalance == (_oldBalance - _removalAmount));

        // emit event
        emit FundsRemoved(_removalAmount);
    }
    
    function clearFunds() public {
        accountBalance = 0;

        emit FundsRemoved(accountBalance);
    }
}
