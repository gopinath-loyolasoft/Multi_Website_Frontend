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
  ModernTechPolygonTemplate,
  SlantedNavyGoldTemplate,
  HolographicGlassLoginTemplate,
  IsometricElevationLoginTemplate,
  KineticPerspectiveLoginTemplate,
  NeumorphicSoftLoginTemplate
} from '../../components/auth/LoginTemplates';

export const LoginPage: React.FC = () => {
  const { siteConfig, tenantDomain } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity, templateCode } = useTheme();
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

  const collegeName = siteConfig?.settings?.siteName || siteConfig?.tenant?.name || 'College Campus';
  const tagline = siteConfig?.settings?.tagline || defaultBadge;

  // Resolve Active Template Code:
  // 1. Explicit website template code from Tenant or Theme Context (e.g. DESIGN_3D_GLASS, SALESIAN_SLANTED, etc.)
  // 2. Specific custom loginTemplate only if explicitly overridden
  // 3. Theme code / fallback
  const rawLoginTemplate = siteConfig?.tenant?.loginTemplate || siteConfig?.settings?.loginTemplate;
  const isCustomSpecificLogin = rawLoginTemplate && !['template2', 'template_2'].includes(rawLoginTemplate.toLowerCase());

  const activeTemplate = 
    (isCustomSpecificLogin ? rawLoginTemplate : null)
    || siteConfig?.tenant?.templateCode
    || siteConfig?.templateCode
    || templateCode
    || rawLoginTemplate
    || siteConfig?.theme?.code
    || siteConfig?.theme?.configuration?.loginTemplate
    || 'ENGINEERING_MODERN';

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

  const normalized = activeTemplate.toLowerCase().trim();

  switch (normalized) {
    case 'template1':
    case 'template_1':
    case 'pack1':
    case 'engineering_modern':
    case 'engineering':
    case 'modern_tech_polygon':
    case 'polygon':
    case 'theme_blue':
    case 'eng_royal':
    case 'blue':
      return <ModernTechPolygonTemplate {...templateProps} />;

    case 'template2':
    case 'template_2':
    case 'pack2':
    case 'arts_science_modern':
    case 'arts_science':
    case 'royal_gold_curved':
    case 'theme_gold':
    case 'arts_green':
    case 'gold':
      return <RoyalGoldCurvedTemplate {...templateProps} />;

    case 'template3':
    case 'template_3':
    case 'pack3':
    case 'medical_modern':
    case 'medical':
    case 'emerald_botanical':
    case 'botanical':
    case 'theme_teal':
    case 'nursing_care':
    case 'theme_emerald':
      return <EmeraldBotanicalTemplate {...templateProps} />;

    case 'template4':
    case 'template_4':
    case 'pack4':
    case 'university_modern':
    case 'university':
    case 'skyblue_slanted':
    case 'sky_blue':
    case 'theme_crimson':
    case 'univ_crimson':
      return <SkyBlueSlantedTemplate {...templateProps} />;

    case 'template5':
    case 'template_5':
    case 'pack5':
    case 'salesian_slanted':
    case 'design_3d_modern':
    case '3d_slanted':
    case 'theme_slanted_navy':
      return <SlantedNavyGoldTemplate {...templateProps} />;

    case 'template6':
    case 'template_6':
    case 'pack6':
    case 'design_3d_glass':
    case 'glass_3d':
    case 'holographic_glass':
    case 'theme_cyber_glass':
      return <HolographicGlassLoginTemplate {...templateProps} />;

    case 'template7':
    case 'template_7':
    case 'pack7':
    case 'design_3d_isometric':
    case 'isometric_3d':
    case 'isometric':
    case 'theme_tactile_voxel':
      return <IsometricElevationLoginTemplate {...templateProps} />;

    case 'template8':
    case 'template_8':
    case 'pack8':
    case 'design_3d_kinetic':
    case 'kinetic_3d':
    case 'kinetic':
    case 'theme_kinetic_neon':
      return <KineticPerspectiveLoginTemplate {...templateProps} />;

    case 'template9':
    case 'template_9':
    case 'pack9':
    case 'design_3d_neumorphic':
    case 'neumorphic_3d':
    case 'neumorphic':
    case 'theme_soft_neumorphic':
      return <NeumorphicSoftLoginTemplate {...templateProps} />;

    default:
      return <ModernTechPolygonTemplate {...templateProps} />;
  }
};

