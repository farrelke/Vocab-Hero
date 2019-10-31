import * as React from "react";
import "./CountdownTimer.scss";
import { useState } from "react";
import { useInterval } from "../../../Hooks/useInterval";

type Props = {
  onDone: () => any;
  seconds: number;
};

const CountdownTimer = (props: Props) => {
  const [seconds, setSeconds] = useState(props.seconds);

  useInterval(() => {
    const newTime = seconds - 1;
    if (newTime === 0) {
      props.onDone();
    } else if (newTime < 0) {
      return;
    }
    setSeconds(newTime);
  }, 1000);

  return (
    <div
      className="CountdownTimer"
      // Add an extra second to make the animation look better
      style={{ ["--countdown-seconds"]: `${props.seconds + 1}s` } as any}
    >
      <div className="CountdownTimer__text">{seconds}s</div>
      <svg className="CountdownTimer__svg">
        <circle className="CountdownTimer__svgCircle" r="30" cx="60" cy="60" />
      </svg>
    </div>
  );
};

export default CountdownTimer;
