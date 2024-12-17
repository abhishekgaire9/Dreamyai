import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Metrics = {
  dream_submissions: number;
  total_characters: number;
  average_characters: number;
  successful_analyses: number;
  failed_analyses: number;
  clear_actions: number;
};

export default function Analytics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMetrics = async () => {
    try {
      const response = await brain.get_metrics();
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getChartData = () => {
    if (!metrics) return [];
    return [
      {
        name: "Dream Submissions",
        value: metrics.dream_submissions,
      },
      {
        name: "Successful Analyses",
        value: metrics.successful_analyses,
      },
      {
        name: "Failed Analyses",
        value: metrics.failed_analyses,
      },
      {
        name: "Clear Actions",
        value: metrics.clear_actions,
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-800/50 via-emerald-700/40 to-purple-900/50 text-foreground p-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800/50 via-emerald-700/40 to-purple-900/50 text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dream Analysis Analytics</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dreams
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
            <h3 className="text-lg font-semibold mb-2">Dream Submissions</h3>
            <div className="text-3xl font-bold text-primary">
              {metrics?.dream_submissions}
            </div>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
            <h3 className="text-lg font-semibold mb-2">Average Characters</h3>
            <div className="text-3xl font-bold text-secondary">
              {metrics?.average_characters.toFixed(0)}
            </div>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <div className="text-3xl font-bold text-accent">
              {metrics?.dream_submissions
                ? (
                    (metrics.successful_analyses / metrics.dream_submissions) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
          <h3 className="text-xl font-semibold mb-6">Activity Overview</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  className="text-sm"
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="currentColor"
                  className="text-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Analysis Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Successful Analyses:</span>
                <span className="font-semibold text-green-500">
                  {metrics?.successful_analyses}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Failed Analyses:</span>
                <span className="font-semibold text-red-500">
                  {metrics?.failed_analyses}
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-card/80 border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Character Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Characters:</span>
                <span className="font-semibold">
                  {metrics?.total_characters.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Clear Actions:</span>
                <span className="font-semibold">{metrics?.clear_actions}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
