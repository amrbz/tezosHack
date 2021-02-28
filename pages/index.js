import Head from 'next/head'
import { useState, useCallback, useRef } from 'react';
import { TempleWallet } from "@temple-wallet/dapp";
import usePromise from 'react-promise-suspense';

import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/signer';
import { useEffect } from 'react';
import { Divider, Progress, Typography, Button, InputNumber, Space, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
const { Title } = Typography;


export default function Home() {

  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(1000);
  const [rent, setRent] = useState(1700);
  const [buyOut, setBuyOyt] = useState(0);
  const [temple, setTemple] = useState();
  const [tezos, setTezos] = useState();
  const [storage, setStorage] = useState();
  const [contract, setContract] = useState();
  const [totalPrice, setTotalPrice] = useState(150000);
  const [clientShare, setClientShare] = useState(22500);

  const [dataSource, setDataSourse] = useState([
    {
      key: '2',
      date: 'October 2020',
      rent: `$${rent}`,
      buyout: "$2000",
    },
    {
      key: '1',
      date: 'September 2020',
      rent: `$${rent}`,
      buyout: null,
    },
  ])

  // const contractAddress = 'KT1SH1WQSAUii8kcjPpqV23TzRfaHew1jzuX';
  // const contractAddress = 'KT1WEc3BriQa1uJMDiyr7EaTvhuihmVoeeRZ';
  const contractAddress = 'KT19pVi9Ao69pfABqdG58MupUXqfx9FG39Pt';

  

  // const loadStorage = useCallback(async () => {
  //   if (counter) {
  //     const storage = await counter.storage();
  //     setStorage(storage.toString());
  //   }
    
  // }, [setStorage, counter]);

  // const useOnBlock = (tezos, callback) => {
  //   const blockHashRef = useRef();
  
  //   useEffect(() => {
  //     if (tezos) {
  //       let sub;
  //       spawnSub();
  //       return () => sub.close();
    
  //       function spawnSub() {
  //         sub = tezos.stream.subscribe('head');
    
  //         sub.on('data', (hash) => {
  //           if (blockHashRef.current && blockHashRef.current !== hash) {
  //             callback(hash);
  //           }
  //           blockHashRef.current = hash;
  //         });
  //         sub.on('error', (err) => {
  //           if (process.env.NODE_ENV === 'development') {
  //             console.error(err);
  //           }
  //           sub.close();
  //           spawnSub();
  //         });
  //       }
  //     }
  //   }, [tezos, callback]);
  // }

  // useEffect(() => {
  //   loadStorage();
  // }, [loadStorage]);

  useEffect(() => {
    (async () => {
      try {
        const available = await TempleWallet.isAvailable();
        if (!available) {
          throw new Error("Temple Wallet not installed");
        }
    
        const permission = await TempleWallet.getCurrentPermission();
        const wallet = new TempleWallet("Islamic DeFi", permission);
        console.log('wallet', wallet);

        if (wallet.connected) {
          setTemple(wallet);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (temple) {
      const tzs = temple.toTezos();
      setTezos(tzs);
    }
  }, [temple]);

  const connectWallet = () => {
    (async () => {
      const permission = await TempleWallet.getCurrentPermission();
      const wallet = new TempleWallet("Islamic DeFi", permission);
      if (!wallet.connected) {
        await wallet.connect("delphinet");
        setTemple(wallet);
      }
    })();
  }

  useEffect(() => {
    if (tezos) {
      // const fetchContract = (tezos, address) => tezos.wallet.at(address);
      // console.log('fetchContract', fetchContract);
      tezos.wallet.at(contractAddress).then(contract => {
        console.log('contract', contract);
        setContract(contract);
        // contract.storage().then(s => {
        //   console.log('STORAGE', s.toString());
        //   // contract.methods.increment(1).send();
        // });
        // setContract(contract);
      })
      // const counter = usePromise(fetchContract, [tezos, contractAddress]);
      // console.log('counter', counter);
    }
  }, [tezos])

  
  
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Rent',
      dataIndex: 'rent',
      key: 'rent',
    },
    {
      title: 'Buyout',
      dataIndex: 'buyout',
      key: 'buyout',
    },
  ];


  return (
    <div>
      <Head>
        <title>Islamic DeFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal
        title="Make a payment"
        visible={showModal}
        closable={false}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            key="ok"
            onClick={() => {
              // console.log('OK');
              // contract.methods.increment(1).send().then(res => {
              //   console.log('RES', res);
              //   setShowModal(false);
              // });
              // const secret = Buffer.from('');
              // const secret = parseInt('0xSomeSecret123' , 16);
              // console.log('s', secret);

              contract.methods.knownSecret('536f6d6553656563726574').send().then(res => {
                console.log('RES', res);

              });

              setShowModal(false);
              setClientShare(s => s + buyOut);

              const arr = [{
                key: '3',
                date: 'November 2020',
                rent: `$${rent}`,
                buyout: `$${buyOut}`,
              }].concat(dataSource);
              setDataSourse(arr);

              // setClientShare(s => s + buyOut);
              // setClientShare(s => s + buyOut);
              // setShowModal(false);
              
              // console.log('RES', res);
            }}
          >
            Confirm and pay ${rent + buyOut}
          </Button>,
        ]}
      >
        <p>RENT: ${rent}</p>
        <Space>
          BUYOUT:
          <InputNumber
            value={buyOut}
            onChange={(e) => setBuyOyt(e)}
            min={0}
          /> 
        </Space>

      </Modal>
      <main>
        <Title level={1}>Your house</Title>
        <Progress
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          percent={parseInt(clientShare / totalPrice * 100, 10)}
        />
        <Divider />
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => setShowModal(true)}
            disabled={temple}
            onClick={() => connectWallet()}
          >
            Connect wallet
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => setShowModal(true)}
            disabled={!temple}
          >
            Make a payment
          </Button>
        </Space>
        <Divider />
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />

      </main>
      <style jsx>{`
        main {
          max-width: 800px;
          margin: 0 auto;
          padding: 8em 0;
        }

        .fullBar {
          width: 100%;
          height: 32px;
          bacckgr
        }
      `}</style>
    </div>
  )
}
