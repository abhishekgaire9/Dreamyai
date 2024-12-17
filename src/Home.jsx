import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/hooks/use-theme";
import { BarChart2, Brain, MoonIcon, Send, Sparkles, SunIcon, X, Scroll, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import brain from "brain";

export default function App() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [dream, setDream] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    psychological_analysis: string;
    vedic_interpretation: string;
    sentiment: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_CHARS = 2000;

  const trackEvent = async (eventType: string, properties: Record<string, any> = {}) => {
    try {
      await brain.track_event({ event_type: eventType, properties });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const clearDream = () => {
    setDream("");
    setAnalysis(null);
    setError(null);
    trackEvent('clear_action');
  };

  const analyzeDream = async () => {
    const characterCount = dream.trim().length;
    trackEvent('dream_submission', { character_count: characterCount });
    setLoading(true);
    setError(null);
    try {
      const response = await brain.analyze_dream({ dream_description: dream });
      const result = await response.json();
      setAnalysis(result);
      trackEvent('analysis_success');
    } catch (error) {
      console.error('Failed to analyze dream:', error);
      setError('Failed to analyze dream. Please try again.');
      trackEvent('analysis_failure', { error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Constellation Background */}
      {/* Starry Background */}
      <div className="absolute inset-0">
        {/* Base stars layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        
        {/* Twinkling stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Larger, slower twinkling stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-[3px] h-[3px] bg-white rounded-full animate-twinkle-slow`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Shooting stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 50}%`,
                animationDelay: `${i * 2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Colored nebula effects */}
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
          <div className="absolute h-[600px] w-[600px] rounded-full bg-purple-400/20 blur-[100px] -top-32 -left-32 animate-pulse" />
          <div className="absolute h-[700px] w-[700px] rounded-full bg-blue-400/20 blur-[100px] top-1/3 right-32 animate-pulse" />
          <div className="absolute h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[100px] bottom-32 -left-32 animate-pulse" />
        </div>
      </div>

      {/* Theme Toggle and Analytics */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/analytics")}
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 animate-ping opacity-50">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <Sparkles className="h-8 w-8 text-primary relative z-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 dark:from-purple-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                Dreamy AI
              </h1>
            </div>
            <p className="text-muted-foreground text-lg dark:text-gray-300/90">
              Unlock the mysteries of your dreams with psychological and vedic
              insights
            </p>
          </div>

          {/* Dream Input Card */}
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-card/90 dark:shadow-purple-500/10">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                Share Your Dream
              </h2>
              <Textarea
                placeholder="Describe your dream in detail... (max 2000 characters)"
                className="min-h-[200px] bg-gray-50/90 dark:bg-gray-800/90 placeholder:text-muted-foreground/50 transition-all duration-300 focus:bg-gray-100/95 dark:focus:bg-gray-700/95 resize-none border-2 hover:border-primary/50 dark:border-purple-500/20 dark:focus:border-purple-500/50 rounded-lg"
                value={dream}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setDream(e.target.value);
                  }
                }}
                maxLength={MAX_CHARS}
              />
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground text-right">
                  {dream.length} / {MAX_CHARS} characters
                </div>
                <div className="flex justify-end gap-2">
                <Button
                  onClick={analyzeDream}
                  disabled={!dream.trim() || loading}
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></span>
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      Analyze Dream
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/20 hover:bg-purple-500/10 transition-all duration-300"
                  onClick={clearDream}
                  disabled={!dream.trim() || loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              </div>
            </div>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50 shadow-lg space-y-6 animate-fade-in transition-all duration-300 hover:shadow-xl hover:bg-card/90 dark:shadow-purple-500/10 dark:border-purple-500/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Dream Analysis</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium shadow-inner transition-all duration-300 ${
                    analysis.sentiment === 'positive' ? 'bg-green-500/20 text-green-500' :
                    analysis.sentiment === 'negative' ? 'bg-red-500/20 text-red-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)} Dream
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-secondary">Psychological Interpretation</h3>
                    <p className="text-muted-foreground">{analysis.psychological_analysis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-accent">Vedic Interpretation</h3>
                    <p className="text-muted-foreground">{analysis.vedic_interpretation}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {error && (
            <div className="text-destructive text-center">{error}</div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="p-4 backdrop-blur-sm bg-card/80 border border-border/50 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-card/90 group dark:shadow-purple-500/10 dark:border-purple-500/20 dark:hover:border-purple-500/40">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-semibold text-primary">
                  Psychological Analysis
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Understand your dreams through the lens of modern psychology
              </p>
            </Card>
            <Card className="p-4 backdrop-blur-sm bg-card/80 border border-border/50 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-card/90 group dark:shadow-purple-500/10 dark:border-purple-500/20 dark:hover:border-purple-500/40">
              <div className="flex items-center gap-2 mb-2">
                <Scroll className="h-5 w-5 text-secondary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-semibold text-secondary">
                  Vedic Interpretation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore ancient wisdom and spiritual meanings
              </p>
            </Card>
            <Card className="p-4 backdrop-blur-sm bg-card/80 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-semibold text-accent">
                  AI-Powered Insights
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get personalized analysis using advanced AI
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
