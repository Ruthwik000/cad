import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useAuth } from '../contexts/AuthContext';

interface AuthDialogProps {
  visible: boolean;
  onHide: () => void;
}

export default function AuthDialog({ visible, onHide }: AuthDialogProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      onHide();
      // Reset form
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      const errorMessage = err.code === 'auth/popup-closed-by-user' 
        ? 'Sign in cancelled' 
        : err.message || 'Failed to sign in with Google';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      
      onHide();
      // Reset form
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Email auth error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = '';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={isSignUp ? 'Create Account' : 'Sign In'}
      style={{ width: '450px', maxWidth: '90vw' }}
      contentStyle={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}
      headerStyle={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderBottom: '1px solid #222222' }}
      modal
      dismissableMask
    >
      <div style={{ padding: '1rem' }}>
        {/* Google Sign In */}
        <Button
          label="Continue with Google"
          icon="pi pi-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="p-button-outlined"
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #e0e0e0',
            fontWeight: 500
          }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          color: '#666666'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
          <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 500,
              color: '#ffffff'
            }}>
              Email
            </label>
            <InputText
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ 
                width: '100%',
                backgroundColor: '#141414',
                border: '1px solid #333333',
                color: '#ffffff'
              }}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 500,
              color: '#ffffff'
            }}>
              Password
            </label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'At least 6 characters' : 'Enter password'}
              toggleMask
              feedback={isSignUp}
              style={{ width: '100%' }}
              inputStyle={{ 
                width: '100%',
                backgroundColor: '#141414',
                border: '1px solid #333333',
                color: '#ffffff'
              }}
              disabled={loading}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#2d1515',
              color: '#ff6b6b',
              borderRadius: '8px',
              fontSize: '0.9rem',
              border: '1px solid #4a1f1f'
            }}>
              <i className="pi pi-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
              {error}
            </div>
          )}

          <Button
            type="submit"
            label={loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            disabled={loading}
            icon={loading ? 'pi pi-spin pi-spinner' : undefined}
            style={{
              width: '100%',
              marginBottom: '1rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              fontWeight: 500
            }}
          />
        </form>

        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.9rem', 
          color: '#a0a0a0',
          marginTop: '1rem'
        }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={switchMode}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              padding: 0,
              fontWeight: 500,
              opacity: loading ? 0.5 : 1
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
