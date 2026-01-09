import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sprout, LogOut, Upload, Send, MessageCircle, Bell, 
  MapPin, Calendar, AlertTriangle, CheckCircle, Clock,
  FileText, TrendingUp
} from 'lucide-react';

interface DiseaseReport {
  id: string;
  symptoms: string;
  location: string;
  ai_prediction: string | null;
  ai_confidence: number | null;
  status: string;
  severity: string | null;
  created_at: string;
}

interface ResearchUpdate {
  id: string;
  title: string;
  disease_name: string | null;
  symptoms: string | null;
  treatment: string | null;
  preventive_measures: string | null;
  is_verified: boolean;
  created_at: string;
}

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [updates, setUpdates] = useState<ResearchUpdate[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== 'farmer')) {
      navigate('/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReports();
      fetchUpdates();
    }
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('disease_reports')
      .select('*')
      .eq('farmer_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setReports(data);
  };

  const fetchUpdates = async () => {
    const { data } = await supabase
      .from('research_updates')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setUpdates(data as ResearchUpdate[]);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('disease_reports')
        .insert({
          farmer_id: user?.id,
          symptoms,
          location: reportLocation,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Report Submitted!",
        description: "Our researchers will review it soon.",
      });
      
      setSymptoms('');
      setReportLocation('');
      setImageFile(null);
      setIsReporting(false);
      fetchReports();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      resolved: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };
    const { color, icon: Icon } = variants[status] || variants.pending;
    return (
      <Badge className={`${color} gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Farmer Dashboard</h1>
              <p className="text-sm text-muted-foreground">WheatGuard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Actions & Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report New Disease Card */}
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Report New Disease
                </CardTitle>
                <CardDescription>
                  Noticed something unusual in your wheat crop? Report it here for expert analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isReporting ? (
                  <Button onClick={() => setIsReporting(true)} className="w-full" size="lg">
                    <Upload className="mr-2 h-5 w-5" />
                    Start New Report
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitReport} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Describe the Symptoms</Label>
                      <Textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe what you're seeing... (e.g., yellow spots on leaves, wilting, rust patches)"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={reportLocation}
                          onChange={(e) => setReportLocation(e.target.value)}
                          placeholder="Your field location"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Image (Optional)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsReporting(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* My Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Reports
                </CardTitle>
                <CardDescription>Track the status of your submitted reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No reports yet. Submit your first report above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          {getStatusBadge(report.status)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{report.symptoms}</p>
                        {report.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </p>
                        )}
                        {report.ai_prediction && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-800 mb-1">AI Prediction:</p>
                            <p className="text-sm text-blue-700">{report.ai_prediction}</p>
                            {report.ai_confidence && (
                              <p className="text-xs text-blue-600 mt-1">
                                Confidence: {(report.ai_confidence * 100).toFixed(0)}%
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Updates Feed */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Research Updates
                </CardTitle>
                <CardDescription>Latest verified updates from researchers</CardDescription>
              </CardHeader>
              <CardContent>
                {updates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No updates yet. Check back soon!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div
                        key={update.id}
                        className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{update.title}</h4>
                        {update.disease_name && (
                          <p className="text-sm text-primary font-medium mb-2">
                            Disease: {update.disease_name}
                          </p>
                        )}
                        {update.treatment && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Treatment:</strong> {update.treatment}
                          </div>
                        )}
                        {update.preventive_measures && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <strong>Prevention:</strong> {update.preventive_measures}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.created_at).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Discuss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
