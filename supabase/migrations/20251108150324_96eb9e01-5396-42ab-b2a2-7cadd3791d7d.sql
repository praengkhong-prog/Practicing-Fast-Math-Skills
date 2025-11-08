-- Create survey_responses table for storing user survey feedback
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Users can view their own survey responses
CREATE POLICY "Users can view their own survey responses"
ON public.survey_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own survey responses
CREATE POLICY "Users can insert their own survey responses"
ON public.survey_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all survey responses
CREATE POLICY "Admins can view all survey responses"
ON public.survey_responses
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_survey_responses_user_id ON public.survey_responses(user_id);
CREATE INDEX idx_survey_responses_created_at ON public.survey_responses(created_at DESC);