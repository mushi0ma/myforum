// frontend/src/components/ai/CommitGenerator.tsx
import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiService } from '@/services/ai';

interface Props {
    filename: string;
    diff: string; // В реальном проекте diff берется из редактора или git status
    onGenerate: (msg: string) => void;
}

export function CommitGenerator({ filename, diff, onGenerate }: Props) {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!diff) return;
        setLoading(true);
        try {
            const msg = await aiService.generateCommitMessage(filename, diff);
            onGenerate(msg); // Вставляет текст в инпут родителя
        } catch (e) {
            console.error(e);
            alert("AI Error: Could not generate commit message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleGenerate}
            disabled={loading || !diff}
            variant="outline"
            className="gap-2 border-[#58a6ff] text-[#58a6ff] hover:bg-[#58a6ff]/10"
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? 'Generating...' : 'Generate with AI'}
        </Button>
    );
}