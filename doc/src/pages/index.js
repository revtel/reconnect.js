import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <figure>
          <img
            src="/reconnect.js/img/react-icon.png"
            alt="logo"
            style={{width: 320, height: 320}}
          />
        </figure>
        <h1 className="hero__title" style={{color: '#212121'}}>
          {siteConfig.title}
        </h1>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Try Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <section style={{padding: 40}}>
        <div className="container">
          <h2 style={{textAlign: 'center'}}>
            The Library For Helping You To Share States Between
          </h2>
          <h2 style={{textAlign: 'center'}}>Sibling Or Nested Components</h2>
        </div>
      </section>
    </Layout>
  );
}
