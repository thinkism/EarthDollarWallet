// Generated by CoffeeScript 1.10.0
angular.module('EarthDollarWallet', []).controller('EarthDollarCtrl', function($scope, $interval) {
  var connect, dialog, updateBalances;
  $scope.minterAccounts = [];
  $scope.amount = 0;
  $scope.recipientAddress = '';
  dialog = $('#modal');
  $scope.accounts = [];
  $scope.rpcConnected = true;
  this.EarthDollarWallets = {};
  connect = function() {
    var EarthDollarWalletsAbi, EarthDollarWalletsContract, account, i, j, len, ref, results;
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.accounts[0];
    EarthDollarWalletsAbi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "minterToRemove",
            "type": "address"
          }
        ],
        "name": "removeMinter",
        "outputs": [],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_value",
            "type": "uint256"
          }, {
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "mintCoin",
        "outputs": [],
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "minterAt",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          }, {
            "name": "_value",
            "type": "uint256"
          }, {
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "sendCoinFrom",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "newMinter",
            "type": "address"
          }
        ],
        "name": "addMinter",
        "outputs": [],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "changeOwner",
        "outputs": [],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_addr",
            "type": "address"
          }
        ],
        "name": "coinBalanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_value",
            "type": "uint256"
          }, {
            "name": "_to",
            "type": "address"
          }
        ],
        "name": "sendCoin",
        "outputs": [
          {
            "name": "_success",
            "type": "bool"
          }
        ],
        "type": "function"
      }, {
        "constant": true,
        "inputs": [],
        "name": "coinBalance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "type": "function"
      }, {
        "constant": true,
        "inputs": [],
        "name": "numMinters",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "type": "function"
      }, {
        "inputs": [],
        "type": "constructor"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "sender",
            "type": "address"
          }, {
            "indexed": false,
            "name": "receiver",
            "type": "address"
          }, {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "CoinTransfer",
        "type": "event"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "receiver",
            "type": "address"
          }, {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "CoinMinted",
        "type": "event"
      }
    ];
    EarthDollarWalletsContract = web3.eth.contract(EarthDollarWalletsAbi);
    this.EarthDollarWallets = EarthDollarWalletsContract.at('0x449c5b639e9852ada644ffaacfe325dfce6e6e0a');
    ref = web3.eth.accounts;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      account = ref[j];
      $scope.accounts.push({
        address: account,
        amount: parseInt(EarthDollarWallets.coinBalance.call({
          from: account
        }))
      });
      results.push((function() {
        var k, ref1, results1;
        results1 = [];
        for (i = k = 0, ref1 = EarthDollarWallets.numMinters.call(); k <= ref1; i = k += 1) {
          if (EarthDollarWallets.minterAt.call(i, {
            from: account
          }) === account) {
            $scope.isMinter = true;
            results1.push($scope.minterAccounts.push(account));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };
  updateBalances = (function(_this) {
    return function() {
      var account, entry, found, j, len, ref, results;
      $scope.rpcConnected = web3.isConnected();
      if (!web3.isConnected()) {
        connect();
        return;
      }
      ref = web3.eth.accounts;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        account = ref[j];
        found = false;
        results.push((function() {
          var k, len1, ref1, results1;
          ref1 = $scope.accounts;
          results1 = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            entry = ref1[k];
            if (account === entry.address) {
              entry.amount = parseInt(EarthDollarWallets.coinBalance.call({
                from: account
              }));
              results1.push(found = true);
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    };
  })(this);
  $interval(updateBalances, 1000);
  $scope.send = function(from, to, amount) {
    return EarthDollarWallets.sendCoin(amount, to, {
      from: from
    });
  };
  $scope.showMintDialog = function() {
    $scope.modalHeader = 'Mint coins';
    $scope.modalMode = 'mint';
    return dialog.modal();
  };
  $scope.showSendDialog = function(from) {
    $scope.modalHeader = 'Send coins from ' + from;
    $scope.modalMode = 'send';
    $scope.modalFrom = from;
    return dialog.modal();
  };
  return $scope.dialogOkButton = function() {
    if ($scope.modalMode === 'mint') {
      EarthDollarWallets.mintCoin($scope.amount, $scope.recipientAddress, {
        from: $scope.minterAccounts[0],
        gas: 100000
      });
    }
    if ($scope.modalMode === 'send') {
      EarthDollarWallets.sendCoin($scope.amount, $scope.recipientAddress, {
        from: $scope.modalFrom,
        gas: 100000
      });
    }
    return dialog.modal('hide');
  };
});
