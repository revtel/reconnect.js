import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Share States With Siblings',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: <>Share States With Siblings</>,
  },
  {
    title: 'Shate States With Nested Components',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: <>Shate States With Nested Components</>,
  },
  {
    title: 'Notify Children On Events',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: <>Notify Children On Events</>,
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
