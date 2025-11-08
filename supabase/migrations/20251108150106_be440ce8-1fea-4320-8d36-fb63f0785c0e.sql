-- Create practice_results table for storing user practice sessions
CREATE TABLE public.practice_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  avg_time_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.practice_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own practice results
CREATE POLICY "Users can view their own practice results"
ON public.practice_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own practice results
CREATE POLICY "Users can insert their own practice results"
ON public.practice_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all practice results
CREATE POLICY "Admins can view all practice results"
ON public.practice_results
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_practice_results_user_id ON public.practice_results(user_id);
CREATE INDEX idx_practice_results_mode ON public.practice_results(mode);
CREATE INDEX idx_practice_results_level ON public.practice_results(level);