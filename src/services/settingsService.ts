import { supabase } from '@/lib/supabase';

export interface UserSettings {
  id: string;
  user_id: string;
  // Profile Settings
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  profile_picture_url: string | null;
  username: string;
  display_name: string;
  
  // Company Settings
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_website: string | null;
  company_logo_url: string | null;
  
  // Preferences
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  date_format: string;
  currency: string;
  font_size: 'small' | 'medium' | 'large';
  compact_mode: boolean;
  show_sidebar: boolean;
  
  // Notifications
  email_notifications: boolean;
  push_notifications: boolean;
  order_updates: boolean;
  payment_updates: boolean;
  newsletter: boolean;
  
  // Security
  two_factor_enabled: boolean;
  two_factor_method: 'authenticator' | 'sms' | null;
  last_password_change: string | null;
  
  // Privacy
  data_sharing: {
    analytics: boolean;
    marketing: boolean;
    third_party: boolean;
  };
  
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'pending' | 'active' | 'inactive';
  invited_by: string;
  invited_at: string;
  accepted_at: string | null;
}

export interface DeviceSession {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  location: string;
  last_active: string;
  ip_address: string;
  user_agent: string;
}

export interface Integration {
  id: string;
  user_id: string;
  service: string;
  status: 'active' | 'inactive' | 'error';
  credentials: Record<string, any>;
  last_sync: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  type: string;
  details: string | null;
  created_at: string;
}

// Get user settings
export async function getUserSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Update user settings
export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get team members
export async function getTeamMembers(userId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Invite team member
export async function inviteTeamMember(userId: string, email: string, role: TeamMember['role']): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .insert([
      {
        user_id: userId,
        email,
        role,
        status: 'pending',
        invited_by: userId,
        invited_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get active devices
export async function getActiveDevices(userId: string): Promise<DeviceSession[]> {
  const { data, error } = await supabase
    .from('device_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('last_active', { ascending: false });

  if (error) throw error;
  return data;
}

// Revoke device session
export async function revokeDeviceSession(userId: string, sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('device_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('id', sessionId);

  if (error) throw error;
}

// Get integrations
export async function getIntegrations(userId: string): Promise<Integration[]> {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Add integration
export async function addIntegration(userId: string, integration: Omit<Integration, 'id' | 'user_id'>): Promise<Integration> {
  const { data, error } = await supabase
    .from('integrations')
    .insert([
      {
        ...integration,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remove integration
export async function removeIntegration(userId: string, integrationId: string): Promise<void> {
  const { error } = await supabase
    .from('integrations')
    .delete()
    .eq('user_id', userId)
    .eq('id', integrationId);

  if (error) throw error;
}

// Generate API key
export async function generateApiKey(userId: string, name: string): Promise<{ key: string }> {
  const { data, error } = await supabase.rpc('generate_api_key', {
    p_user_id: userId,
    p_name: name,
  });

  if (error) throw error;
  return { key: data };
}

// Get activity logs
export async function getActivityLogs(userId: string): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Upload profile picture
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size must be less than 2MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Delete existing profile picture if it exists
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('profile_picture_url')
      .eq('user_id', userId)
      .single();

    if (existingSettings?.profile_picture_url) {
      const oldPath = existingSettings.profile_picture_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${userId}/${oldPath}`]);
      }
    }

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    // Update user settings with new profile picture URL
    const { error: updateError } = await supabase
      .from('user_settings')
      .update({ profile_picture_url: publicUrl })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Update error:', updateError);
      // If update fails, delete the uploaded file
      await supabase.storage
        .from('profile-pictures')
        .remove([filePath]);
      throw new Error(`Failed to update settings: ${updateError.message}`);
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

// Update password
export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
}

// Enable/disable two-factor authentication
export async function toggleTwoFactor(userId: string, enabled: boolean): Promise<void> {
  try {
    if (enabled) {
      // Generate a secret for the authenticator app
      const { data: { secret }, error: secretError } = await supabase.rpc('generate_2fa_secret', {
        p_user_id: userId
      });

      if (secretError) throw secretError;

      // Update user settings with 2FA enabled
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ 
          two_factor_enabled: true,
          two_factor_method: 'authenticator',
          two_factor_secret: secret
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Disable 2FA
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ 
          two_factor_enabled: false,
          two_factor_method: null,
          two_factor_secret: null
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error toggling 2FA:', error);
    throw error;
  }
}

// Verify 2FA code
export async function verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('verify_2fa_code', {
      p_user_id: userId,
      p_code: code
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    throw error;
  }
} 