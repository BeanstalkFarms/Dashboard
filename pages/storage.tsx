import React, { useState } from 'react';
import type { NextPage } from 'next'
import Page from '../components/layout/Page';
import BeanstalkStorage from '../components/BeanstalkStorage';

const Storage: NextPage = () => {
  const [block, setBlock] = useState('');

  const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlock(event.target.value);
  };

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
          flex: 1
        }}>
          <BeanstalkStorage block={block}/>
        </div>
      </div>
    </Page>
  )
}

export default Storage
