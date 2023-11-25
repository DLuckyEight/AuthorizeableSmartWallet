// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SmartWallet is Ownable {
    //IERC20 token;

    uint256[] tokendeposits; // to store token amounts deposited/credited/added to this wallet
    mapping(address => uint256) ethdeposits; // to store eth amounts deposited/credited/added to this wallet 

    mapping(address => bool) private isRegisteredAddress;

    enum AuthorizationStatus{
		Inactive,
        Active
	}

    struct RegisteredAddress{
		address id; 
		AuthorizationStatus status;
	}

    RegisteredAddress[] addresses;	

    constructor() {
        addresses.push(RegisteredAddress(owner(), AuthorizationStatus.Active));
        isRegisteredAddress[owner()] = true;
    }

   /*
    constructor(address _tokenaddress) {
        addresses.push(RegisteredAddress(owner(), AuthorizationStatus.Active));
        isRegisteredAddress[owner()] = true;

        token = IERC20(_tokenaddress);
    }
    */

    // register a new authorized address
    function registerNewAddress(address _address) public onlyOwner{
        require(isRegisteredAddress[_address] == false, "The address has been registered.");
        require(_address != owner(), "The address must be different to the owner's address.");

        addresses.push(RegisteredAddress(_address, AuthorizationStatus.Active)); // A new address is registered with active authorization.
		
		isRegisteredAddress[_address] = true;
    }

    // get an address index
    function getAddressIndex(address _address) private view returns(uint){
		for (uint i = 0; i < addresses.length; i++) {
            
            if (addresses[i].id == _address) { return i; }
        } 
        revert("The address is not found.");      
    }

    // revoke an authorization from an address
    function revokeAuthorization(address _address) public onlyOwner{
        require(isRegisteredAddress[_address] == true, "The address has not been registered.");
        addresses[getAddressIndex(_address)].status = AuthorizationStatus.Inactive;
    }

    // re-activate an authorization status of an address
    function activateAuthorization(address _address) public onlyOwner{
        require(isRegisteredAddress[_address] == true, "The address has not been registered.");
        addresses[getAddressIndex(_address)].status = AuthorizationStatus.Active;
    }

    // show all registered addresses
	function showAddressList() public view returns(RegisteredAddress[] memory){
		return addresses;
	}

    /* ======== TOKEN FUNCTIONS - SECTION START ======== */

    // deposit tokens to this smart contract wallet    
    function depositToken(address _token, uint256 _amount) public {
        IERC20(_token).transferFrom(owner(), address(this), _amount);
        tokendeposits.push(_amount);
    }

    // show historical token deposit
	function showTokenDeposits() public view returns(uint256[] memory){
		return tokendeposits;
	}
  
    // withdraw token to owner
    function withdrawTokenToOwner(address _token, uint256 _amount) external onlyOwner{
        IERC20(_token).transfer(owner(), _amount);
    }

    // get token balance
    function getTokenBalance(address _token) public view returns(uint256){
        return IERC20(_token).balanceOf(address(this));
    }

    /* ======== TOKEN FUNCTIONS - SECTION END ======== */

    /* ======== ETH FUNCTIONS - SECTION START ======== */

    // https://docs.alchemy.com/docs/solidity-payable-functions

    // deposit ETH to this smart contract wallet    
    receive() external payable {
        ethdeposits[msg.sender] += msg.value;
    }

    // withdraw ETH to owner
    function withdrawEthToOwner(uint256 _amount) public {
        address payable to = payable(owner());
        to.transfer(_amount);
    }

    // show historical ETH deposits
	function showEthDeposits(address _address) public view returns(uint256){
		return ethdeposits[_address];
	}

    // get ETH balance
    function getETHBalance() public view returns(uint256){
        return address(this).balance;
    }

    /* ======== ETH FUNCTIONS - SECTION END ======== */

    // show caller's address
    // function getCallerAddress() public view returns(address){
    //    return address(msg.sender);
    //}
}