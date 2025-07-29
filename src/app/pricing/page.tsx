"use client";
import React from "react";

function Page() {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>prep-ai feedback</title>
        <script async src="https://tally.so/widgets/embed.js"></script>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center h-screen max-w-[48rem] mx-auto">
          <h1 className="text-2xl font-bold mb-4 mt-[8rem]">Pricing Page</h1>
          <p className="text-lg mb-8 text-center">
            Help us improve! The Pro version will include advanced and
            real-world questions, plus smarter one-on-one AI practice.
          </p>

          {/* ✅ Tally embed */}
          <iframe
            data-tally-src="https://tally.so/r/3lkVQB?transparentBackground=1"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="prep-ai feedback"
          ></iframe>
        </div>
      </body>
    </html>
  );
}

export default Page;
