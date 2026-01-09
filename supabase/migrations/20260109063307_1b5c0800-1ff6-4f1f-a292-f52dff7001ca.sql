-- Create role enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'researcher');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Farmer-specific profile data
CREATE TABLE public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  location TEXT,
  crop_type TEXT DEFAULT 'Wheat',
  farming_experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Researcher-specific profile data
CREATE TABLE public.researcher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  institution TEXT,
  field_of_expertise TEXT,
  research_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Disease reports from farmers
CREATE TABLE public.disease_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  symptoms TEXT NOT NULL,
  location TEXT,
  ai_prediction TEXT,
  ai_confidence NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'resolved')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Research updates from researchers
CREATE TABLE public.research_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  disease_report_id UUID REFERENCES public.disease_reports(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  disease_name TEXT,
  symptoms TEXT,
  cause TEXT,
  treatment TEXT,
  preventive_measures TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Comments/discussions
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  disease_report_id UUID REFERENCES public.disease_reports(id) ON DELETE CASCADE,
  research_update_id UUID REFERENCES public.research_updates(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CHECK (disease_report_id IS NOT NULL OR research_update_id IS NOT NULL)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Farmer profiles policies
CREATE POLICY "Farmers can view own profile" ON public.farmer_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Farmers can update own profile" ON public.farmer_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Farmers can insert own profile" ON public.farmer_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Researcher profiles policies
CREATE POLICY "Researchers can view own profile" ON public.researcher_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Researchers can update own profile" ON public.researcher_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Researchers can insert own profile" ON public.researcher_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Disease reports policies
CREATE POLICY "Anyone authenticated can view reports" ON public.disease_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Farmers can create reports" ON public.disease_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = farmer_id AND public.has_role(auth.uid(), 'farmer'));
CREATE POLICY "Farmers can update own reports" ON public.disease_reports FOR UPDATE TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "Researchers can update any report" ON public.disease_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'researcher'));

-- Research updates policies
CREATE POLICY "Anyone authenticated can view updates" ON public.research_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Researchers can create updates" ON public.research_updates FOR INSERT TO authenticated WITH CHECK (auth.uid() = researcher_id AND public.has_role(auth.uid(), 'researcher'));
CREATE POLICY "Researchers can update own updates" ON public.research_updates FOR UPDATE TO authenticated USING (auth.uid() = researcher_id);

-- Comments policies
CREATE POLICY "Anyone authenticated can view comments" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_disease_reports_updated_at BEFORE UPDATE ON public.disease_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_research_updates_updated_at BEFORE UPDATE ON public.research_updates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();