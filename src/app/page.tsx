"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BrainCircuit, Radio, BrainCog, SatelliteDish } from 'lucide-react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "João Ferreira",
    role: "Frontend Developer",
    description:
      "Telecommunications engineering student at UFPA and researcher at LASSE",
    imageSrc: "/jvictorferreira.jpeg",
  },
  {
    name: "Joel Tavares",
    description: "Computer engineering student at UFPA and researcher at LASSE",
    role: "Gerente de Projeto",
    imageSrc: "/joel.jpeg",
  },
  {
    name: "Kauan Miranda",
    description:
      "Master's student in Electrical engineering at UFPA and researcher at LASSE",
    role: "Backend Developer",
    imageSrc: "/kauan.jpeg",
  },
  {
    name: "Marco Maués",
    description:
      "Master's student in Electrical engineering at UFPA and researcher at LASSE",
    role: "Backend Developer",
    imageSrc: "/marco.jpeg",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 ">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl  tracking-tight leading-none md:text-5xl xl:text-6xl text-black ">
              {" "}
              <span className="text-[#f0c538]"> BusON, </span>
              aplicativo crowdsourcing para <span className="text-[#fcad36]"> compartilhamento</span> de informação entre usuários de <span className="text-[#31ABCF]"> ônibus</span>.
            </h1>
            <p className="max-w-2xl mb-6 text-[#686868] italic   lg:mb-8 md:text-lg lg:text-xl ">
            COMO PODEMOS AUXILIAR A TOMADA DE DECISÃO DO USUÁRIO DE ÔNIBUS DE LINHA PARA MELHORAR SUA EXPERIÊNCIA?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button className={buttonVariants()}>
                <span>
                  <a href="https://ai6g.org/books/dsp/ak_dsp_book.html">
                    Start reading
                  </a>
                </span>
                <ArrowUpRight size={20} />
              </Button>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <Image
              src="/book_cover.png"
              width={500}
              height={500}
              alt="book cover"
            />
          </div>
        </div>
      </MaxWidthWrapper>
      <section className=" bg-gray-50 ">
        <div className=" py-8 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-black sm:text-4xl">
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-2xl sm:mt-20 lg:mt-8 lg:max-w-4xl">
            </div>
          </div>
        </div>
      </section>
      <MaxWidthWrapper>
        <div className="py-8 sm:py-16 text-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-black sm:text-4xl">
              Conheça a equipe
            </p>

            <p className="text-gray-600">
              A equipe é composta por estudantes de graduação da Faculdade de Computação e Telecomunicações da UFPA
            </p>
          </div>

          <div className="flex flex-wrap justify-center space-x-0 md:space-x-6 overflow-hidden mt-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 flex flex-col items-center"
              >
                <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    width={192}
                    height={192}
                    layout="responsive"
                  />
                </div>
                <h3 className="font-semibold mt-4 text-black">{member.name}</h3>
                <p className="text-gray-800">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
