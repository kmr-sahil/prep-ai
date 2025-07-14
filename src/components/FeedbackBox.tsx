import React from "react";

function FeedbackBox({ feedback }: any) {
  return (
    <div className="flex flex-col items-start justify-center text-start text-(--text-muted)">
      <div className="w-full flex items-center justify-between">
        <h3 className=" text-sm font-medium">Feedback</h3>
        <p className="text-[12px]">
          {" "}
          <span
            style={{
              backgroundColor:
                feedback.score <= 3
                  ? "rgba(225, 68, 52, 0.2)" // red
                  : feedback.score <= 7
                  ? "rgba(255, 193, 7, 0.2)" // yellow
                  : "rgba(6, 208, 1, 0.2)", // green

              color:
                feedback.score <= 3
                  ? "#E14434"
                  : feedback.score <= 7
                  ? "#FFC107"
                  : "#06D001",
            }}
            className={` px-3 py-1 rounded-md text-sm`}
          >
            <span className="font-semibold text-base">{feedback.score}</span>
            /10
          </span>
        </p>
      </div>
      <div className="h-[1px] w-full bg-(--primary)/0 my-3"></div>
      <p className="text-sm">{feedback.feedback}</p>
      <div className="h-[0.5px] w-full bg-(--primary)/20 my-4"></div>
      <p className="text-sm ">Scope of Improvement: {feedback.soi}</p>
      <div className="h-[1px] w-full bg-(--primary)/20 my-4"></div>
      <div className="text-sm flex gap-4">
        Tips:{" "}
        <ul className="list-disc list-inside">
          {feedback.tips.map((tip: string, index: number) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FeedbackBox;
