# Console

Laconic console application.

User interface for submitting and reading records registered on Laconic.

## Development

* Clone the required repos:
  * [laconicd](https://git.vdb.to/cerc-io/laconicd)

    ```bash
    git clone git@git.vdb.to:cerc-io/laconicd.git
    ```

* Run the `laconicd` chain:
  * In [laconicd](https://git.vdb.to/cerc-io/laconicd) repo, start the chain

    ```bash
    ./scripts/init.sh clean
    ```

* Run the laconic-console app
  * From the root of this repo, run:

    ```bash
    yarn
    ```

    *NOTE*: There is a warning containing error while installing dependencies

    ```bash
    warning Error running install script for optional dependency: ".../laconic-console/node_modules/sodium-native: Command failed.
    Exit code: 1
    ...
    Error: ./configure exited with 127
    ```

    This can be ignored as it is an error for installing optional dependency

  * Start the app:

      ```bash
      CONFIG_FILE=config-local.yml yarn start
      ```

  * Open console at <http://localhost:8080>

  * To view records in the console, the test suite in registry-sdk can be run

    * Clone the [registry-sdk](https://git.vdb.to/cerc-io/registry-sdk) repo:

      ```bash
      git clone git@git.vdb.to:cerc-io/registry-sdk.git
      ```

    * In [registry-sdk](https://git.vdb.to/cerc-io/registry-sdk) repo, copy [.env.example](https://git.vdb.to/cerc-io/registry-sdk/blob/main/.env.example) file and create a `.env` file

      ```bash
      cp .env.example .env
      ```

    * Export the private key using:

      ```bash
      laconicd keys export alice --keyring-backend test  --unarmored-hex --unsafe
      ```

    * Copy the private key exported above and assign it to variable `PRIVATE_KEY` in the `.env` file.

    * Install dependencies

      ```bash
      yarn
      ```

    * Run the tests in registry-sdk repo:

      ```bash
      yarn test
      ```

      *NOTE*: One test from [util.test.ts](https://git.vdb.to/cerc-io/registry-sdk/blob/main/src/util.test.ts) fails as mentioned in the [PR](https://git.vdb.to/cerc-io/registry-sdk/pull/5#issuecomment-1299572012)

    * Open console at <http://localhost:8080> to view the records.
