import axios from "axios";
import { NextPage } from "next";
import React, { useContext, useEffect } from "react";
import { Details } from "../components/Details";
import { Row } from "../components/Row";
import { CollectionContext } from "./_app";

export const CollectionButton: React.FC<{ name: string; count: number }> = ({
  name,
  count
}) => {
  const { setPayload } = useContext(CollectionContext);

  return (
    <button
      className="w-full px-2 focus:bg-gray-700 focus:outline-none"
      onDoubleClick={async () => {
        const { data } = await axios.get(
          `http://localhost:3100/api/servers/defaultcluster-35fsk.mongodb.net/databases/test/collections/${name}/query?q=%7B%7D`
        );
        setPayload(prev => ({ ...prev, collectionData: data }));
      }}
    >
      <Row>
        <span>{name}</span>
        <span>{count}</span>
      </Row>
    </button>
  );
};

export const Collection: React.FC = () => {
  const { payload } = useContext(CollectionContext);
  if (payload.collectionData?.results.length) {
    return (
      <div className="flex flex-col">
        {payload.collectionData?.results.map((document, key) => (
          <div className="m-2" key={key}>
            <pre className="bg-gray-700 p-1">
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Index: NextPage<{ data: any }> = ({ data }) => {
  const { payload, setPayload } = useContext(CollectionContext);
  useEffect(() => {
    setPayload(prev => ({ ...prev, servers: data }));
  }, [data]);
  console.log("data", data);
  console.log("payload", payload);
  return (
    <div className="flex">
      <div className="self-start mx-2 bg-gray-800 p-4 sticky top-0">
        {payload.servers.map((connections, key) => {
          return (
            <Details
              key={key}
              title={connections.name}
              data={connections.databases}
              children={({ data }) => (
                <Details
                  title={data.name}
                  data={data.collections}
                  children={({ data }) => (
                    <CollectionButton name={data.name} count={data.count} />
                  )}
                />
              )}
            />
          );
        })}
      </div>
      <div className="flex-auto mx-2 bg-gray-800 min-h-full p-4">
        <Collection />
      </div>
    </div>
  );
};

Index.getInitialProps = async () => {
  const { data } = await axios.get("http://localhost:3100/api/servers");
  console.log("data", data);
  return { data };
};

export default Index;
