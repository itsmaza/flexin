'use client';
import React, { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Loader2, RefreshCw, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import TopInfo from '../__global_components/TopInfo';

export default function Question() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    const maxChars = 800;

    async function handleGenerate() {
        if (!prompt.trim()) return;

        setResult('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok || !response.body) {
                toast.error('কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।');
                setLoading(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                for (let i = 0; i < chunk.length; i++) {
                    setResult((prev) => (prev ?? '') + chunk[i]);

                    resultRef.current?.scrollTo({
                        top: resultRef.current.scrollHeight,
                        behavior: 'smooth',
                    });

                    await new Promise((res) => setTimeout(res, 12));
                }
            }
        } catch {
            toast.error('কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy() {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            toast.success('Copied');
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Unable to copy to clipboard');
        }
    }

    function handleClear() {
        setPrompt('');
        setResult(null);
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <TopInfo
                title="AI-powered Recommendations"
                desc="Paste your problem and get concise, actionable suggestions."
            />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-6 p-6 rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-100"
            >
                <label
                    htmlFor="problem"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Describe your problem
                </label>

                <Textarea
                    id="problem"
                    aria-label="Problem description"
                    placeholder="Explain what you want help with — be concise and specific"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={maxChars}
                    className="mt-2 min-h-[140px] resize-y shadow-sm focus-visible:ring-2 focus-visible:ring-violet-400 border-gray-200 rounded-xl p-3 transition-shadow"
                />

                <div className="mt-2 flex items-center justify-between text-sm">
                    <div className={`text-muted-foreground transition-colors ${prompt.length >= maxChars ? 'text-rose-500 font-medium' : ''}`}>
                        {prompt.length}/{maxChars}
                    </div>
                </div>

                <div className="mt-4 flex gap-3 items-center">
                    <Button
                        className="inline-flex items-center gap-2 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all"
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        aria-disabled={loading || !prompt.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" /> Generate
                            </>
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        disabled={loading}
                        className="inline-flex items-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="h-4 w-4" /> Clear
                    </Button>
                </div>

                <div className="mt-6">
                    <AnimatePresence>
                        {result !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                ref={resultRef}
                                className="mt-2 rounded-xl border p-4 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 max-h-[400px] overflow-y-auto"
                            >
                                <pre className="whitespace-pre-wrap text-sm leading-6 font-sans">
                                    {result}
                                    {loading && (
                                        <span className="inline-block w-2 h-4 ml-0.5 bg-violet-500 animate-pulse" />
                                    )}
                                </pre>

                                {!loading && result && (
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            onClick={handleCopy}
                                            variant="outline"
                                            className="flex border items-center gap-2 cursor-pointer"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" /> Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" /> Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}