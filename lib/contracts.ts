import { Contract } from 'ethers-multicall';
import { provider } from './provider';
import { Beanstalk, Beanstalk__factory } from '../generated';
import { BEANSTALK } from './constants';

const beanstalkAbi = require('../contracts/abi/Beanstalk.json');

const contracts = {
  beanstalk: Beanstalk__factory.connect(BEANSTALK, provider),
  multi: {
    beanstalk: new Contract(BEANSTALK, beanstalkAbi) as unknown as Beanstalk,
  }
};

export default contracts;