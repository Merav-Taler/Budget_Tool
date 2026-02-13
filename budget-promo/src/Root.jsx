import {Composition} from 'remotion';
import {BudgetPromo} from './BudgetPromo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="BudgetPromo"
      component={BudgetPromo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
