'use client';

import { FEATURES } from './data/features-data';
import FeatureSpotlight from './feature-spotlight';

export default function FeaturesSection() {
  return (
    <section id="features">
      {FEATURES.map((feature, index) => (
        <FeatureSpotlight
          key={feature.title}
          feature={feature}
          index={index}
          reverse={index % 2 === 1}
          variant="light"
        />
      ))}
    </section>
  );
}
