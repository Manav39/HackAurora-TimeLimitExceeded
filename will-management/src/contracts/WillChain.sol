// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WillManagement {
    struct Beneficiary {
        address beneficiary;
        uint256 share; 
        bool isWithdrawn;
        string name;
    }

    struct Will {
        address owner;
        uint256 amount;
        uint256 releaseTime;
        uint256 willId;
        bool isVerified;
        uint256 createdAt;
        uint256 lastModified;
        string assetName;  
        string assetCategory; 
        Beneficiary[] beneficiaries;
    }

    uint256 public willCount;
    mapping(uint256 => Will) public wills;
    mapping(address => uint256[]) public ownerWills;
    mapping(address => uint256[]) public beneficiaryWills;
    mapping(address => uint256[]) public closedWills;

    event WillCreated(uint256 indexed willId, address indexed owner, uint256 amount, uint256 releaseTime, string assetName, string assetCategory);
    event BeneficiaryWithdrawn(uint256 indexed willId, address indexed beneficiary, uint256 amount);
    event WillModified(uint256 indexed willId, string assetName, string assetCategory); 
    event WillVerified(uint256 indexed willId, address indexed owner);

    modifier onlyOwner(uint256 willId) {
        require(wills[willId].owner == msg.sender, "Not the owner of the will");
        _;
    }

    modifier canWithdraw(uint256 willId, address beneficiary) {
        require(block.timestamp >= wills[willId].releaseTime, "Locking period not yet over");
        bool isListed = false;
        for (uint256 i = 0; i < wills[willId].beneficiaries.length; i++) {
            if (wills[willId].beneficiaries[i].beneficiary == beneficiary) {
                require(!wills[willId].beneficiaries[i].isWithdrawn, "Already withdrawn");
                isListed = true;
                break;
            }
        }
        require(isListed, "Not a beneficiary of this will");
        _; 
    }

    struct BeneficiaryData {
        address[] addresses;
        uint256[] shares;
        string[] names;
    }

    function createWill(
        uint256 _willId, 
        BeneficiaryData calldata beneficiaryData,
        uint256 _releaseTime,
        string calldata _assetName,
        string calldata _assetCategory
    ) external payable {
        require(msg.value > 0, "No assets sent for the will");
        require(_releaseTime > block.timestamp, "Release time must be in the future");
        require(beneficiaryData.addresses.length == beneficiaryData.shares.length, "Mismatched beneficiaries and shares");

        uint256 totalShare = 0;
        for (uint256 i = 0; i < beneficiaryData.shares.length; i++) {
            totalShare += beneficiaryData.shares[i];
        }
        require(totalShare == 100, "Total share percentages must equal 100");

        require(wills[_willId].owner == address(0), "Will ID already exists");

        Will storage newWill = wills[_willId];
        newWill.owner = msg.sender;
        newWill.amount = msg.value;
        newWill.releaseTime = _releaseTime;
        newWill.assetName = _assetName;
        newWill.assetCategory = _assetCategory;
        newWill.willId = _willId;
        newWill.createdAt = block.timestamp;
        newWill.lastModified = block.timestamp;
        newWill.isVerified = false;

        for (uint256 i = 0; i < beneficiaryData.addresses.length; i++) {
            newWill.beneficiaries.push(Beneficiary({
                beneficiary: beneficiaryData.addresses[i],
                share: beneficiaryData.shares[i],
                isWithdrawn: false,
                name: beneficiaryData.names[i]
            }));
            beneficiaryWills[beneficiaryData.addresses[i]].push(_willId);
        }

        ownerWills[msg.sender].push(_willId);

        emit WillCreated(_willId, msg.sender, msg.value, _releaseTime, _assetName, _assetCategory);
    }

    function modifyWill(
        uint256 _willId,
        string calldata _newAssetName,
        string calldata _newAssetCategory,
        BeneficiaryData calldata newBeneficiaryData,
        uint256 _newReleaseTime
    ) external onlyOwner(_willId) {
        Will storage existingWill = wills[_willId];
        
        existingWill.assetName = _newAssetName;
        existingWill.assetCategory = _newAssetCategory;

        require(newBeneficiaryData.addresses.length == existingWill.beneficiaries.length, "Beneficiary mismatch");

        for (uint256 i = 0; i < newBeneficiaryData.addresses.length; i++) {
            existingWill.beneficiaries[i].name = newBeneficiaryData.names[i];
            existingWill.beneficiaries[i].beneficiary = newBeneficiaryData.addresses[i];
            existingWill.beneficiaries[i].share = newBeneficiaryData.shares[i];
        }

        existingWill.releaseTime = _newReleaseTime;
        existingWill.lastModified = block.timestamp;

        emit WillModified(_willId, _newAssetName, _newAssetCategory);
    }

    function verifyWill(uint256 _willId) external {
        Will storage userWill = wills[_willId];
        require(!userWill.isVerified, "Will is already verified");

        userWill.isVerified = true;

        uint256 totalAmount = userWill.amount;
        for (uint256 i = 0; i < userWill.beneficiaries.length; i++) {
            uint256 amount = (totalAmount * userWill.beneficiaries[i].share) / 100;
            userWill.beneficiaries[i].isWithdrawn = true;

            payable(userWill.beneficiaries[i].beneficiary).transfer(amount);
            emit BeneficiaryWithdrawn(_willId, userWill.beneficiaries[i].beneficiary, amount);
        }

        closedWills[userWill.owner].push(_willId);

        emit WillVerified(_willId, userWill.owner);
    }

    function getOwnerWills(address _owner) external view returns (Will[] memory) {
        uint256[] memory willIds = ownerWills[_owner];
        Will[] memory result = new Will[](willIds.length);
        for (uint256 i = 0; i < willIds.length; i++) {
            result[i] = wills[willIds[i]];
        }
        return result;
    }

    function getBeneficiaryWills(address _beneficiary) external view returns (Will[] memory) {
        uint256[] memory willIds = beneficiaryWills[_beneficiary];
        Will[] memory result = new Will[](willIds.length);
        for (uint256 i = 0; i < willIds.length; i++) {
            result[i] = wills[willIds[i]];
        }
        return result;
    }

    function getClosedWills(address _owner) external view returns (uint256[] memory) {
        return closedWills[_owner];
    }

    function getWillDetails(uint256 _willId) external view returns (
        address owner,
        uint256 amount,
        uint256 releaseTime,
        uint256 willId,
        bool isVerified,
        uint256 createdAt,
        uint256 lastModified,
        string memory assetName,
        string memory assetCategory,
        Beneficiary[] memory beneficiaries
    ) {
        Will storage userWill = wills[_willId];

        return (
            userWill.owner,
            userWill.amount,
            userWill.releaseTime,
            userWill.willId,
            userWill.isVerified,
            userWill.createdAt,
            userWill.lastModified,
            userWill.assetName,
            userWill.assetCategory,
            userWill.beneficiaries
        );
    }

    function withdrawFunds(uint256 _willId) external canWithdraw(_willId, msg.sender) {
        Will storage userWill = wills[_willId];
        
        uint256 amount = 0;
        for (uint256 i = 0; i < userWill.beneficiaries.length; i++) {
            if (userWill.beneficiaries[i].beneficiary == msg.sender) {
                amount = (userWill.amount * userWill.beneficiaries[i].share) / 100;
                userWill.beneficiaries[i].isWithdrawn = true;  // Mark as withdrawn
                break;
            }
        }
        
        require(amount > 0, "No funds to withdraw");
        payable(msg.sender).transfer(amount);

        emit BeneficiaryWithdrawn(_willId, msg.sender, amount);
    }
    function deleteWill(uint256 _willId) external onlyOwner(_willId) {
    Will storage userWill = wills[_willId];

    // Ensure the will exists
    require(userWill.owner != address(0), "Will does not exist");

    // Remove the will from the ownerWills mapping
    uint256[] storage ownerWillsList = ownerWills[userWill.owner];
    for (uint256 i = 0; i < ownerWillsList.length; i++) {
        if (ownerWillsList[i] == _willId) {
            ownerWillsList[i] = ownerWillsList[ownerWillsList.length - 1];
            ownerWillsList.pop();
            break;
        }
    }

    // Remove the will from the beneficiaryWills mapping
    for (uint256 i = 0; i < userWill.beneficiaries.length; i++) {
        uint256[] storage beneficiaryWillsList = beneficiaryWills[userWill.beneficiaries[i].beneficiary];
        for (uint256 j = 0; j < beneficiaryWillsList.length; j++) {
            if (beneficiaryWillsList[j] == _willId) {
                beneficiaryWillsList[j] = beneficiaryWillsList[beneficiaryWillsList.length - 1];
                beneficiaryWillsList.pop();
                break;
            }
        }
    }

    // Remove the will from the closedWills mapping if it was already closed
    if (userWill.isVerified) {
        uint256[] storage closedWillsList = closedWills[userWill.owner];
        for (uint256 i = 0; i < closedWillsList.length; i++) {
            if (closedWillsList[i] == _willId) {
                closedWillsList[i] = closedWillsList[closedWillsList.length - 1];
                closedWillsList.pop();
                break;
            }
        }
    }

    // Delete the will from the wills mapping
    delete wills[_willId];

    emit WillModified(_willId, "", ""); // Emit an event to notify about the deletion
}

}
