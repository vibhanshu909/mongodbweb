import App from "next/app";
import React, { useState } from "react";
import Layout from "../Layout";
import "../styles/main.css";

export interface ICollectionContext {
  name: string;
  size: number;
  databases: Array<{
    name: string;
    size: number;
    dataSize: number;
    avgObjSize: number | null;
    storageSize: number;
    totalIndexSize: number;
    empty: boolean;
    collections: Array<{
      name: string;
      size: number;
      dataSize: number;
      avgObjSize: number | null;
      storageSize: number;
      capped: boolean;
      nIndexes: number;
      totalIndexSize: number;
      indexSizes: {
        [key: string]: number;
      };
    }>;
  }>;
}
interface ICollectionContextPayload {
  servers: ICollectionContext[];
  collectionData: {
    ok: boolean;
    results: Array<any>;
  } | null;
}
// setPayload: React.Dispatch<React.SetStateAction<ICollectionContextPayload>>;
export const CollectionContext = React.createContext({
  payload: {
    servers: [],
    collectionData: null
  },
  setPayload: () => null
} as { payload: ICollectionContextPayload; setPayload: React.Dispatch<React.SetStateAction<ICollectionContextPayload>> });

export const CollectionContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState({
    servers: [],
    collectionData: null
  });
  return (
    <CollectionContext.Provider
      value={{ payload: data, setPayload: setData as any }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <CollectionContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CollectionContextProvider>
    );
  }
}

export default MyApp;
