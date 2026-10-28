import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface KineticNewsCardProps {
  id?: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  imageUrl?: string;
  slug?: string;
}

export const KineticNewsCard: React.FC<KineticNewsCardProps> = ({
  id,
  title,
  excerpt,
  category = 'Campus News',
  publishedAt,
  imageUrl,
  slug,
}) => {
  const detailUrl = slug ? `/news/${slug}` : id ? `/news/${id}` : '/news';

  return (
    <div className="group relative bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] flex flex-col justify-between">
      {/* Top Media Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
            <Newspaper className="w-12 h-12 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-slate-950/90 border border-rose-500/40 text-rose-300 shadow-md">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {publishedAt && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{publishedAt}</span>
            </div>
          )}
          <h3 className="text-base font-black text-white group-hover:text-rose-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
          <Link
            to={detailUrl}
            className="text-xs font-black text-rose-400 hover:text-rose-300 inline-flex items-center gap-1.5 group-hover:underline"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
