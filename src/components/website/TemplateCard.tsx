import React from 'react';
import { ChevronRight, Calendar, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { useActiveTemplate } from '../../templates/templateRegistry';

export interface TemplateCardProps {
  title: string;
  subtitle?: string;
  categoryBadge?: string;
  dateBadge?: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  linkTo?: string;
  externalUrl?: string;
  actionText?: string;
  tags?: string[];
  footerContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  subtitle,
  categoryBadge,
  dateBadge,
  imageUrl,
  imageAlt,
  description,
  linkTo,
  externalUrl,
  actionText = 'View Details',
  tags = [],
  footerContent,
  children,
  className = '',
}) => {
  const Template = useActiveTemplate();
  const rawCode = Template.config.code || 'ENGINEERING_MODERN';
  const code = rawCode.trim().toUpperCase();

  // Template archetype classifications
  const isSlanted =
    code === 'SALESIAN_SLANTED' ||
    code === 'SALESIAN' ||
    code === 'DESIGN_3D_MODERN' ||
    code === '3D_DESIGN' ||
    code === 'TEMPLATE5' ||
    code === 'TEMPLATE_5';

  const isGlass =
    code === 'DESIGN_3D_GLASS' ||
    code === 'GLASS_3D' ||
    code === 'TEMPLATE6' ||
    code === 'TEMPLATE_6';

  const isIsometric =
    code === 'DESIGN_3D_ISOMETRIC' ||
    code === 'ISOMETRIC_3D' ||
    code === 'TEMPLATE7' ||
    code === 'TEMPLATE_7';

  const isKinetic =
    code === 'DESIGN_3D_KINETIC' ||
    code === 'KINETIC_3D' ||
    code === 'TEMPLATE8' ||
    code === 'TEMPLATE_8';

  const isNeumorphic =
    code === 'DESIGN_3D_NEUMORPHIC' ||
    code === 'NEUMORPHIC_3D' ||
    code === 'TEMPLATE9' ||
    code === 'TEMPLATE_9';

  const isEngineering =
    code === 'ENGINEERING_MODERN' ||
    code === 'ENGINEERING' ||
    code === 'TEMPLATE1' ||
    code === 'TEMPLATE_1';

  const isArts =
    code === 'ARTS_SCIENCE_MODERN' ||
    code === 'ARTS_SCIENCE' ||
    code === 'TEMPLATE2' ||
    code === 'TEMPLATE_2';

  const isMedical =
    code === 'MEDICAL_MODERN' ||
    code === 'MEDICAL' ||
    code === 'TEMPLATE3' ||
    code === 'TEMPLATE_3';

  const isUniversity =
    code === 'UNIVERSITY_MODERN' ||
    code === 'UNIVERSITY' ||
    code === 'TEMPLATE4' ||
    code === 'TEMPLATE_4';

  const LinkWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className: cName = '' }) => {
    if (externalUrl) {
      return (
        <a href={externalUrl} target="_blank" rel="noreferrer" className={`block ${cName}`}>
          {children}
        </a>
      );
    }
    if (linkTo) {
      return (
        <a href={linkTo} className={`block ${cName}`}>
          {children}
        </a>
      );
    }
    return <div className={cName}>{children}</div>;
  };

  // -------------------------------------------------------------
  // 1. SALESIAN & 3D SLANTED PARALLELOGRAM ARCHETYPE (Ref Image!)
  // -------------------------------------------------------------
  if (isSlanted) {
    return (
      <div className={`relative bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 ${className}`}>
        {/* Top Gold Stripe Accent */}
        <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />

        {/* Media Top Container - Sleek Compact Height */}
        {imageUrl ? (
          <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-gradient-to-r from-[#134975] to-[#1f639c] flex items-center justify-center p-3 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <span className="text-white/90 font-mono text-xs uppercase tracking-widest font-bold z-10 text-center">
              {categoryBadge || subtitle || 'ACADEMIC PROGRAM'}
            </span>
          </div>
        )}

        {/* Slanted Parallelogram Overlapping Content Card */}
        <div className="relative z-10 -mt-6 mx-2.5 mb-2.5 bg-white dark:bg-slate-800 border-2 border-[#134975]/20 dark:border-amber-400/30 p-4 shadow-md group-hover:border-[#e5a912] transition-colors [clip-path:polygon(0%_0%,94%_0%,100%_100%,0%_100%)]">
          {/* Category & Date Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {categoryBadge && (
              <span className="text-[11px] font-black italic text-rose-600 dark:text-rose-400 tracking-tight">
                {categoryBadge}
              </span>
            )}
            {dateBadge && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {dateBadge}
              </span>
            )}
          </div>

          {/* Title */}
          <LinkWrapper>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#134975] dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
              {title}
            </h3>
          </LinkWrapper>

          {subtitle && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mb-1">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
              {description}
            </p>
          )}

          {children}

          {/* Slanted Orange/Gold Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-2">
            <div className="flex items-center gap-1 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xs">
                  {tag}
                </span>
              ))}
            </div>

            <LinkWrapper className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black text-[11px] shadow-sm transition group-hover:translate-x-0.5 [clip-path:polygon(10%_0%,100%_0%,90%_100%,0%_100%)]">
              <span>{actionText}</span>
              <span className="font-mono text-xs leading-none">»</span>
            </LinkWrapper>
          </div>
        </div>

        {footerContent && <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. 3D HOLOGRAPHIC GLASSMORPHISM ARCHETYPE
  // -------------------------------------------------------------
  if (isGlass) {
    return (
      <div className={`relative backdrop-blur-2xl bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-cyan-500/30 rounded-3xl shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-cyan-400 ${className}`}>
        {/* Iridescent Prism Glow Ambient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
        
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-slate-950">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            {categoryBadge && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-black uppercase tracking-wider text-cyan-300 shadow-md">
                {categoryBadge}
              </div>
            )}
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-3 px-3 py-1 rounded-full backdrop-blur-md bg-cyan-950/60 border border-cyan-400/40 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                {categoryBadge}
              </div>
            )}
            {dateBadge && (
              <div className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateBadge}</span>
              </div>
            )}
            <LinkWrapper>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-cyan-700 dark:text-cyan-300/90 font-medium line-clamp-1 mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">{description}</p>}
            {children}
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all">
              <span>{actionText}</span>
              <ChevronRight className="w-4 h-4" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-white/40 dark:bg-slate-950/40 border-t border-white/20">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. 3D ISOMETRIC TACTILE ELEVATION ARCHETYPE
  // -------------------------------------------------------------
  if (isIsometric) {
    return (
      <div className={`relative bg-amber-50/40 dark:bg-slate-900 border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#0f172a] transition-all duration-200 group flex flex-col justify-between ${className}`}>
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-slate-900 bg-slate-900">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {categoryBadge && (
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-amber-300 border-2 border-slate-900 text-[10px] font-black uppercase text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
                {categoryBadge}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-2 px-2.5 py-1 bg-amber-300 border-2 border-slate-900 text-[10px] font-black uppercase text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
                {categoryBadge}
              </div>
            )}
            {dateBadge && (
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 font-mono">
                📅 {dateBadge}
              </div>
            )}
            <LinkWrapper>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 font-medium">{description}</p>}
            {children}
          </div>

          <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-black px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-900">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-950 font-black text-xs transition border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-amber-100/60 dark:bg-slate-800 border-t-2 border-slate-900">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. 3D KINETIC FLIP & PERSPECTIVE ARCHETYPE
  // -------------------------------------------------------------
  if (isKinetic) {
    return (
      <div className={`relative bg-slate-950 text-white rounded-2xl border border-purple-500/30 hover:border-rose-500 shadow-xl shadow-purple-950/20 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-2 ${className}`}>
        {/* Kinetic Neon Laser Top Highlight */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 group-hover:h-1.5 transition-all" />

        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            {categoryBadge && (
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-wider shadow-lg">
                {categoryBadge}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-2 px-2.5 py-0.5 rounded-md bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-wider">
                {categoryBadge}
              </div>
            )}
            {dateBadge && (
              <div className="text-xs text-rose-400 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dateBadge}</span>
              </div>
            )}
            <LinkWrapper>
              <h3 className="text-base font-black text-white group-hover:text-rose-400 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-purple-300 font-medium line-clamp-1 mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{description}</p>}
            {children}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-200">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-black text-xs shadow-md transition group-hover:scale-105">
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-slate-900 border-t border-slate-800">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. 3D NEUMORPHIC SOFT DEPTH ARCHETYPE
  // -------------------------------------------------------------
  if (isNeumorphic) {
    return (
      <div className={`relative bg-[#eef2f6] dark:bg-slate-900 rounded-3xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] dark:shadow-[8px_8px_16px_#0b1329,-8px_-8px_16px_#1e293b] border border-slate-200/50 dark:border-slate-800/80 hover:shadow-[14px_14px_28px_#d1d9e6,-14px_-14px_28px_#ffffff] transition-all duration-300 group flex flex-col justify-between ${className}`}>
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15)] bg-slate-300">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              {categoryBadge && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-[#eef2f6] dark:bg-slate-800 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] dark:shadow-none">
                  {categoryBadge}
                </span>
              )}
              {dateBadge && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  {dateBadge}
                </span>
              )}
            </div>

            <LinkWrapper>
              <h3 className="text-base font-black text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-teal-700 dark:text-teal-400 font-bold mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{description}</p>}
            {children}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-200">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#eef2f6] dark:bg-slate-800 text-teal-800 dark:text-teal-300 font-black text-xs shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] active:scale-95 transition-all">
              <span>{actionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="mt-4 pt-3 border-t border-slate-200">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. ENGINEERING BLUEPRINT CYBER HUD ARCHETYPE
  // -------------------------------------------------------------
  if (isEngineering) {
    return (
      <div className={`relative bg-white dark:bg-slate-950 border border-blue-300 dark:border-cyan-500/40 shadow-lg hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)] ${className}`}>
        {/* Cyber Cyan Accent Header Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {categoryBadge && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-950/90 text-cyan-300 border border-cyan-400 text-[10px] font-mono font-bold uppercase">
                [{categoryBadge}]
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-2 px-2 py-0.5 bg-blue-950/90 text-cyan-300 border border-cyan-400 text-[10px] font-mono font-bold uppercase">
                [{categoryBadge}]
              </div>
            )}
            {dateBadge && (
              <div className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold mb-2">
                &gt; {dateBadge}
              </div>
            )}
            <LinkWrapper>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-blue-700 dark:text-cyan-300 font-mono mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{description}</p>}
            {children}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap font-mono">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-slate-900 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-slate-800">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>{actionText}</span>
              <span>-&gt;</span>
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. ARTS & SCIENCE GOLD FOIL ARCHETYPE
  // -------------------------------------------------------------
  if (isArts) {
    return (
      <div className={`relative bg-white dark:bg-stone-950 rounded-2xl border-2 border-amber-300 dark:border-amber-600/40 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 ${className}`}>
        <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-600" />
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {categoryBadge && (
              <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-serif font-bold text-[10px] uppercase shadow-md">
                {categoryBadge}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between font-serif">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-serif font-bold text-[10px] uppercase shadow-md">
                {categoryBadge}
              </div>
            )}
            {dateBadge && <div className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-2">{dateBadge}</div>}
            <LinkWrapper>
              <h3 className="text-lg font-bold text-stone-900 dark:text-amber-100 group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-emerald-800 dark:text-emerald-400 font-sans font-medium mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-stone-600 dark:text-stone-300 font-sans line-clamp-2 mb-4 leading-relaxed">{description}</p>}
            {children}
          </div>

          <div className="pt-3 border-t border-amber-100 dark:border-stone-800 flex items-center justify-between font-sans">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-stone-900 text-amber-900 dark:text-amber-200 border border-amber-200">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>{actionText}</span>
              <ChevronRight className="w-4 h-4" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-amber-50/40 dark:bg-stone-900 border-t border-amber-100">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 8. MEDICAL & CLINICAL TRUST ARCHETYPE
  // -------------------------------------------------------------
  if (isMedical) {
    return (
      <div className={`relative bg-white dark:bg-slate-900 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 shadow-lg hover:shadow-2xl hover:border-teal-500 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 ${className}`}>
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {categoryBadge && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-teal-900/90 text-teal-200 text-[10px] font-extrabold uppercase shadow-md">
                {categoryBadge}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {!imageUrl && categoryBadge && (
              <div className="inline-block mb-2 px-3 py-1 rounded-full bg-teal-900/90 text-teal-200 text-[10px] font-extrabold uppercase shadow-md">
                {categoryBadge}
              </div>
            )}
            {dateBadge && <div className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-2">✦ {dateBadge}</div>}
            <LinkWrapper>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors leading-snug line-clamp-2 mb-2">
                {title}
              </h3>
            </LinkWrapper>
            {subtitle && <p className="text-xs text-teal-700 dark:text-teal-300 font-bold mb-2">{subtitle}</p>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{description}</p>}
            {children}
          </div>

          <div className="pt-3 border-t border-teal-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 border border-teal-200">
                  {tag}
                </span>
              ))}
            </div>
            <LinkWrapper className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </LinkWrapper>
          </div>
        </div>
        {footerContent && <div className="p-3 bg-teal-50/40 dark:bg-slate-800 border-t border-teal-100">{footerContent}</div>}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 9. UNIVERSITY PRESTIGE & CREST ARCHETYPE (Default Fallback)
  // -------------------------------------------------------------
  return (
    <div className={`relative bg-white dark:bg-stone-900 rounded-xl border border-stone-300 dark:border-stone-700 shadow-md hover:shadow-2xl hover:border-amber-600 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${className}`}>
      <div className="h-1.5 w-full bg-[#1b2a4a]" />
      {imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          {categoryBadge && (
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#1b2a4a] text-amber-300 text-[10px] font-serif font-bold uppercase shadow">
              {categoryBadge}
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between font-serif">
        <div>
          {!imageUrl && categoryBadge && (
            <div className="inline-block mb-2 px-2.5 py-1 bg-[#1b2a4a] text-amber-300 text-[10px] font-serif font-bold uppercase shadow">
              {categoryBadge}
            </div>
          )}
          {dateBadge && <div className="text-xs text-amber-700 dark:text-amber-400 font-bold mb-2 font-sans">{dateBadge}</div>}
          <LinkWrapper>
            <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-amber-700 transition-colors leading-snug line-clamp-2 mb-2">
              {title}
            </h3>
          </LinkWrapper>
          {subtitle && <p className="text-xs text-stone-600 dark:text-stone-300 font-sans font-medium mb-2">{subtitle}</p>}
          {description && <p className="text-xs text-stone-600 dark:text-stone-400 font-sans line-clamp-2 mb-4 leading-relaxed">{description}</p>}
          {children}
        </div>

        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-sans">
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200">
                {tag}
              </span>
            ))}
          </div>
          <LinkWrapper className="inline-flex items-center gap-1 text-xs font-bold text-[#1b2a4a] dark:text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>{actionText}</span>
            <ChevronRight className="w-4 h-4" />
          </LinkWrapper>
        </div>
      </div>
      {footerContent && <div className="p-3 bg-stone-50 dark:bg-stone-800 border-t border-stone-200">{footerContent}</div>}
    </div>
  );
};
