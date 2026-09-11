import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';

interface FacultyItem {
  name: string;
  designation: string;
  qualification?: string;
  specialization?: string;
  email?: string;
  imageUrl?: string;
}

interface FacultyProps {
  content: {
    title?: string;
    subtitle?: string;
    faculty?: FacultyItem[];
  };
}

export const FacultySection: React.FC<FacultyProps> = ({ content }) => {
const [fetchedFaculty, setFetchedFaculty] = React.useState<FacultyItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!content.faculty || content.faculty.length === 0) {
      setLoading(true);
      apiClient.get('/site/faculty')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedFaculty(res.data.data.slice(0, 4).map((f: any) => ({
              name: f.name,
              designation: f.designation,
              qualification: f.qualification,
              specialization: f.specialization,
              email: f.email,
              imageUrl: f.avatarUrl || f.imageUrl,
            })));
          }
        })
        .catch(() => setError('Unable to load faculty. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.faculty]);

  const facultyList = content.faculty && content.faculty.length > 0 ? content.faculty : fetchedFaculty;
  if (error && !loading) {
    return <SectionError message={error} className="bg-white dark:bg-slate-900" />;
  }
  if (!loading && facultyList.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Distinguished Mentors</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {content.title || 'Faculty & Leadership'}
            </h2>
            {content.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {content.subtitle}
              </p>
            )}
          </div>
          <Link
            to="/faculty"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start md:self-auto"
          >
            <span>View Faculty Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyList.map((f, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="h-52 overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                {f.imageUrl ? (
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center">
                    {f.name ? f.name.charAt(0).toUpperCase() : 'F'}
                  </div>
                )}
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {f.name}
                </h4>
                <p className="text-xs font-semibold text-primary">
                  {f.designation}
                </p>
                {f.qualification && (
                  <p className="text-[11px] text-slate-500">
                    {f.qualification}
                  </p>
                )}
                {f.specialization && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 pt-1">
                    {f.specialization}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
