"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ArrowUpRight } from "lucide-react";

export default function ML() {
  return (
    <MaxWidthWrapper>
      <div className="space-y-2 ">
        <div className="grid min-h-screen py-12 gap-4 lg:gap-6 px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Machine Learning{" "}
              </h1>
              <p className="max-w-[600px] text-gray-600 ">
                The source code for DSP’s book can be found{" "}
                <span className="underline">here</span>, and below are some
                Python Notebooks of the{" "}
                <span className="underline">book’s applications.</span>.
              </p>
              <div>
                <ul className="mt-[30px] grid gap-2 list-disc pl-6">
                  <li>
                    Using Cross-Correlation For Synchronization Of Two Signals
                    Or Time Alignment
                  </li>
                  <li>Recording Sound</li>
                  <li>Real-Time Sound Processing</li>
                  <li>PC Sound Board Quantizer</li>
                  <li>Power Of The Sum Of Two Signals</li>
                  <li>Correlation Analysis</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Book – Digital Signal Processing with Python, Matlab or Octave{" "}
                </h2>

                <Button className={buttonVariants()}>
                  <span>
                    <a href="https://ai6g.org/books/dsp/ak_dsp_book.html">
                      Starting reading
                    </a>
                  </span>
                  <ArrowUpRight size={20} color="white" />
                </Button>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Multimedia Learning Materials
                </h2>
                <ul className="grid gap-2 list-disc pl-6">
                  <li>
                    <Link href="#">Slides and Videos</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Practical Applications
                </h2>
                <ul className="grid gap-2 list-disc pl-6">
                  <li>
                    <Link href="#">Software Tools</Link>
                  </li>
                  <li>
                    <Link href="#">Code Examples</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
