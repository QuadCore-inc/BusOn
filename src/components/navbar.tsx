"use client";

import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import Link from "next/link";
import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Menu } from "lucide-react";

const components: { title: string; href: string }[] = [
  {
    title: "Digital Signal Processing",
    href: "/digital-signal-processing",
  },
  {
    title: "Machine Learning",
    href: "/machine-learning",
  },
  {
    title: "Deep Learning",
    href: "/deep-learning",
  },
  {
    title: "Digital Communications",
    href: "/digital-communications",
  },
];

export default function Navbar() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-center px-4 md:px-6 sticky z-50 inset-x-0 top-0 bg-[#ffffff]">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <MountainIcon />
          <span className="sr-only">LASSE</span>
          <div className="grid gap-2 py-6">
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="/"
            >
              Home
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="https://www.lasse.ufpa.br/"
            >
              QuadCore
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="/machine-learning"
            >
              Machine Learning
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="/deep-learning"
            >
              Deep Learning
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="/digital-signal-processing"
            >
              Digital Signal Processing
            </Link>
            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="#"
            >
              Telecom
            </Link>

            <Link
              className="flex w-full items-center py-2 text-lg font-semibold"
              href="#"
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <NavigationMenu className="hidden lg:flex  justify-center">
        <NavigationMenuList>
          <NavigationMenuLink asChild>
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href="/"
            >
              Home
            </Link>
          </NavigationMenuLink>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <Link
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.title}
                    </Link>
                  ))}
                </ul>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <MountainIcon />
          <span className="sr-only">Acme Inc</span>
          <NavigationMenuLink asChild>
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href="netflix.com"
            >
              QuadCore
            </Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild></NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href="#"
            >
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

function MenuIcon() {
  return <Menu size={20} className="h-6 w-6" />;
}

function MountainIcon() {
  return (
    <Image
      src="/lasse.png"
      width={30}
      height={30}
      alt="logo"
      className="h-6 w-6"
    />
  );
}
