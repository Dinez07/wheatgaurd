import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sprout, FlaskConical, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register';
type Role = 'farmer' | 'researcher';

const Auth = () => {
  const navigate = useNavigate();
  const { user, role, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Farmer fields
  const [location, setLocation] = useState('');
  const [cropType, setCropType] = useState('Wheat');
  const [experience, setExperience] = useState('');
  
  // Researcher fields
  const [institution, setInstitution] = useState('');
  const [expertise, setExpertise] = useState('');
  const [researchId, setResearchId] = useState('');

  useEffect(() => {
    if (user && role && !loading) {
      navigate(role === 'farmer' ? '/farmer-dashboard' : '/researcher-dashboard');
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Invalid credentials",
            variant: "destructive"
          });
        }
      } else {
        const profileData = selectedRole === 'farmer' 
          ? { name, phone, location, cropType, experience: parseInt(experience) || 0 }
          : { name, phone, institution, expertise, researchId };
        
        const { error } = await signUp(email, password, selectedRole, profileData);
        if (error) {
          toast({
            title: "Registration Failed",
            description: error.message || "Could not create account",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to WheatGuard",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            <div className="flex justify-center gap-4 mb-8">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Sprout className="h-12 w-12" />
              </div>
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <FlaskConical className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Connecting Farmers with Science</h1>
            <p className="text-lg text-white/80">
              A collaborative platform where farmers report wheat diseases and researchers provide verified solutions.
            </p>
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-sm italic">"Where Fields Meet Research."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 bg-gradient-to-br from-green-50 to-amber-50">
        <Button
          variant="ghost"
          className="w-fit mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome Back' : 'Join WheatGuard'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {mode === 'login' ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </div>

            {/* Role Selector */}
            <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all ${
                  selectedRole === 'farmer' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sprout className="h-5 w-5" />
                <span className="font-medium">Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('researcher')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all ${
                  selectedRole === 'researcher' 
                    ? 'bg-secondary text-secondary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FlaskConical className="h-5 w-5" />
                <span className="font-medium">Researcher</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {selectedRole === 'farmer' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location (Village/District)</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Punjab, Haryana"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cropType">Crop Type</Label>
                          <Input
                            id="cropType"
                            value={cropType}
                            onChange={(e) => setCropType(e.target.value)}
                            placeholder="Wheat"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="5"
                            min="0"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution/Organization</Label>
                        <Input
                          id="institution"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g., Agricultural Research Institute"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expertise">Field of Expertise</Label>
                        <Input
                          id="expertise"
                          value={expertise}
                          onChange={(e) => setExpertise(e.target.value)}
                          placeholder="e.g., Plant Pathology, AI, Agronomy"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="researchId">Research ID (Optional)</Label>
                        <Input
                          id="researchId"
                          value={researchId}
                          onChange={(e) => setResearchId(e.target.value)}
                          placeholder="Your research ID"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
