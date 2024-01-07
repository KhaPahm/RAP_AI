module.exports = { 
    StringIsNullOrEmpty(data) {
        if(data == null || data == "") return true;
        return false;
    }
}