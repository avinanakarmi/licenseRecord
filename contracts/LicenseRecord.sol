pragma solidity ^0.5.0;

contract LicenseRecord{
    address officer;
    address owner;
    uint public userCount;
    // string status;
    enum licenseLevel {none,registered, g1, g2, g}

    struct user{
        address licenseNumber;
        string name;
        string phone;
        licenseLevel level;
    }
    
    constructor() public {
        officer = msg.sender;
    }
    
    modifier onlyOfficer(){
        require(msg.sender == officer, "Access Denied!!!");
        _;
    }
    
    mapping (address => user) public userRecord;

    
    function register(string memory _name, string memory _phone) public {
            require(!checkRegistration(msg.sender), "Already Registered.");
            address _uid = msg.sender;
            userRecord[_uid].name = _name;
            userRecord[_uid].phone = _phone;
            userRecord[_uid].level = licenseLevel.registered;
            userCount++;
        }
    
    function checkRegistration(address _uid) private view returns(bool){
        if(userRecord[_uid].level == licenseLevel.registered){
            return true;
        }
    }
    
    function issueG1(address _uid, bool _status) onlyOfficer public {
        require(checkRegistration(_uid), "Candidate hasn't registered yet.");
        if(_status  == true){
            userRecord[_uid].licenseNumber = _uid;
            userRecord[_uid].level = licenseLevel.g1;
        }
    }
    
    function checkG1(address _uid) private view returns(bool){
        if(userRecord[_uid].level == licenseLevel.g1){
            return true;
        }
    }
    
    function issueG2(address _uid, bool _status) onlyOfficer public {
        require(checkG1(_uid), "Candidate hasn't passed Written Examination");
        if(_status  == true){
            userRecord[_uid].licenseNumber = _uid;
            userRecord[_uid].level = licenseLevel.g2;
        }
    }
    
    function checkG2(address _uid) private view returns(bool){
        if(userRecord[_uid].level == licenseLevel.g2){
            return true;
        }
    }
    
    function issueG(address _uid, bool _status) onlyOfficer public {
        require(checkG2(_uid), "Candidate hasn't passed Trial Examination");
        if(_status  == true){
            userRecord[_uid].licenseNumber = _uid;
            userRecord[_uid].level = licenseLevel.g;
        }
    }
    
    function validate(address _uid) public view returns(string memory status){
        if (userRecord[_uid].level == licenseLevel.g){
            return "Valid";
        }
        else {
            return "Please check status to know more info.";
        }
    }
    
    function checkStatus(address _uid) public view returns(string memory Level){
        if(userRecord[_uid].level == licenseLevel.none){
            return "Not Registered";
        }
        else{
            if(userRecord[_uid].level == licenseLevel.registered){
            return "Registered but No Examination Passed";
        }
        else{
            if(userRecord[_uid].level == licenseLevel.g1){
            return "G1";
        }
        else {
            if(userRecord[_uid].level == licenseLevel.g2){
            return "G2";
        }
        else {
            if(userRecord[_uid].level == licenseLevel.g){
            return "G";
        }
        }
        }
        }
    }
    
}
    function isOfficer() public view returns(bool) {
        if(msg.sender == officer) {
            return true;
        }
        return false;
    }

    //function getAll() public view returns (address[] memory users){
    //    return userList;
    //}
}
