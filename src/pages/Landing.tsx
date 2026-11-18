import { CourseHero } from '../components/CourseHero';
import { MarketingShell } from '../components/MarketingShell';

export function Landing() {
  return (
    <MarketingShell>
      <main>
        <CourseHero />
      </main>
    </MarketingShell>
  );
}
