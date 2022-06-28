// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

interface IERC20 {
    function balanceOf(address owner) external view returns (uint);
}

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }
}


contract Playground {
    address public owner;

    modifier onlyOwner {
        require(msg.sender == owner, "!owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function withdrawEther(address recipient) public onlyOwner {
        payable(address(recipient)).transfer(address(this).balance);
    }

    function withdrawTokens(address token, address recipient) public onlyOwner {
        uint balance = IERC20(token).balanceOf(address(this));
        TransferHelper.safeTransfer(token, recipient, balance);
    }
    
    fallback () external {}
    receive() external payable {}
}