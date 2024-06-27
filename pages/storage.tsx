import React, { useState } from 'react';
import type { NextPage } from 'next'
import Page from '../components/layout/Page';
import BeanstalkStorage, { HistoryResult } from '../components/BeanstalkStorage';
import { shortenAddress } from '../lib/utils';

const shortenAllAddresses = (storagePath: string): string => {
  return storagePath.replaceAll(/[\[\.](0x[0-9a-fA-F]+)[\]\.]/g, (match, group1) => {
    return `[${shortenAddress(group1)}]`;
  });
}

const Storage: NextPage = () => {
  const [block, setBlock] = useState('');
  const [results, setResults] = useState<HistoryResult[]>([]);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlock(event.target.value);
  };

  const onStorageResult = (result: HistoryResult) => {
    setResults([
      result,
      ...results
    ]);
  }

  return (
    <Page>
      <div style={{
        display: 'flex',
        width: '100%'
      }}>
        <div style={{
          margin: '0 10px 10px 0'
        }}>
          Block:
          <input
            type="text"
            value={block}
            placeholder="latest"
            onChange={handleBlockChange}
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '0 4px',
              width: '100px',
              marginLeft: '5px'
            }}
          />
        </div>
        
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <BeanstalkStorage
            block={block.length > 0 ? parseInt(block) : undefined}
            onResult={onStorageResult}
            // Use page native display below
            displayResult={false}
          />
          {results.length > 0 &&
            <div style={{
              marginTop: '10px',
              flex: 1,
              overflowY: 'auto'
            }}>
              {results.map((r: HistoryResult) =>
                <div style={{
                  padding: '5px',
                  border: '1px solid white'
                }}>
                  ({r.block}) {shortenAllAddresses(r.inputPath)}
                  <br/>
                  {r.content.toString()}
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </Page>
  )
}

export default Storage
