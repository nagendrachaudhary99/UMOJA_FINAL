import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rhtonsoheuohpqqmuyaj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodG9uc29oZXVvaHBxcW11eWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDA5NDMsImV4cCI6MjA2NTk3Njk0M30.BYzXKV9lAV0zeFjWTbtEw74g6RQ03ZmqdqiT4PUIBU4'

export const supabase = createClient(supabaseUrl, supabaseKey) 