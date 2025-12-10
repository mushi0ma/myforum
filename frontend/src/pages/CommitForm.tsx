import { useState } from 'react';
import { CommitGenerator } from '@/components/ai/CommitGenerator';
import { ReviewReport } from '@/components/ai/ReviewReport';
import { aiService } from '@/services/ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, ShieldCheck, GitCommitHorizontal, Loader2 } from 'lucide-react';

export default function CommitForm() {
    // Mock Data
    const [filename, setFilename] = useState('src/auth/login.js');
    const [diff, setDiff] = useState(`// TODO: Remove this before prod
const ADMIN_PASS = "123456"; 

function login(user, pass) {
  if (pass === ADMIN_PASS) {
    return true;
  }
  return false;
}`);

    const [commitMessage, setCommitMessage] = useState('');
    const [reviewResult, setReviewResult] = useState<{ issues: any[], markdown: string } | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);

    const handleReview = async () => {
        setIsReviewing(true);
        setReviewResult(null);
        try {
            const result = await aiService.runCodeReview(filename, diff);
            setReviewResult(result);
        } catch (e) {
            console.error(e);
            alert('Ошибка соединения с AI сервисом');
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0d1117] text-[#c9d1d9] p-6 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* === LEFT COLUMN: CODE EDITOR === */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FileCode className="text-[#58a6ff]" />
                            Changes
                        </h2>
                        <Badge variant="outline" className="border-[#30363d] text-[#8b949e]">
                            Unstaged
                        </Badge>
                    </div>

                    <Card className="bg-[#161b22] border-[#30363d] overflow-hidden">
                        <div className="bg-[#21262d] px-4 py-2 border-b border-[#30363d] flex gap-2">
                            <input
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="bg-transparent border-none text-sm font-mono text-[#c9d1d9] w-full focus:outline-none"
                            />
                        </div>
                        <Textarea
                            value={diff}
                            onChange={(e) => setDiff(e.target.value)}
                            className="w-full h-[500px] bg-[#0d1117] text-[#c9d1d9] border-none font-mono text-sm resize-none focus-visible:ring-0 p-4 leading-relaxed"
                            spellCheck={false}
                        />
                    </Card>
                </div>

                {/* === RIGHT COLUMN: AI TOOLS === */}
                <div className="space-y-6">

                    {/* COMMIT GENERATOR */}
                    <Card className="bg-[#161b22] border-[#30363d]">
                        <CardHeader className="border-b border-[#30363d] py-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <GitCommitHorizontal size={18} />
                                Commit Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <Textarea
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                placeholder="Enter commit message..."
                                className="bg-[#0d1117] border-[#30363d] min-h-[100px] text-sm"
                            />
                            <div className="flex justify-end">
                                <CommitGenerator
                                    filename={filename}
                                    diff={diff}
                                    onGenerate={setCommitMessage}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* CODE REVIEWER */}
                    <Card className="bg-[#161b22] border-[#30363d]">
                        <CardHeader className="border-b border-[#30363d] py-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <ShieldCheck size={18} />
                                Security Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <Button
                                onClick={handleReview}
                                disabled={isReviewing}
                                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
                            >
                                {isReviewing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                                ) : (
                                    'Run AI Review'
                                )}
                            </Button>

                            {reviewResult && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <ReviewReport
                                        markdown={reviewResult.markdown}
                                        issuesCount={reviewResult.issues.length}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}