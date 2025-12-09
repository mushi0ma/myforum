// frontend/src/components/ai/ReviewReport.tsx
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
    markdown: string;
    issuesCount: number;
}

export function ReviewReport({ markdown, issuesCount }: Props) {
    if (!markdown) return null;

    const isClean = issuesCount === 0;

    return (
        <div className={`rounded-lg border ${isClean ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'} p-4 mt-4`}>
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                {isClean ? <CheckCircle className="text-green-500" size={20} /> : <AlertTriangle className="text-red-500" size={20} />}
                <h3 className="font-mono font-bold text-sm">AI Security Audit</h3>
            </div>

            <ScrollArea className="h-[200px] w-full rounded-md">
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </ScrollArea>
        </div>
    );
}