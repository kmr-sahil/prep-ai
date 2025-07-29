import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="max-w-[48rem] mx-auto w-full flex flex-col gap-4 sm:flex-row items-start justify-between text-xs text-(--text) mt-[8rem] mb-[3rem] px-[1rem]">
      <Link href="/pricing">Pricing</Link>
      <div className="flex flex-col items-start">
        <p>
          Made with ❤️ by{" "}
          <Link
            href="https://sahilkmr.in"
            className="underline underline-offset-2"
          >
            Sahil Kumar
          </Link>
        </p>
        {/* <p>Powered by Google Gemini</p> */}
      </div>
      <p>© 2025 PrepAI. All rights reserved.</p>
    </div>
  );
}

export default Footer;
