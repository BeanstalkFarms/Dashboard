import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Page from '../components/layout/Page';

const SUBGRAPHS = [
  'https://graph.node.bean.money/subgraphs/name/beanstalk',
  'https://graph.node.bean.money/subgraphs/name/beanstalk-dev',
  'https://graph.node.bean.money/subgraphs/name/beanstalk-testing',
  'https://graph.node.bean.money/subgraphs/name/bean',
  'https://graph.node.bean.money/subgraphs/name/bean-dev',
  'https://graph.node.bean.money/subgraphs/name/bean-testing',
  'https://graph.node.bean.money/subgraphs/name/basin',
  'https://graph.node.bean.money/subgraphs/name/basin-dev',
  'https://graph.node.bean.money/subgraphs/name/basin-testing',
  'https://graph.node.bean.money/subgraphs/name/beanft'
];

const DECENTRALIZED_QUERY_PREFIX = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/`;
const DECENTRALIZED_SITE_PREFIX = 'https://thegraph.com/explorer/subgraphs/';
const DECENTRALIZED_IDS = [
  'CQgB9aDyd13X6rUtJcCWr8KtFpGGRMifu1mM6k4xQ9YA',
  'Hqtmas8CJUHXwFf7acS2sjaTw6tvdNQM3kaz2CqtYM3V'
];

const checkSubgraphStatus = async (url: string) => {
  return (
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        query: `{
          _meta {
            block {
              number
            }
            deployment
            hasIndexingErrors
          }
          version(id: "subgraph") {
            subgraphName
            versionNumber
            chain
          }
        }`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((r) => r.json())
    .then((r) => r.data)
  );
}

const Subgraph : React.FC<{ queryUrl: string, webpageUrl: string, sgName: string | undefined, latestBlockNumberNetwork?: number }> = ({ queryUrl, webpageUrl, sgName, latestBlockNumberNetwork }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [intv, setIntv] = useState<null | NodeJS.Timer>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await checkSubgraphStatus(queryUrl)
    setData(data);
    setLoading(false);
  }, [queryUrl, sgName]);

  useEffect(() => {
    if (!intv) {
      load();
      const _intv = setInterval(load, 1000 * 10);
      setIntv(_intv);
    }
  }, [intv, load]);

  const copyDeployHash = () => {
    navigator.clipboard.writeText(data?._meta.deployment || '-');
  };

  return (
    <tr className="space-x-4">
      <td>
        <a href={webpageUrl} target="_blank" rel="noreferrer">
          {sgName}
        </a>
        <br/>
        <p style={{ fontSize: 'smaller', color: 'gray', marginLeft: '10px' }}>
          {data?.version?.subgraphName}
        </p>
      </td>
      <td>{data?._meta.block.number || '-'}</td>
      <td>{data?._meta.hasIndexingErrors.toString() || '-'}</td>
      <td>{data?.version?.versionNumber || '-'}</td>
      <td>{data?.version?.chain || '-'}</td>
      <td className="text-xs" onClick={copyDeployHash} style={{ cursor: 'pointer' }}>{data?._meta.deployment || '-'}</td>
      <td>{loading ? 'loading...' : null}</td>
    </tr>
  )
}

const Infra: NextPage = () => {
  return (
    <Page>
      <div>
        <table className="max-w-8xl border-separate px-4 py-2">
          <thead>
            <tr className="space-x-4">
              <th style={{padding: '0 80px 0 20px'}}>Name</th>
              <th style={{padding: '0 40px 0 20px'}}>Block</th>
              <th style={{padding: '0 20px 0 0'}}>Errors?</th>
              <th style={{padding: '0 20px 0 0'}}>Version</th>
              <th style={{padding: '0 70px 0 0'}}>Chain</th>
              <th>Deployment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SUBGRAPHS.map((url: string, idx: number) =>
                <React.Fragment key={url}>
                  {idx % 3 == 0 && <hr style={{ width: '475%', margin: '10px auto', display: 'block' }} />}
                  <Subgraph queryUrl={url} webpageUrl={url} sgName={url.split("/").pop()} latestBlockNumberNetwork={0} />
                </React.Fragment>
            )}

            <hr style={{ width: '475%', margin: '10px auto', display: 'block' }} />
            <strong>Decentralized Deployments</strong>

            {DECENTRALIZED_IDS.map((id: string, idx: number) =>
              <React.Fragment key={id}>
               <Subgraph queryUrl={DECENTRALIZED_QUERY_PREFIX + id} webpageUrl={DECENTRALIZED_SITE_PREFIX + id} sgName={idx === 0 ? 'beanstalk' : 'bean'} latestBlockNumberNetwork={0} />
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

export default Infra
