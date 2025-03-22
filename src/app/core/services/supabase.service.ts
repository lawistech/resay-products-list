import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private supabase: SupabaseClient;
  private authStateChange = new BehaviorSubject<boolean>(false);

  constructor() {
    // Create the Supabase client with session persistence disabled
    // to avoid the NavigatorLockAcquireTimeoutError
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    
    // Initialize auth state
    this.checkAndSetSession();
  }

  get supabaseClient(): SupabaseClient {
    return this.supabase;
  }
  
  private async checkAndSetSession() {
    try {
      const { data } = await this.supabase.auth.getSession();
      this.authStateChange.next(!!data.session);
    } catch (error) {
      console.error('Error checking auth session:', error);
      this.authStateChange.next(false);
    }
  }
}