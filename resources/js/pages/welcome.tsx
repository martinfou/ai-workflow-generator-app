import { MobileNavOverlay } from '@/components/mobile-nav-overlay';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, ChevronRight, Menu, Star } from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#benefits', label: 'Benefits' },
        { href: '#testimonials', label: 'Testimonials' },
    ];

    return (
        <>
            <Head title="AI Workflow Generator - Create Better Prompts Faster">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="fixed top-0 right-0 left-0 z-40 border-b border-[#e3e3e0] bg-[#FDFDFC]/95 backdrop-blur-sm dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/95">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold">
                                AI Workflow
                            </span>
                        </Link>
                        <nav className="hidden items-center space-x-8 lg:flex">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        <div className="hidden items-center space-x-4 lg:flex">
                            <Link
                                href={login()}
                                className="text-sm font-medium hover:text-[#f53003] dark:hover:text-[#FF4433]"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-sm bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </header>
                <MobileNavOverlay
                    isOpen={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                >
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-[#f5f5f4] dark:hover:bg-[#2C2C2A]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                                <ChevronRight className="h-4 w-4 text-[#706f6c]" />
                            </a>
                        ))}
                        <hr className="border-[#e3e3e0] dark:border-[#3E3E3A]" />
                        <Link
                            href={login()}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[#f5f5f4] dark:hover:bg-[#2C2C2A]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log in
                        </Link>
                        <Link
                            href={register()}
                            className="rounded-md bg-[#1b1b18] px-3 py-2 text-center text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </MobileNavOverlay>
                <main>
                    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                        <div className="mx-auto max-w-7xl px-4 md:px-6">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                                <div className="flex flex-col items-start justify-center space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium dark:bg-[#2C2C2A]">
                                            <span className="mr-2 h-2 w-2 rounded-full bg-[#f53003]"></span>
                                            Now with AI-Powered Workflows
                                        </div>
                                        <h1 className="text-4xl leading-tight font-bold tracking-tight lg:text-6xl">
                                            Become a Better{' '}
                                            <span className="text-[#f53003] dark:text-[#FF4433]">
                                                Prompt Engineer
                                            </span>{' '}
                                            in Seconds
                                        </h1>
                                        <p className="max-w-lg text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                            Create structured, effective AI
                                            prompts with our guided workflow
                                            builder. Get better results from
                                            ChatGPT, Claude, and any LLM.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center justify-center rounded-sm bg-[#1b1b18] px-6 py-3 text-base font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                        >
                                            Start Free
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                        <a
                                            href="#how-it-works"
                                            className="inline-flex items-center justify-center rounded-sm border border-[#e3e3e0] px-6 py-3 text-base font-medium hover:bg-[#f5f5f4] dark:border-[#3E3E3A] dark:hover:bg-[#2C2C2A]"
                                        >
                                            See How It Works
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        <div className="flex items-center gap-1">
                                            <Check className="h-4 w-4 text-[#22c55e]" />
                                            <span>No credit card</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Check className="h-4 w-4 text-[#22c55e]" />
                                            <span>Free tier available</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Check className="h-4 w-4 text-[#22c55e]" />
                                            <span>Cancel anytime</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative hidden lg:block">
                                    <div className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-[#f5f5f4] dark:bg-[#1D1D1D]" />
                                    <div className="relative">
                                        <div className="rounded-xl border border-[#e3e3e0] bg-white p-4 shadow-xl dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 border-b border-[#e3e3e0] pb-3 dark:border-[#3E3E3A]">
                                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="rounded bg-[#f5f5f4] p-2 dark:bg-[#2C2C2A]">
                                                        <p className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                                            Create a workflow
                                                            that generates code
                                                            documentation
                                                        </p>
                                                    </div>
                                                    <div className="border-l-2 border-[#e3e3e0] pl-4 dark:border-[#3E3E3A]">
                                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                                            Persona 1: API
                                                            Analyst
                                                        </p>
                                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                                            Persona 2: Technical
                                                            Writer
                                                        </p>
                                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                                            Persona 3: Code
                                                            Reviewer
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                        id="how-it-works"
                        className="bg-[#f5f5f4] py-20 dark:bg-[#1D1D1D]"
                    >
                        <div className="mx-auto max-w-7xl px-4 md:px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                    How It Works
                                </h2>
                                <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    Three simple steps to better AI prompts
                                </p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f53003]/10 text-[#f53003] dark:bg-[#FF4433]/10 dark:text-[#FF4433]">
                                        <span className="text-xl font-bold">
                                            1
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Describe Your Goal
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Tell our AI what you want to accomplish
                                        in plain language. No special syntax
                                        required.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f53003]/10 text-[#f53003] dark:bg-[#FF4433]/10 dark:text-[#FF4433]">
                                        <span className="text-xl font-bold">
                                            2
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Get Expert Workflows
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Our AI generates multiple workflow
                                        options with ordered personas optimized
                                        for your goal.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f53003]/10 text-[#f53003] dark:bg-[#FF4433]/10 dark:text-[#FF4433]">
                                        <span className="text-xl font-bold">
                                            3
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Generate & Export
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Execute workflows and export in JSON,
                                        Markdown, or other formats for your
                                        tools.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="benefits" className="py-20">
                        <div className="mx-auto max-w-7xl px-4 md:px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                    Why Use AI Workflow Generator?
                                </h2>
                                <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    Everything you need to create professional
                                    AI prompts
                                </p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f53003]/10 dark:bg-[#FF4433]/10">
                                        <svg
                                            className="h-5 w-5 text-[#f53003] dark:text-[#FF4433]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Structured Prompt Templates
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Start with proven templates for writing,
                                        coding, analysis, and more.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f53003]/10 dark:bg-[#FF4433]/10">
                                        <svg
                                            className="h-5 w-5 text-[#f53003] dark:text-[#FF4433]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Persona Ordering Suggestions
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        AI suggests the optimal order of
                                        personas for best results.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f53003]/10 dark:bg-[#FF4433]/10">
                                        <svg
                                            className="h-5 w-5 text-[#f53003] dark:text-[#FF4433]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Multi-Format Export
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Export to JSON, Markdown, CSV, or
                                        integrate directly with your workflow
                                        tools.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section
                        id="testimonials"
                        className="bg-[#f5f5f4] py-20 dark:bg-[#1D1D1D]"
                    >
                        <div className="mx-auto max-w-7xl px-4 md:px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                    Trusted by Prompt Engineers
                                </h2>
                                <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    See what our users are saying
                                </p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-4 w-4 fill-[#f53003] text-[#f53003] dark:fill-[#FF4433] dark:text-[#FF4433]"
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        "This tool transformed how I write
                                        prompts. The workflow suggestions are
                                        incredibly helpful."
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#f5f5f4] dark:bg-[#2C2C2A]" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Sarah Chen
                                            </p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                ML Engineer at TechCorp
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-4 w-4 fill-[#f53003] text-[#f53003] dark:fill-[#FF4433] dark:text-[#FF4433]"
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        "The persona ordering feature is a game
                                        changer. My Claude outputs are so much
                                        better now."
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#f5f5f4] dark:bg-[#2C2C2A]" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Marcus Johnson
                                            </p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                Content Strategist
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#161615]">
                                    <div className="mb-4 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-4 w-4 fill-[#f53003] text-[#f53003] dark:fill-[#FF4433] dark:text-[#FF4433]"
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        "Finally, a tool that makes prompt
                                        engineering accessible to everyone.
                                        Highly recommended!"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#f5f5f4] dark:bg-[#2C2C2A]" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Emily Rodriguez
                                            </p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                Product Manager
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-[#1b1b18] py-16 dark:bg-[#1C1C1A]">
                        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
                            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                                Ready to Become a Better Prompt Engineer?
                            </h2>
                            <p className="mb-8 text-[#A1A09A]">
                                Join thousands of users creating better AI
                                prompts today.
                            </p>
                            <Link
                                href={register()}
                                className="inline-flex items-center rounded-sm bg-white px-6 py-3 text-base font-medium text-[#1b1b18] hover:bg-[#f5f5f4]"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </main>
                <footer className="border-t border-[#e3e3e0] bg-[#f5f5f4] py-12 dark:border-[#3E3E3A] dark:bg-[#1D1D1D]">
                    <div className="mx-auto max-w-7xl px-4 md:px-6">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 font-semibold">Product</h3>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li>
                                        <a
                                            href="#how-it-works"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            How It Works
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#benefits"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Benefits
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#testimonials"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Testimonials
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 font-semibold">Company</h3>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Careers
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 font-semibold">
                                    Resources
                                </h3>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            API Reference
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Community
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 font-semibold">Legal</h3>
                                <ul className="space-y-2 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                        >
                                            Cookie Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-[#e3e3e0] pt-8 text-center text-sm text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                            <p>
                                &copy; 2026 AI Workflow Generator. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
