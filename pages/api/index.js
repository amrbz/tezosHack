// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

export default (req, res) => {
  
  // const Tezos = new TezosToolkit('https://tezos-testnet.amrbz.org');
  const Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');

  const FAUCET_KEY = {
    "mnemonic": [
      "excuse",
      "jazz",
      "they",
      "crack",
      "lab",
      "puppy",
      "divide",
      "staff",
      "they",
      "length",
      "prepare",
      "drip",
      "perfect",
      "cart",
      "poem"
    ],
    "secret": "915101fa5bf1418e37ef108277788188ebb3b8c5",
    "amount": "31004591934",
    "pkh": "tz1edeU3QZm88Z4P6Q4MaXGrbpMdatwG1oWG",
    "password": "qxhO0EyOPG",
    "email": "kznebbof.zudufhgu@tezos.example.org"
  };

  importKey(
    Tezos,
    FAUCET_KEY.email,
    FAUCET_KEY.password,
    FAUCET_KEY.mnemonic.join(' '),
    FAUCET_KEY.secret
  )
  .catch((e) => console.error(e));

  const amount = 3;
  const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

  console.log(`Transfering ${amount} ꜩ to ${address}...`);
  Tezos.contract
    .transfer({ to: address, amount: amount })
    .then((op) => {
      console.log(`Waiting for ${op.hash} to be confirmed...`);
      // println(`Waiting for ${op.hash} to be confirmed...`);
      return op.confirmation(1).then(() => op.hash);
    })
    .then((hash) => {
      // println(`Operation injected: https://delphi.tzstats.com/${hash}`)
      console.log('Done', hash);
    })
    .catch((error) => {
      // println(`Error: ${error} ${JSON.stringify(error, null, 2)}`)
      console.log('ERROR', error);
    });

  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
