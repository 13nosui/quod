import React from 'react';
import { Mail, ArrowLeft, Copy, Check } from 'lucide-react'; // アイコンを追加
import { useState } from 'react';

// あなたのメールアドレスに書き換えてください
const SUPPORT_EMAIL = "13.no.sui@gmail.com";

export const Support: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(SUPPORT_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 font-sans">
            <div className="mx-auto max-w-2xl px-6 py-12">
                {/* ヘッダー */}
                <header className="mb-12">
                    <a
                        href="/"
                        className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Game
                    </a>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        App Support
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        Need help with QUOD? We are here to assist you.
                    </p>
                </header>

                <main className="space-y-8">
                    {/* お問い合わせセクション */}
                    <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold">Contact Us</h2>
                                <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                                    If you have found a bug, have a feature request, or need assistance, please email our support team.
                                </p>

                                {/* 修正箇所: メールアドレス表示とコピー機能 */}
                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={`mailto:${SUPPORT_EMAIL}`}
                                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all"
                                    >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Email
                                    </a>

                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-all"
                                    >
                                        {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                                        {copied ? "Copied!" : SUPPORT_EMAIL}
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-slate-500">
                                    Average response time: 24-48 hours
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQセクション */}
                    <section>
                        <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-slate-700">
                                <h3 className="font-semibold text-lg mb-2">Is the game free to play?</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Yes, QUOD is completely free to download and play.
                                </p>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-slate-700">
                                <h3 className="font-semibold text-lg mb-2">How do I reset my score?</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Currently, high scores are saved locally on your device. Uninstalling the app will reset your progress.
                                </p>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-slate-700">
                                <h3 className="font-semibold text-lg mb-2">Which devices are supported?</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    QUOD is optimized for iPhone (iOS 13.0 or later).
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
                    &copy; {new Date().getFullYear()} QUOD. All rights reserved.
                </footer>
            </div>
        </div>
    );
};