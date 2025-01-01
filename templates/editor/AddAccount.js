/* editor */

app.add_account_InitStyles = function() {
    app.addStyle('.dashboard_panel1{height:200px;width:300px;}');
}
app.add_account_PanelInit = function() {
    app.addPanel('dashboard_panel1', 'Add Account', 'Loading, please wait...');
}
app.add_account_DataLoad = function() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        let content = document.getElementById('dashboard_panel1-content');
        content.innerHTML = '<div><label for="accttype">Account Type: </label><select id="accttype"></select></div>'
        content.innerHTML += '<div>Bank: </div>'
        content.innerHTML += '<div>Account #: </div>'
        content.innerHTML += '<div><button>Add</button></div>'
        dataset = JSON.parse(this.responseText);
        for (const [key, value] of Object.entries(dataset)) {
            let thisOption = document.createElement('option')
            thisOption.text = thisOption.value = key;
            document.getElementById('accttype').appendChild(thisOption);
        }
    };
    
    uri = '/data?whatIwant=AccountTypeList'; // +encodeURIComponent('string')
    xmlhttp.open("GET", uri);
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send();
}
