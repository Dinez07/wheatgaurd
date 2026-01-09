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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  FlaskConical, LogOut, FileText, CheckCircle, Clock,
  MapPin, Calendar, AlertTriangle, Send, BarChart3,
  Users, Leaf, Bell, Eye
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
  farmer_id: string;
}

interface ResearchUpdate {
  id: string;
  title: string;
  disease_name: string | null;
  symptoms: string | null;
  cause: string | null;
  treatment: string | null;
  preventive_measures: string | null;
  is_verified: boolean;
  created_at: string;
}

const ResearcherDashboard = () => {
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();
  const { toast } = useToast();

  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [myUpdates, setMyUpdates] = useState<ResearchUpdate[]>([]);
  const [selectedReport, setSelectedReport] = useState<DiseaseReport | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form fields for publishing update
  const [title, setTitle] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [cause, setCause] = useState('');
  const [treatment, setTreatment] = useState('');
  const [preventiveMeasures, setPreventiveMeasures] = useState('');

  useEffect(() => {
    if (!loading && (!user || role !== 'researcher')) {
      navigate('/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReports();
      fetchMyUpdates();
    }
  }, [user]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('disease_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setReports(data as DiseaseReport[]);
  };

  const fetchMyUpdates = async () => {
    const { data } = await supabase
      .from('research_updates')
      .select('*')
      .eq('researcher_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setMyUpdates(data);
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    const { error } = await supabase
      .from('disease_reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (!error) {
      toast({ title: "Status Updated", description: `Report marked as ${newStatus}` });
      fetchReports();
    }
  };

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('research_updates')
        .insert({
          researcher_id: user?.id,
          disease_report_id: selectedReport?.id || null,
          title,
          disease_name: diseaseName || null,
          symptoms: symptoms || null,
          cause: cause || null,
          treatment: treatment || null,
          preventive_measures: preventiveMeasures || null,
          is_verified: true
        });

      if (error) throw error;

      if (selectedReport) {
        await handleUpdateStatus(selectedReport.id, 'verified');
      }

      toast({
        title: "Update Published!",
        description: "Farmers will now see your verified update.",
      });

      // Reset form
      setTitle('');
      setDiseaseName('');
      setSymptoms('');
      setCause('');
      setTreatment('');
      setPreventiveMeasures('');
      setSelectedReport(null);
      fetchMyUpdates();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: Eye },
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

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    underReview: reports.filter(r => r.status === 'under_review').length,
    verified: reports.filter(r => r.status === 'verified').length,
    myPublications: myUpdates.length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <FlaskConical className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Researcher Dashboard</h1>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.underReview}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.myPublications}</p>
                <p className="text-sm text-muted-foreground">My Publications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Disease Reports
            </TabsTrigger>
            <TabsTrigger value="publish" className="gap-2">
              <Send className="h-4 w-4" />
              Publish Update
            </TabsTrigger>
            <TabsTrigger value="publications" className="gap-2">
              <FileText className="h-4 w-4" />
              My Publications
            </TabsTrigger>
          </TabsList>

          {/* Disease Reports Queue */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Disease Reports</CardTitle>
                <CardDescription>Review and analyze submitted disease reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reports to review</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer ${
                          selectedReport?.id === report.id ? 'ring-2 ring-secondary' : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
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
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          {report.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(report.id, 'under_review');
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark as Reviewing
                            </Button>
                          )}
                          {(report.status === 'pending' || report.status === 'under_review') && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReport(report);
                              }}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Publish Findings
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publish Update */}
          <TabsContent value="publish">
            <Card>
              <CardHeader>
                <CardTitle>Publish Research Update</CardTitle>
                <CardDescription>
                  Share your findings with farmers
                  {selectedReport && (
                    <Badge className="ml-2 bg-secondary/10 text-secondary">
                      Responding to report
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePublishUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Yellow Rust Alert - Prevention Methods"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Disease Name</Label>
                      <Input
                        value={diseaseName}
                        onChange={(e) => setDiseaseName(e.target.value)}
                        placeholder="e.g., Leaf Rust, Septoria"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cause</Label>
                      <Input
                        value={cause}
                        onChange={(e) => setCause(e.target.value)}
                        placeholder="e.g., Fungal infection due to moisture"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Symptoms</Label>
                    <Textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe the symptoms in detail..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Recommended Treatment</Label>
                    <Textarea
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      placeholder="e.g., Apply fungicide X at rate Y..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preventive Measures</Label>
                    <Textarea
                      value={preventiveMeasures}
                      onChange={(e) => setPreventiveMeasures(e.target.value)}
                      placeholder="e.g., Crop rotation, resistant varieties..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isPublishing}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isPublishing ? 'Publishing...' : 'Publish as Verified'}
                    </Button>
                    {selectedReport && (
                      <Button type="button" variant="outline" onClick={() => setSelectedReport(null)}>
                        Clear Selection
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Publications */}
          <TabsContent value="publications">
            <Card>
              <CardHeader>
                <CardTitle>My Publications</CardTitle>
                <CardDescription>Your published research updates</CardDescription>
              </CardHeader>
              <CardContent>
                {myUpdates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No publications yet</p>
                ) : (
                  <div className="space-y-4">
                    {myUpdates.map((update) => (
                      <div key={update.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{update.title}</h4>
                          <Badge className={update.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {update.is_verified ? 'Verified' : 'Draft'}
                          </Badge>
                        </div>
                        {update.disease_name && (
                          <p className="text-sm text-primary font-medium mb-2">
                            Disease: {update.disease_name}
                          </p>
                        )}
                        {update.treatment && (
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Treatment:</strong> {update.treatment}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Published: {new Date(update.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ResearcherDashboard;
