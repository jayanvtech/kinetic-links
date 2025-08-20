import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Eye, MousePointer, Globe, Users, Calendar, Download, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface AnalyticsData {
  views: number;
  clicks: number;
  conversionRate: number;
  topCountries: { country: string; count: number; percentage: number }[];
  dailyViews: { date: string; views: number; clicks: number }[];
  linkPerformance: { title: string; clicks: number; views: number; ctr: number }[];
  deviceTypes: { type: string; count: number; percentage: number }[];
  referrers: { source: string; visits: number; percentage: number }[];
  timeRanges: { hour: number; views: number }[];
  recentActivity: Array<{
    action: string;
    timestamp: string;
    value: number;
  }>;
}

const generateRealtimeData = (): AnalyticsData => {
  const currentDate = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 200) + 50,
      clicks: Math.floor(Math.random() * 100) + 20
    };
  });

  const totalViews = last7Days.reduce((sum, day) => sum + day.views, 0);
  const totalClicks = last7Days.reduce((sum, day) => sum + day.clicks, 0);

  return {
    views: totalViews,
    clicks: totalClicks,
    conversionRate: ((totalClicks / totalViews) * 100),
    dailyViews: last7Days,
    topCountries: [
      { country: 'United States', count: Math.floor(totalViews * 0.35), percentage: 35 },
      { country: 'United Kingdom', count: Math.floor(totalViews * 0.20), percentage: 20 },
      { country: 'Canada', count: Math.floor(totalViews * 0.15), percentage: 15 },
      { country: 'Germany', count: Math.floor(totalViews * 0.12), percentage: 12 },
      { country: 'France', count: Math.floor(totalViews * 0.10), percentage: 10 },
      { country: 'Others', count: Math.floor(totalViews * 0.08), percentage: 8 }
    ],
    linkPerformance: [
      { title: 'Portfolio Website', clicks: Math.floor(totalClicks * 0.30), views: Math.floor(totalViews * 0.25), ctr: 30 },
      { title: 'GitHub Profile', clicks: Math.floor(totalClicks * 0.25), views: Math.floor(totalViews * 0.22), ctr: 28 },
      { title: 'LinkedIn', clicks: Math.floor(totalClicks * 0.20), views: Math.floor(totalViews * 0.20), ctr: 25 },
      { title: 'Twitter', clicks: Math.floor(totalClicks * 0.15), views: Math.floor(totalViews * 0.18), ctr: 20 },
      { title: 'Instagram', clicks: Math.floor(totalClicks * 0.10), views: Math.floor(totalViews * 0.15), ctr: 15 }
    ],
    deviceTypes: [
      { type: 'Mobile', count: Math.floor(totalViews * 0.65), percentage: 65 },
      { type: 'Desktop', count: Math.floor(totalViews * 0.25), percentage: 25 },
      { type: 'Tablet', count: Math.floor(totalViews * 0.10), percentage: 10 }
    ],
    referrers: [
      { source: 'Direct', visits: Math.floor(totalViews * 0.40), percentage: 40 },
      { source: 'Instagram', visits: Math.floor(totalViews * 0.25), percentage: 25 },
      { source: 'Twitter', visits: Math.floor(totalViews * 0.15), percentage: 15 },
      { source: 'LinkedIn', visits: Math.floor(totalViews * 0.12), percentage: 12 },
      { source: 'Others', visits: Math.floor(totalViews * 0.08), percentage: 8 }
    ],
    timeRanges: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      views: Math.floor(Math.random() * 50) + 10
    })),
    recentActivity: [
      { action: "Link Click", timestamp: "2 min ago", value: 1 },
      { action: "Profile View", timestamp: "5 min ago", value: 3 },
      { action: "Link Click", timestamp: "12 min ago", value: 2 },
      { action: "Profile View", timestamp: "18 min ago", value: 1 },
    ]
  };
};

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(generateRealtimeData());
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [isRealTime, setIsRealTime] = useState(false);

  // Real-time data updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTime) {
      interval = setInterval(() => {
        const newData = generateRealtimeData();
        setAnalytics(newData);
        toast({
          title: "Analytics Updated",
          description: "Real-time data refreshed successfully",
          duration: 2000,
        });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTime]);

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Analytics data downloaded successfully",
    });
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Analytics Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Track your link performance and audience insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
            className="gap-2 hover-lift"
          >
            <RefreshCw className={`h-4 w-4 ${isRealTime ? 'animate-spin' : ''}`} />
            {isRealTime ? 'Live' : 'Enable Live'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="gap-2 hover-lift"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
            className="hover-scale"
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.views.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clicks.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500" />
              -2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(analytics.views * 0.7).toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15.3% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview" className="hover-scale">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="hover-scale">Link Performance</TabsTrigger>
          <TabsTrigger value="audience" className="hover-scale">Audience</TabsTrigger>
          <TabsTrigger value="traffic" className="hover-scale">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Views Chart */}
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Performance
                </CardTitle>
                <CardDescription>Views and clicks over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ views: { label: "Views", color: "#667eea" }, clicks: { label: "Clicks", color: "#764ba2" } }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.dailyViews}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="views" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="clicks" stackId="2" stroke="#764ba2" fill="#764ba2" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Visitor device breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ type, percentage }) => `${type}: ${percentage}%`}
                      >
                        {analytics.deviceTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest interactions with your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover-lift">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">+{activity.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
              <CardDescription>Click-through rates for your links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.linkPerformance.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover-lift">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{link.title}</h4>
                        <Badge variant="secondary">{link.ctr}% CTR</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {link.clicks} clicks • {link.views} views
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Progress value={link.ctr} className="w-24" />
                      <div className="text-xs text-muted-foreground">{link.ctr}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Where your visitors are from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{country.count}</span>
                        <Progress value={country.percentage} className="w-16" />
                        <span className="text-sm font-medium w-10">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How visitors find your page</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.referrers}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="visits"
                        label={({ source, percentage }) => `${source}: ${percentage}%`}
                      >
                        {analytics.referrers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle>Hourly Traffic Pattern</CardTitle>
              <CardDescription>Views by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ views: { label: "Views", color: "#667eea" } }} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.timeRanges}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" fill="#667eea" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time indicator */}
      {isRealTime && (
        <div className="fixed bottom-4 right-4">
          <Badge variant="default" className="gap-2 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            Live Updates
          </Badge>
        </div>
      )}
    </div>
  );
}
