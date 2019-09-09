### Requirements
1. node --version == v10.15.3
2. npm --version == 6.10.3
3. lite-server (same as pet-shop truffle box)

## Development

1. Clone Repository:

    ```
    git clone https://github.com/myanzik/Certify.git
    ```
2. install dependencies:

    ```
    npm install
    ```

3. start testrpc:

    ```
    testrpc
    ```
    If testrpc not installed then enter:
    ```
    npm install -g ethereumjs-testrpc
    ```
4. migrate to local testnet:
    ```
    truffle migrate
    ```
5. update the smart contract address in src/app.js

6. Build a project by running:
    ```
    npm run build:client
    ```

7. start frontend server:
    ```
    npm run dev
    ```
    Now you should see lite server running

## Deployment to ropsten

1. Update your mnemonic key in truffle-config.js
    Note: If you have real ether in your wallet never upload mnemonic key or private key.
            you can put it in .env and export it to truffle-config.js

2. Run truffle deploy --network ropsten
    ```
    truffle deploy --network ropsten
    ```

3. update the smart contract address in src/app.js

4. rebuild frontent scripts:
    ```
    npm run build:client
    ```

5. run npm run dev:
    ```
    npm run dev
    ```
    OR
    
    Deploy public/ frontend to your server and run.
