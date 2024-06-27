import React, { useState, useRef } from 'react';
import type { NextPage } from 'next'
import Page from '../components/layout/Page';
import BeanstalkStorage, { BeanstalkStorageRef, HistoryResult } from '../components/BeanstalkStorage';
import { shortenAddress } from '../lib/utils';

const shortenAllAddresses = (storagePath: string): string => {
  return storagePath.replaceAll(/[\[\.](0x[0-9a-fA-F]+)[\]\.]/g, (match, group1) => {
    return `[${shortenAddress(group1)}]`;
  });
}

const Storage: NextPage = () => {
  const [block, setBlock] = useState('');
  const [results, setResults] = useState<HistoryResult[]>([]);

  const storageRef = useRef<BeanstalkStorageRef>(null);

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlock(event.target.value);
  };

  // Submit if they pressed the Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      storageRef.current?.handleSubmit();
    }
  };

  const onStorageResult = (result: HistoryResult) => {
    setResults([
      result,
      ...results
    ]);
  }

  return (
    <Page>
      <div className="flex flex-col w-full h-full">
        <div style={{
          display: 'flex',
          flexDirection: 'row',
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
              onKeyDown={handleKeyDown}
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
            flex: 1
          }}>
            <BeanstalkStorage
              ref={storageRef}
              block={block.length > 0 && !isNaN(parseInt(block)) ? parseInt(block) : undefined}
              onResult={onStorageResult}
              // Use page native display below
              displayResult={false}
            />
          </div>
        </div>

        {results.length > 0 &&
          <div style={{
            overflowY: 'auto',
            marginTop: '10px',
            marginLeft: '50px'
          }}>
            {results.map((r: HistoryResult, idx: number) =>
              <div
                key={idx}
                style={{
                  padding: '5px',
                  border: '1px solid white',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <div style={{
                  flexBasis: '85px',
                  margin: '10px'
                }}>
                  {r.block}
                </div>
                <div style={{
                  flex: 1
                }}>
                  {shortenAllAddresses(r.inputPath)}
                  <br/>
                  {r.content.toString()}
                </div>
              </div>
            )}
          </div>
        }
      </div>
    </Page>
  )
}

export default Storage
