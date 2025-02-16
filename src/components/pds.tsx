"use client";
"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ArrowUpRight } from "lucide-react";

export default function PDS() {
  return (
    <MaxWidthWrapper>
      <div className="space-y-2 ">
        <div className="grid min-h-screen py-12 gap-4 lg:gap-6 px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Digital Signal Processing
              </h1>

              <div className="pt-16">
                <div className="border-t border-gray-200 dark:border-gray-800">
                  <div className="grid gap-6 lg:grid-cols-3 ">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">
                        Book – Digital Signal Processing with Python, Matlab or
                        Octave{" "}
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
                          <Link
                            className="underline"
                            href="https://nextcloud.lasseufpa.org/s/3rKJ2PPGFeQq6o6?path=%2Fslides"
                          >
                            Slides
                          </Link>{" "}
                          <span>and </span>
                          <Link
                            className="underline"
                            href="https://nextcloud.lasseufpa.org/s/3rKJ2PPGFeQq6o6?path=%2Fvideolectures"
                          >
                            Videos
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">
                        Softwares, codes and applications
                      </h2>
                      <p className="max-w-[600px] text-gray-600 ">
                        The source code for DSP’s book can be found{" "}
                        <a href="https://github.com/aldebaro/dsp-telecom-book-code">
                          <span className="underline">here</span>{" "}
                        </a>
                        with some Python Notebooks of the{" "}
                        <span className="">book’s applications</span> and
                        similar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
