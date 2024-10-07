import React, { useState } from 'react';
import type { NextPage } from 'next'
import CallsModule from '../components/CallsModule';
import { BigNumber, ethers } from 'ethers';
import Sunrises from '../components/Sunrises';
import FertQueue from '../components/FertQueue';
import BeanstalkStorage from '../components/BeanstalkStorage';
import { Storage } from '../generated/Beanstalk'; 
import Page from '../components/layout/Page';
import { shortenAddress } from '../lib/utils';
import { BEAN, BEANETH, BEANWSTETH, UNRIPE_BEAN, UNRIPE_LP } from '../lib/constants';

export const localeNumber = (decimals: number, maxFractionDigits?: number) => 
  (v: ethers.BigNumber) => parseFloat(ethers.utils.formatUnits(v, decimals)).toLocaleString('en-us', { maximumFractionDigits: maxFractionDigits ?? 3 });
export const percentNumber = (decimals: number, maxFractionDigits?: number) =>
  (v: ethers.BigNumber) => `${(parseFloat(ethers.utils.formatUnits(v, decimals))*100).toFixed(maxFractionDigits ?? 4)}%`

const COL_ITEM = "space-y-4 min-w-[300px]";

const Home: NextPage = () => {
  const [raw, setRaw] = useState(false);
  const rightHeader = (
    <>
      <label htmlFor="raw">Show raw values</label>
      <input id="raw" type="checkbox" checked={raw} onChange={() => setRaw(!raw)} />
    </>
  );
  return (
    <Page rightHeader={rightHeader}>
      <div className={COL_ITEM}>
        <CallsModule
          title="Sun"
          slots={[
            ['Paused', 'paused'],
            ['Season', 'season'],
            ['Season Time', 'seasonTime']
          ]}
          raw={raw}
        />
        <Sunrises />
        <CallsModule
          title="Owner"
          slots={[
            ['Owner', 'owner', shortenAddress],
          ]}
          raw={raw}
        />
        <BeanstalkStorage displayResult={true} />
      </div>
      <div className={COL_ITEM}>
        <CallsModule
          title="BDV"
          slots={[
            ["Beans", "bdv", localeNumber(6, 6), [BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Bean:wstETH", "bdv", localeNumber(6, 6), [BEANWSTETH, ethers.utils.parseUnits('1', 18)]],
            ["Unripe Beans", "bdv", localeNumber(6, 6), [UNRIPE_BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Unripe Bean:wstETH", "bdv", localeNumber(6, 6), [UNRIPE_LP, ethers.utils.parseUnits('1', 6)]],
            ["Deposited Bean BDV", "getTotalDepositedBdv", localeNumber(6, 0), [BEAN]],
            ["Deposited Bean:wstETH BDV", "getTotalDepositedBdv", localeNumber(6, 0), [BEANWSTETH]],
            ["Deposited Unripe Bean BDV", "getTotalDepositedBdv", localeNumber(6, 0), [UNRIPE_BEAN]],
            ["Deposited Unripe LP BDV", "getTotalDepositedBdv", localeNumber(6, 0), [UNRIPE_LP]],
            ["Total Deposited BDV", "getTotalBdv", localeNumber(6, 0)],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Convert"
          slots={[
            ["1 BEAN -> BEAN:wstETH",       "getAmountOut",   localeNumber(18, 6), [BEAN, BEANWSTETH, ethers.utils.parseUnits('1', 6)]],
            ["1 BEAN:wstETH -> BEAN",       "getAmountOut",   localeNumber(6, 6),  [BEANWSTETH, BEAN, ethers.utils.parseUnits('1', 18)]],
            ["1 urBEAN -> urBEAN:wstETH",   "getAmountOut",   localeNumber(6, 6),  [UNRIPE_BEAN, UNRIPE_LP, ethers.utils.parseUnits('1', 6)]],
            ["1 urBEAN:wstETH -> urBEAN",   "getAmountOut",   localeNumber(6, 6),  [UNRIPE_LP, UNRIPE_BEAN, ethers.utils.parseUnits('1', 6)]],
            ["Max: BEAN -> BEAN:wstETH",    "getMaxAmountIn", localeNumber(6, 0),  [BEAN, BEANWSTETH]],
            ["Max: BEAN:wstETH -> BEAN",    "getMaxAmountIn", localeNumber(18, 0), [BEANWSTETH, BEAN]],
            ["Max: urBEAN -> urBEANwstETH", "getMaxAmountIn", localeNumber(6, 0),  [UNRIPE_BEAN, UNRIPE_LP]],
            ["Max: urBEANwstETH -> urBEAN", "getMaxAmountIn", localeNumber(6, 0),  [UNRIPE_LP, UNRIPE_BEAN]],
          ]}
          raw={raw}
          multicall={false}
        />
      </div>
      <div className={COL_ITEM}>
        <CallsModule
          title="Silo"
          slots={[
            ["Bean Seeds", "tokenSettings", (value: Storage.SiloSettingsStructOutput) => {
              return localeNumber(6)(BigNumber.from(value.stalkEarnedPerSeason))
            }, [BEAN]],
            ["Bean:ETH Seeds", "tokenSettings", (value: Storage.SiloSettingsStructOutput) => {
              return localeNumber(6)(BigNumber.from(value.stalkEarnedPerSeason))
            }, [BEANETH]],
            ["Unripe Bean Seeds", "tokenSettings", (value: Storage.SiloSettingsStructOutput) => {
              return localeNumber(6)(BigNumber.from(value.stalkEarnedPerSeason))
            }, [UNRIPE_BEAN]],
            ["Unripe LP Seeds", "tokenSettings", (value: Storage.SiloSettingsStructOutput) => {
              return localeNumber(6)(BigNumber.from(value.stalkEarnedPerSeason))
            }, [UNRIPE_LP]],
            ["Bean Stem Tip", "stemTipForToken", undefined, [BEAN]],
            ["Bean:wstETH Stem Tip", "stemTipForToken", undefined, [BEANWSTETH]],
            ["Unripe Bean Stem Tip", "stemTipForToken", undefined, [UNRIPE_BEAN]],
            ["Unripe LP Stem Tip", "stemTipForToken", undefined, [UNRIPE_LP]],
            ["Average Grown Stalk/BDV", "getAverageGrownStalkPerBdv", localeNumber(4, 4)]
          ]}
          raw={raw}
        />
        <CallsModule
          title="Field"
          slots={[
            ["Pods", "totalPods", localeNumber(6, 0)],
            ["Soil", "totalSoil", localeNumber(6, 0)],
            ["Temperature", "yield", percentNumber(2, 0)],
            ["Harvested Pods", "totalHarvested", localeNumber(6, 0)],
            ["Harvestable Index", "harvestableIndex", localeNumber(6, 0)]
          ]}
          raw={raw}
        />
      </div>
      <div className={COL_ITEM}>
        <CallsModule
          title="Fertilizer"
          slots={[
            // Whether the Fertilizer system is being used
            ['Is Fertilizing?', 'isFertilizing', undefined, undefined, 'True if Beanstalk still owes beans to Fertilizer.'],
            // BPF indices
            ['Current BPF', 'beansPerFertilizer', localeNumber(6, 6), undefined, 'The current number of Beans paid per Fertilizer.'],
            ['End BPF', 'getEndBpf', localeNumber(6, 6), undefined, 'The BPF at which Fertilizer bought during this Season will stop receiving new Bean mints.'],
            // Amounts of Fertilizer, Beans, etc.
            ['Fertilized Beans', 'totalFertilizedBeans', localeNumber(6, 0), undefined, 'Beans paid to Fertilizer.'],
            ['Unfertilized Beans', 'totalUnfertilizedBeans', localeNumber(6, 0), undefined, 'Beans owed to Fertilizer.'],
            ['Fertilized + Unfertilized Beans', 'totalFertilizerBeans', localeNumber(6, 0), undefined, 'Fertilized Beans + Unfertilized Beans'],
            ['Active Fertilizer', 'getActiveFertilizer', localeNumber(0), undefined, 'The number of Fertilizer currently receiving Bean mints.'],
            // Recapitalization Progress
            ['Remaining Recap', 'remainingRecapitalization', localeNumber(6, 0), undefined, 'The number of USDC remaining to be raised. 1 USDC can purchase 1 FERT.'], // measured in USDC
            ['Recap Paid Percent', 'getRecapPaidPercent', percentNumber(6)],
          ]}
          raw={raw}
        />
        <CallsModule
          title="Unripe"
          slots={[
            ['Is Unripe? (BEAN)', 'isUnripe', undefined, [UNRIPE_BEAN]],
            ['Is Unripe? (BEAN:wstETH)', 'isUnripe', undefined, [UNRIPE_LP]],
            ['Total Underlying (BEAN)', 'getTotalUnderlying', localeNumber(6, 0), [UNRIPE_BEAN]],
            ['Total Underlying (BEAN:wstETH)', 'getTotalUnderlying', localeNumber(18, 0), [UNRIPE_LP]],
            ['% of Sprouts Fertilized', 'getRecapPaidPercent', percentNumber(6)],
            ["Underlying Per Unripe----------", 'isUnripe', undefined, [UNRIPE_BEAN]],
            ['Penalized Underlying per Unripe (BEAN)', 'getPenalty', localeNumber(6), [UNRIPE_BEAN]],
            ['Penalized Underlying per Unripe (BEAN:wstETH)', 'getPenalty', localeNumber(18), [UNRIPE_LP]],
            ['Underlying per Unripe (BEAN)', 'getUnderlyingPerUnripeToken', localeNumber(6), [UNRIPE_BEAN]],
            ['Underlying per Unripe (BEAN:wstETH)', 'getUnderlyingPerUnripeToken', localeNumber(18), [UNRIPE_LP]],
            ["Chop Rate-------------", 'isUnripe', undefined, [UNRIPE_BEAN]],
            ['Chop Rate (BEAN)', 'getPercentPenalty', percentNumber(6), [UNRIPE_BEAN]],
            ['Chop Rate (BEAN:wstETH)', 'getPercentPenalty', percentNumber(6), [UNRIPE_LP]],
            ['% Recapitalized (BEAN)', 'getRecapFundedPercent', percentNumber(6), [UNRIPE_BEAN]],
            ['% Recapitalized (BEAN:wstETH)', 'getRecapFundedPercent', percentNumber(6), [UNRIPE_LP]],
          ]}
          raw={raw}
        />
      </div>
      <div className={COL_ITEM}>
        <FertQueue />
      </div>
      <div className={COL_ITEM}>
        <CallsModule
          title="Season of Plenty"
          slots={[
            ["Rain", "rain", (value: Storage.RainStructOutput) => ({
              roots: localeNumber(12)(value.roots).toString(),
              pods: localeNumber(6)(value.pods).toString()
            })],
            ["Seasons", "time", (value: Storage.SeasonStructOutput) => ({
              lastSopStart: value.lastSop.toString(),
              lastSopEnd: value.lastSopSeason.toString(),
              rainStart: value.rainStart.toString(),
              raining: value.raining.toString(),
              sopTime: (value.withdrawSeasons + 1).toString()
            })]
          ]}
          raw={raw}
        />
      </div>
    </Page>
  )
}

export default Home
