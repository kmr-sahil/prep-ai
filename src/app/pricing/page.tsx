
import React from "react";

function Page() {
  
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-[48rem] mx-auto">
      <h1 className="text-2xl font-bold mb-4 mt-[8rem]">Pricing Page</h1>
      <p className="text-lg mb-8 text-center">
        Help us improve! The Pro version will include advanced and real-world
        questions, plus smarter one-on-one AI practice.
      </p>

      {/* ✅ Tally embed */}
      <div className="w-full max-w-[30rem] mx-auto">
        <iframe
          data-tally-src="https://tally.so/embed/3lkVQB?hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
          width="100%"
          frameBorder="0"
          marginHeight={200}
          marginWidth={0}
          title="pre-ai feedback"
        ></iframe>
      </div>
    </div>
  );
}

export default Page;
