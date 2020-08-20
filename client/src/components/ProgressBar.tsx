import React from "react";

type ProgressBarProps = {
  percentage: number;
};

const ProgressBar: React.FC<ProgressBarProps> = (progressBarProps) => {
  const { percentage } = progressBarProps;

  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
