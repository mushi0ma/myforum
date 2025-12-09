import { useState } from 'react';
import { CommitGenerator } from '@/components/ai/CommitGenerator'; // Убедитесь в пути
import { ReviewReport } from '@/components/ai/ReviewReport';       // Убедитесь в пути
import { aiService } from '@/services/ai';                         // Убедитесь в пути
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAIPage() {
    // Состояние для эмуляции "изменений в файлах"
    const [filename, setFilename] = useState('src/auth/login.js');
    const [diff, setDiff] = useState('const PASSWORD = "123"; // TODO: Fix hardcode');

    // Состояние для результатов
    const [commitMessage, setCommitMessage] = useState('');
    const [reviewResult, setReviewResult] = useState<{ issues: any[], markdown: string } | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);

    // Обработчик ревью
    const handleReview = async () => {
        setIsReviewing(true);
        try {
            // Вызываем наш сервис (который дергает Django -> n8n -> AI)
            const result = await aiService.runCodeReview(filename, diff);
            setReviewResult(result);
        } catch (e) {
            alert('Ошибка ревью');
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 text-white">
            <h1 className="text-3xl font-mono font-bold mb-6">🕵️‍♂️ GitForum AI Tools Test</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* === ЛЕВАЯ КОЛОНКА: ИМИТАЦИЯ РЕДАКТОРА === */}
                <div className="space-y-4">
                    <Card className="bg-[#0d1117] border-[#333637]">
                        <CardHeader>
                            <CardTitle className="text-sm font-mono text-[#656869]">Code Editor (Simulation)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-xs text-[#656869] mb-1 block">Filename</label>
                                <input
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="w-full bg-[#000] border border-[#333637] rounded px-3 py-2 text-sm text-white font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#656869] mb-1 block">Git Diff / Code Content</label>
                                <Textarea
                                    value={diff}
                                    onChange={(e) => setDiff(e.target.value)}
                                    className="bg-[#000] border-[#333637] font-mono text-xs h-40 text-green-400"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Кнопка запуска Ревью */}
                    <Button
                        onClick={handleReview}
                        disabled={isReviewing}
                        className="w-full bg-[#1f6feb] hover:bg-[#388bfd] text-white"
                    >
                        {isReviewing ? 'Analyzing...' : 'Run Security Audit 🛡️'}
                    </Button>
                </div>

                {/* === ПРАВАЯ КОЛОНКА: РЕЗУЛЬТАТЫ === */}
                <div className="space-y-6">

                    {/* 1. Блок Генерации Коммита */}
                    <Card className="bg-[#161b22] border-[#333637]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Commit Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-2">
                                <Textarea
                                    value={commitMessage}
                                    onChange={(e) => setCommitMessage(e.target.value)}
                                    placeholder="Enter commit message..."
                                    className="bg-[#0d1117] border-[#333637] min-h-[80px]"
                                />
                            </div>
                            {/* НАША МАГИЧЕСКАЯ КНОПКА */}
                            <CommitGenerator
                                filename={filename}
                                diff={diff}
                                onGenerate={setCommitMessage}
                            />
                        </CardContent>
                    </Card>

                    {/* 2. Блок Отчета Ревью */}
                    {reviewResult && (
                        <ReviewReport
                            markdown={reviewResult.markdown}
                            issuesCount={reviewResult.issues.length}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}