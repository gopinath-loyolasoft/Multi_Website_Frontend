import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Activity, Cpu, Landmark } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';
import { 
  SkyBlueSlantedTemplate,
  RoyalGoldCurvedTemplate,
  EmeraldBotanicalTemplate,
  ModernTechPolygonTemplate
} from '../../components/auth/LoginTemplates';

export const LoginPage: React.FC = () => {
  const { siteConfig, tenantDomain } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Crest Icon & Default Tagline
  const CrestIcon = isArtsAndScience ? BookOpen : isMedical ? Activity : isUniversity ? Landmark : Cpu;
  const defaultBadge = isArtsAndScience 
    ? 'Knowledge • Character • Society' 
    : isMedical 
      ? 'Healing • Research • Compassion' 
      : isUniversity 
        ? 'Excellence • Innovation • Impact' 
        : 'Techne • Integrity • Leadership';

  // High-Resolution Campus Photography (Dynamic Admin Background or Theme Fallback)
  const campusImage = siteConfig?.settings?.loginBgImageUrl || (
    siteConfig?.settings?.logoUrl 
      ? (isArtsAndScience
          ? 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1600&auto=format&fit=crop'
          : isMedical
            ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop'
            : isUniversity
              ? 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1600&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop')
      : 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1600&auto=format&fit=crop'
  );

  const collegeName = siteConfig?.settings?.siteName || siteConfig?.tenant?.name || 'RCM College';
  const tagline = siteConfig?.settings?.tagline || defaultBadge;

  // Resolve Active Template Code
  const activeTemplate = siteConfig?.settings?.loginTemplate 
    || siteConfig?.theme?.configuration?.loginTemplate 
    || siteConfig?.tenant?.loginTemplate 
    || 'template2';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('college_auth_token', res.data.data.token);
        localStorage.setItem('college_auth_user', JSON.stringify(res.data.data));
        navigate('/admin/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const templateProps = {
    collegeName,
    tagline,
    campusImage,
    tenantDomain,
    siteConfig,
    CrestIcon,
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    loading,
    error,
    setError,
    handleLogin
  };

  switch (activeTemplate.toLowerCase()) {
    case 'template1':
      return <SkyBlueSlantedTemplate {...templateProps} />;
    case 'template3':
      return <EmeraldBotanicalTemplate {...templateProps} />;
    case 'template4':
      return <ModernTechPolygonTemplate {...templateProps} />;
    case 'template2':
    default:
      return <RoyalGoldCurvedTemplate {...templateProps} />;
  }
};
