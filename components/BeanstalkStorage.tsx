import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ContractStorage from '@beanstalk/contract-storage';
const storageLayout = require('../contracts/storage/BeanstalkStorageBIP47.json');
import { provider } from '../lib/provider';

export interface StorageResult {
  slot?: BigInt; // optional in case of 'ERROR' content
  content: any;
}

export interface HistoryResult extends StorageResult {
  block: string;
  inputPath: string;
}

export interface BeanstalkStorageRef {
  handleSubmit: () => void;
}

export interface StorageProps {
  block?: number;
  onResult?: (result: HistoryResult) => void;
  displayResult: boolean;
}

const beanstalk = new ContractStorage(provider, "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5", storageLayout);

const BeanstalkStorage = forwardRef<BeanstalkStorageRef, StorageProps>(({ block, onResult, displayResult }: StorageProps, ref) => {
  const [storageInput, setStorageInput] = useState('');
  const [storageResult, setStorageResult] = useState<StorageResult | null>(null);

  // Allows calling into handleButtonClick from a parent component using a ref
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      handleButtonClick();
    }
  }));

  const newResult = (result: StorageResult) => {
    setStorageResult(result);
    // Report the result to the parent (if applicable)
    onResult?.({
      ...result,
      block: block?.toString() ?? 'latest',
      inputPath: storageInput
    });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStorageInput(event.target.value);
  };

  const handleButtonClick = async () => {
    // Transform the input, remove brackets and quotes before constructing the path
    try {
      const path = storageInput.replace(/['\]"]/g, "").replaceAll('[', '.').split('.');
      
      let storageSlot = beanstalk;
      if (block) {
        storageSlot = storageSlot[block];
      }
      for (const field of path) {
        storageSlot = storageSlot[field];
      }

      let slot = storageSlot.slot;
      let content = await storageSlot;

      newResult({
        slot,
        content
      });
    } catch (e) {
      newResult({
        content: 'ERROR'
      });
    }
  };

  // Submit if they pressed the Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={storageInput}
        placeholder="s.a['0xabcd'].s.stalk"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: 'white', color: 'black', padding: '0 4px', width: '100%' }}
      />
      <br/>
      <button
        onClick={handleButtonClick}
        style={{
          borderColor: 'white',
          borderWidth: '2px',
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          color: 'white',
          padding: '4px 8px',
          margin: '10px 0 0 0',
          width: '100%',
          cursor: 'pointer'
        }}
      >
        Find in Storage
      </button>
      {
        displayResult && storageResult && 
        <div>
          {
            storageResult.slot &&
            <p
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              slot: 0x{storageResult.slot.toString(16)}
            </p>}
          <p
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            data: {storageResult.content.toString()}
          </p>
        </div>
      }
    </div>
  )
});
BeanstalkStorage.displayName = 'BeanstalkStorage';

export default BeanstalkStorage;