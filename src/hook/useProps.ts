import { useCallback, useEffect, useMemo, useState } from 'react';
import { Props, TLog, Web3Provider } from '../types';
import { message, sleep } from '../utils/general';
import { getProvider, sendTransaction } from '../utils';
import { ethers } from 'ethers';
let accounts = [];
const useProps = (): Props => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [logs, setLogs] = useState<TLog[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  useEffect(() => {
    (async () => {
      // sleep for 100 ms to give time to inject
      await sleep(100);
      setProvider(getProvider());
    })();
  }, []);

  useEffect(() => {
    if (!provider) return;

    window.ethereum.on('connect', (connectionInfo: { chainId: string }) => {
      handleGetBalance();
      createLog({
        status: 'success',
        method: 'connect',
        message: `Connected to chain: ${connectionInfo.chainId}`,
      });
    });

    window.ethereum.on('disconnect', () => {
      createLog({
        status: 'warning',
        method: 'disconnect',
        message: 'lost connection to the rpc',
      });
    });

    window.ethereum.on('accountsChanged', (newAccounts: String[]) => {
      if (newAccounts) {
        createLog({
          status: 'info',
          method: 'accountChanged',
          message: `Switched to account: ${newAccounts}`,
        });
        accounts = newAccounts;
      } else {
        /**
         * In this case dApps could...
         *
         * 1. Not do anything
         * 2. Only re-connect to the new account if it is trusted
         *
         * ```
         * provider.send('eth_requestAccounts', []).catch((err) => {
         *  // fail silently
         * });
         * ```
         *
         * 3. Always attempt to reconnect
         */

        createLog({
          status: 'info',
          method: 'accountChanged',
          message: 'Attempting to switch accounts.',
        });

        provider.send('eth_requestAccounts', []).catch((error) => {
          createLog({
            status: 'error',
            method: 'accountChanged',
            message: `Failed to re-connect: ${error.message}`,
          });
        });
      }
    });
  }, [provider, createLog]);

  /** eth_sendTransaction */
  const handleEthSendTransaction = useCallback(async () => {
    if (!provider) return;

    try {
      // create the transaction object
      const tx = {
        to: '0xFA449279c2B0521574DAb9ffB4F2Ab41B5083585',
        value: ethers.utils.parseEther('0.01'),
        gasPrice: ethers.utils.parseUnits('0.0000001', 'ether'), // sử dụng giá gas mặc định
        gasLimit: 50000, // giới hạn gas là 50000
        nonce: await provider.getTransactionCount(accounts[0]),
      };

      // send the transaction up to the network
      const signer = provider.getSigner();
    const check =  await signer.checkTransaction(tx)
      await signer
        .signTransaction(check)
        .then(async (result) => {
          if (result) {
            const transaction = await signer.sendTransaction(tx);
            createLog({
              status: 'info',
              method: 'eth_sendTransaction',
              message: 'Đang gửi...',
            });
            const receipt = await provider.waitForTransaction(transaction.hash);
            createLog({
              status: 'info',
              method: 'eth_sendTransaction',
              message: `Sending transaction: ${JSON.stringify(transaction)}
             Status transaction: ${receipt.status === 1 ? 'Thành công' : 'Thất bại'}`,
            });
            const txReceipt = await transaction.wait(1); // 1 is number of blocks to be confirmed before returning the receipt
            createLog({
              status: 'success',
              method: 'eth_sendTransaction',
              message: `TX included: ${JSON.stringify(txReceipt)}`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'eth_sendTransaction',
        message: error.message,
      });
    }
  }, [provider, createLog]);

  /** GetBlance */
  const handleGetBalance = useCallback(async () => {
    if (!provider) return;
    try {
      const signer = provider.getSigner();
      const balance = await signer.getBalance(accounts[0]);
      const balanceInWei = balance.toString(); // số dư trong Wei
      const balanceInEth = ethers.utils.formatEther(balanceInWei);
      createLog({
        status: 'success',
        method: 'getBalance',
        message: `Balance: ${JSON.stringify(balanceInEth)} BNB`,
      });
      setBalance(balanceInEth);
    } catch (error) {
      createLog({
        status: 'error',
        method: 'getBalance',
        message: error.message,
      });
    }
  }, [provider, createLog]);

  /** SignMessage */
  const handleSignMessage = useCallback(async () => {
    if (!provider) return;
    try {
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed: ${JSON.stringify(signature)}`,
      });
      return signature;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [provider, createLog]);
  /** SignTransaction */
  const handleSignTransaction = useCallback(
    async (transaction) => {
      if (!provider) return;
      try {
        const signer = provider.getSigner();
        const signTransaction = await signer.signTransaction(transaction);
        createLog({
          status: 'success',
          method: 'signTransaction',
          message: `Message signed: ${JSON.stringify(signTransaction)}`,
        });
        return signTransaction;
      } catch (error) {
        createLog({
          status: 'error',
          method: 'signTransaction',
          message: error.message,
        });
      }
    },
    [provider, createLog]
  );
  /** Connect */
  const handleConnect = useCallback(async () => {
    if (!provider) return;

    try {
      accounts = await provider.send('eth_requestAccounts', []);
      createLog({
        status: 'success',
        method: 'connect',
        message: `connected to account: ${accounts[0]}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'connect',
        message: error.message,
      });
    }
  }, [provider, createLog, accounts]);

  const connectedMethods = useMemo(() => {
    return [
      {
        name: 'Send Transaction',
        onClick: handleEthSendTransaction,
      },
      {
        name: 'Sign Message',
        onClick: handleSignMessage,
      },
      {
        name: 'Reconnect',
        onClick: handleConnect,
      },
    ];
  }, [handleEthSendTransaction, handleSignMessage]);

  return {
    address: accounts[0],
    connectedMethods,
    balance,
    handleConnect,
    provider,
    logs,
    clearLogs,
  };
};
export default useProps;
