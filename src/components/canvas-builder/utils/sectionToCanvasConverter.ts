import { CanvasBlock } from '../../../types/canvasBuilder';
import { SectionSettings } from '../../../types';

/**
 * Converts any standard section content filled in Step 3 into rich drag-and-drop Canvas blocks
 */
export function convertSectionToCanvasBlocks(
  sectionType: string,
  content: Record<string, any> = {},
  title?: string,
  subtitle?: string,
  settings?: SectionSettings,
  forceReconvert: boolean = false
): CanvasBlock[] {
  // If content already contains custom canvas blocks and we are not forcing re-conversion, return them
  if (!forceReconvert && Array.isArray(content.blocks) && content.blocks.length > 0) {
    return content.blocks;
  }

  const norm = (sectionType || '').toUpperCase().trim();
  const blocks: CanvasBlock[] = [];
  const secTitle = title || content.title || content.heading || content.name;
  const secSubtitle = subtitle || content.subtitle || content.subheading || content.subheadline || content.caption;
  const badge = content.badge || content.tagline || '';
  const alignment = settings?.alignment || content?.alignment || 'center';
  const columns = Number(settings?.columns) || (norm === 'CARDS' || norm === 'STATISTICS' || norm === 'ICON_CARDS' ? 3 : 1);

  // 1. Add Section Top Heading & Subtitle if available (skip IMAGE_TEXT which renders heading inside narrative text column)
  if ((secTitle || secSubtitle || badge) && norm !== 'IMAGE_TEXT') {
    blocks.push({
      id: `blk-head-${Date.now()}-0`,
      type: 'HEADING',
      content: {
        badge: badge,
        text: secTitle || 'Section Headline',
        tag: 'h2',
      },
      styles: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#0f172a',
        alignment: alignment,
        marginY: 'sm',
      },
    });

    if (secSubtitle) {
      blocks.push({
        id: `blk-sub-${Date.now()}-1`,
        type: 'PARAGRAPH',
        content: {
          text: secSubtitle,
        },
        styles: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          color: '#64748B',
          alignment: alignment,
          marginY: 'sm',
        },
      });
    }
  }

  // Helper to wrap items in multi-column container based on columns count or item length
  const wrapInColumnsIfNeeded = (items: CanvasBlock[]): CanvasBlock[] => {
    if (items.length <= 1) return items;

    if (columns === 2 || (items.length === 2 && columns <= 2)) {
      const col1: CanvasBlock[] = [];
      const col2: CanvasBlock[] = [];
      items.forEach((item, idx) => {
        if (idx % 2 === 0) col1.push(item);
        else col2.push(item);
      });
      return [
        {
          id: `blk-col-2-${Date.now()}`,
          type: 'CONTAINER_2_COL',
          content: {},
          columns: [
            { id: `col-1-${Date.now()}`, blocks: col1 },
            { id: `col-2-${Date.now()}`, blocks: col2 },
          ],
          styles: { marginY: 'md' },
        },
      ];
    } else if (columns >= 3 || (items.length >= 3 && columns !== 2)) {
      const col1: CanvasBlock[] = [];
      const col2: CanvasBlock[] = [];
      const col3: CanvasBlock[] = [];
      items.forEach((item, idx) => {
        if (idx % 3 === 0) col1.push(item);
        else if (idx % 3 === 1) col2.push(item);
        else col3.push(item);
      });
      return [
        {
          id: `blk-col-3-${Date.now()}`,
          type: 'CONTAINER_3_COL',
          content: {},
          columns: [
            { id: `col-1-${Date.now()}`, blocks: col1 },
            { id: `col-2-${Date.now()}`, blocks: col2 },
            { id: `col-3-${Date.now()}`, blocks: col3 },
          ],
          styles: { marginY: 'md' },
        },
      ];
    }
    return items;
  };

  // 2. Map specific content types and fields to appropriate blocks
  switch (norm) {
    // ─── 1. DOCUMENTS & CIRCULARS ──────────────────────────────────────────
    case 'DOCUMENTS':
    case 'DOCUMENT_DOWNLOADS':
    case 'CIRCULARS':
    case 'DOWNLOADS': {
      const docs: any[] = Array.isArray(content.documents) ? content.documents : [];
      const docBlocks: CanvasBlock[] = [];
      if (docs.length > 0) {
        docs.forEach((doc, idx) => {
          docBlocks.push({
            id: `blk-doc-${Date.now()}-${idx}`,
            type: 'DOCUMENT_PDF',
            content: {
              title: doc.title || 'Official Document.pdf',
              description: doc.description || doc.category || '',
              fileUrl: doc.fileUrl || '',
              fileType: doc.fileType || 'PDF',
              fileSize: doc.fileSize || '2.4 MB',
              publishDate: doc.publishDate || '',
              buttonText: 'View Document',
            },
            styles: {
              borderRadius: 'xl',
              shadow: 'sm',
              borderColor: '#e2e8f0',
              backgroundColor: '#ffffff',
              marginY: 'sm',
            },
          });
        });
      } else {
        // Fallback default sample document
        docBlocks.push({
          id: `blk-doc-${Date.now()}-0`,
          type: 'DOCUMENT_PDF',
          content: {
            title: 'Academic Regulation & Syllabus Curriculum (2026-27)',
            description: 'Comprehensive course structure, credit distribution, and evaluation scheme.',
            fileUrl: '#',
            fileType: 'PDF',
            fileSize: '2.4 MB',
            publishDate: 'Sep 2026',
            buttonText: 'View Document',
          },
          styles: {
            borderRadius: 'xl',
            shadow: 'sm',
            backgroundColor: '#ffffff',
            marginY: 'sm',
          },
        });
      }
      blocks.push(...wrapInColumnsIfNeeded(docBlocks));
      break;
    }

    // ─── 2. HERO BANNER ───────────────────────────────────────────────────
    case 'HERO': {
      if (content.backgroundImage) {
        blocks.push({
          id: `blk-hero-img-${Date.now()}`,
          type: 'IMAGE',
          content: {
            imageUrl: content.backgroundImage,
            alt: content.heading || 'Hero Banner',
          },
          styles: {
            aspectRatio: '16:9',
            borderRadius: '2xl',
            shadow: 'lg',
            marginY: 'md',
          },
        });
      }
      if (content.description) {
        blocks.push({
          id: `blk-hero-desc-${Date.now()}`,
          type: 'PARAGRAPH',
          content: { text: content.description },
          styles: {
            fontSize: '18px',
            color: '#475569',
            alignment: alignment,
            marginY: 'md',
          },
        });
      }
      if (content.ctaText || content.secondaryCtaText) {
        const btnBlocks: CanvasBlock[] = [];
        if (content.ctaText) {
          btnBlocks.push({
            id: `blk-hero-btn1-${Date.now()}`,
            type: 'BUTTON',
            content: {
              label: content.ctaText,
              url: content.ctaLink || '/admissions',
            },
            styles: {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              alignment: alignment,
              borderRadius: 'xl',
              shadow: 'md',
              marginY: 'sm',
            },
          });
        }
        if (content.secondaryCtaText) {
          btnBlocks.push({
            id: `blk-hero-btn2-${Date.now()}`,
            type: 'BUTTON',
            content: {
              label: content.secondaryCtaText,
              url: content.secondaryCtaLink || '/contact',
            },
            styles: {
              backgroundColor: '#0f172a',
              color: '#ffffff',
              alignment: alignment,
              borderRadius: 'xl',
              shadow: 'md',
              marginY: 'sm',
            },
          });
        }
        blocks.push(...wrapInColumnsIfNeeded(btnBlocks));
      }
      break;
    }

    // ─── 3. HERO SLIDER & BANNERS ─────────────────────────────────────────
    case 'HERO_SLIDER':
    case 'BANNERS': {
      const slides: any[] = Array.isArray(content.slides) ? content.slides : [];
      if (slides.length > 0) {
        const slideCards: CanvasBlock[] = slides.map((slide, idx) => ({
          id: `blk-slide-${Date.now()}-${idx}`,
          type: 'ICON_BOX',
          content: {
            title: slide.headline || `Slide ${idx + 1}`,
            description: slide.caption || '',
            badge: slide.badge || `Slide #${idx + 1}`,
          },
          styles: {
            backgroundColor: '#ffffff',
            borderRadius: '2xl',
            shadow: 'md',
            paddingY: 'md',
            paddingX: 'md',
          },
        }));
        blocks.push(...wrapInColumnsIfNeeded(slideCards));
      }
      break;
    }

    // ─── 4. IMAGE + TEXT (2-COLUMN) ───────────────────────────────────────
    case 'IMAGE_TEXT': {
      const imgCol: CanvasBlock[] = [
        {
          id: `blk-img-${Date.now()}`,
          type: 'IMAGE',
          content: {
            imageUrl:
              content.imageUrl ||
              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
            alt: 'Feature Photo',
          },
          styles: {
            aspectRatio: '4:3',
            borderRadius: '2xl',
            shadow: 'md',
          },
        },
      ];

      const textCol: CanvasBlock[] = [];

      if (secTitle) {
        textCol.push({
          id: `blk-head-${Date.now()}-0`,
          type: 'HEADING',
          content: {
            badge: badge,
            text: secTitle || 'Empowering Next-Gen Leaders',
            tag: 'h2',
          },
          styles: {
            fontFamily: "'Poppins', sans-serif",
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0f172a',
            alignment: 'left',
            marginY: 'sm',
          },
        });
      }

      if (content.description || content.text) {
        textCol.push({
          id: `blk-story-${Date.now()}`,
          type: 'PARAGRAPH',
          content: {
            text:
              content.description ||
              content.text ||
              'Our state-of-the-art facilities offer cutting-edge learning environments designed for research, collaboration, and student success.',
          },
          styles: {
            fontSize: '16px',
            color: '#475569',
            lineHeight: '1.7',
          },
        });
      }

      if (Array.isArray(content.points) && content.points.length > 0) {
        content.points.forEach((pt: string, idx: number) => {
          textCol.push({
            id: `blk-pt-${Date.now()}-${idx}`,
            type: 'PARAGRAPH',
            content: { text: `✓  ${pt}` },
            styles: { fontSize: '14px', fontWeight: 'bold', color: '#1e293b' },
          });
        });
      }

      if (content.ctaText || content.buttonText) {
        textCol.push({
          id: `blk-btn-${Date.now()}`,
          type: 'BUTTON',
          content: {
            label: content.ctaText || content.buttonText || 'Discover More',
            url: content.ctaLink || content.buttonUrl || '/about',
          },
          styles: {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: 'xl',
            shadow: 'sm',
            marginY: 'sm',
          },
        });
      }

      blocks.push({
        id: `blk-grid-imgtext-${Date.now()}`,
        type: 'CONTAINER_2_COL',
        content: {},
        styles: { marginY: 'md' },
        columns: [
          { id: `col-1-${Date.now()}`, blocks: imgCol },
          { id: `col-2-${Date.now()}`, blocks: textCol },
        ],
      });
      break;
    }

    // ─── 5. CARDS & ICON FEATURES ─────────────────────────────────────────
    case 'CARDS':
    case 'ICON_CARDS': {
      const items: any[] = Array.isArray(content.items) ? content.items : [];
      const cardBlocks: CanvasBlock[] = [];

      if (items.length > 0) {
        items.forEach((item, idx) => {
          cardBlocks.push({
            id: `blk-card-${Date.now()}-${idx}`,
            type: 'ICON_BOX',
            content: {
              title: item.title || `Key Pillar 0${idx + 1}`,
              description: item.description || item.desc || 'Academic training and career development.',
              badge: item.badge || `Pillar #${idx + 1}`,
            },
            styles: {
              backgroundColor: '#f8fafc',
              borderRadius: '2xl',
              borderColor: '#e2e8f0',
              shadow: 'sm',
              paddingY: 'md',
              paddingX: 'md',
            },
          });
        });
      } else {
        // 3 sample cards
        for (let i = 1; i <= 3; i++) {
          cardBlocks.push({
            id: `blk-card-${Date.now()}-${i}`,
            type: 'ICON_BOX',
            content: {
              title: `Institutional Excellence 0${i}`,
              description: 'World-class curricula accredited by leading international academic bodies.',
              badge: `Feature #${i}`,
            },
            styles: {
              backgroundColor: '#f8fafc',
              borderRadius: '2xl',
              borderColor: '#e2e8f0',
              shadow: 'sm',
              paddingY: 'md',
              paddingX: 'md',
            },
          });
        }
      }
      blocks.push(...wrapInColumnsIfNeeded(cardBlocks));
      break;
    }

    // ─── 6. STATISTICS & COUNTERS ────────────────────────────────────────
    case 'STATISTICS':
    case 'STATS': {
      const stats: any[] = Array.isArray(content.items) ? content.items : [];
      const statBlocks: CanvasBlock[] = [];

      if (stats.length > 0) {
        stats.forEach((st, idx) => {
          statBlocks.push({
            id: `blk-stat-${Date.now()}-${idx}`,
            type: 'STAT_COUNTER',
            content: {
              value: st.value || '98',
              suffix: st.suffix || '',
              label: st.label || 'Metric',
              description: st.description || '',
            },
            styles: {
              fontSize: '44px',
              fontWeight: 'extrabold',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              borderRadius: '2xl',
              paddingY: 'md',
            },
          });
        });
      } else {
        const defaults = [
          { value: '98', suffix: '%', label: 'Placement Rate' },
          { value: '15k', suffix: '+', label: 'Enrolled Scholars' },
          { value: '#1', suffix: '', label: 'Institutional Rank' },
        ];
        defaults.forEach((st, idx) => {
          statBlocks.push({
            id: `blk-stat-${Date.now()}-${idx}`,
            type: 'STAT_COUNTER',
            content: st,
            styles: {
              fontSize: '44px',
              fontWeight: 'extrabold',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              borderRadius: '2xl',
              paddingY: 'md',
            },
          });
        });
      }
      blocks.push(...wrapInColumnsIfNeeded(statBlocks));
      break;
    }

    // ─── 7. CALL TO ACTION (CTA) ──────────────────────────────────────────
    case 'CTA':
    case 'CALL_TO_ACTION': {
      if (content.subheadline || content.description) {
        blocks.push({
          id: `blk-cta-desc-${Date.now()}`,
          type: 'PARAGRAPH',
          content: { text: content.subheadline || content.description },
          styles: { fontSize: '18px', color: '#475569', alignment: alignment, marginY: 'sm' },
        });
      }
      const ctaBtns: CanvasBlock[] = [];
      if (content.buttonText) {
        ctaBtns.push({
          id: `blk-btn1-${Date.now()}`,
          type: 'BUTTON',
          content: { label: content.buttonText, url: content.buttonUrl || '/admissions' },
          styles: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: 'xl', shadow: 'md' },
        });
      }
      if (content.secondaryButtonText) {
        ctaBtns.push({
          id: `blk-btn2-${Date.now()}`,
          type: 'BUTTON',
          content: { label: content.secondaryButtonText, url: content.secondaryButtonUrl || '/brochure.pdf' },
          styles: { backgroundColor: '#0f172a', color: '#ffffff', borderRadius: 'xl', shadow: 'md' },
        });
      }
      blocks.push(...wrapInColumnsIfNeeded(ctaBtns));
      break;
    }

    // ─── 8. QUOTE & LEADERSHIP ────────────────────────────────────────────
    case 'QUOTE': {
      if (content.quoteText) {
        blocks.push({
          id: `blk-quote-${Date.now()}`,
          type: 'PARAGRAPH',
          content: { text: `"${content.quoteText}"` },
          styles: {
            fontSize: '22px',
            fontWeight: 'semibold',
            fontFamily: "'Playfair Display', serif",
            color: '#1e293b',
            alignment: 'center',
            marginY: 'md',
          },
        });
      }
      if (content.authorImageUrl || content.authorImage || content.imageUrl) {
        blocks.push({
          id: `blk-author-img-${Date.now()}`,
          type: 'IMAGE',
          content: {
            imageUrl: content.authorImageUrl || content.authorImage || content.imageUrl,
            alt: content.authorName || 'Leader Portrait',
            caption: content.authorName || '',
          },
          styles: {
            aspectRatio: 'circle',
            width: '100px',
            flexAlignment: 'center',
            shadow: 'md',
            marginY: 'sm',
          },
        });
      }
      if (content.authorName || content.designation) {
        blocks.push({
          id: `blk-author-${Date.now()}`,
          type: 'HEADING',
          content: {
            text: content.authorName || 'Institution Leader',
            badge: content.designation || content.subText || '',
            tag: 'h3',
          },
          styles: { fontSize: '18px', fontWeight: 'bold', alignment: 'center', color: '#2563eb', marginY: 'sm' },
        });
      }
      break;
    }

    // ─── 9. FAQ / ACCORDION ──────────────────────────────────────────────
    case 'FAQ':
    case 'ACCORDION': {
      const faqs: any[] = Array.isArray(content.items) ? content.items : [];
      blocks.push({
        id: `blk-acc-${Date.now()}`,
        type: 'ACCORDION',
        content: {
          allowMultipleOpen: false,
          defaultExpandedIndex: 0,
          items:
            faqs.length > 0
              ? faqs.map((it, idx) => ({
                  id: `acc-item-${idx}`,
                  title: it.question || it.title || `FAQ Question ${idx + 1}`,
                  content: it.answer || it.content || 'Detailed explanation...',
                  badge: it.badge || `FAQ #${idx + 1}`,
                }))
              : [
                  {
                    id: 'acc-1',
                    title: 'What are the primary eligibility criteria for admissions?',
                    content: 'Undergraduate applicants require minimum 60% in higher secondary (10+2).',
                    badge: 'Admissions',
                  },
                ],
        },
        styles: { backgroundColor: '#ffffff', borderRadius: 'xl', shadow: 'sm', marginY: 'md' },
      });
      break;
    }

    // ─── 9B. VIDEO SHOWCASE ───────────────────────────────────────────────
    case 'VIDEO':
    case 'VIDEO_POPUP': {
      blocks.push({
        id: `blk-vid-${Date.now()}`,
        type: 'VIDEO_POPUP',
        content: {
          videoUrl: content.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          coverImageUrl: content.coverImageUrl || content.posterUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
          title: content.title || content.caption || 'Campus Life & Innovation',
          badge: content.badge || 'Virtual Tour 2026',
          duration: content.duration || '3:45 Min',
        },
        styles: { aspectRatio: '16:9', borderRadius: '2xl', shadow: 'xl', marginY: 'md' },
      });
      break;
    }

    // ─── 9C. COUNTDOWN TIMER ──────────────────────────────────────────────
    case 'COUNTDOWN':
    case 'COUNTDOWN_TIMER': {
      blocks.push({
        id: `blk-count-${Date.now()}`,
        type: 'COUNTDOWN_TIMER',
        content: {
          targetDate: content.targetDate || '2026-10-31T23:59:59',
          eventTitle: content.eventTitle || content.title || 'Admissions Round 2026-27',
          eventSubtitle: content.eventSubtitle || content.subtitle || 'Applications closing soon',
          daysLabel: 'Days',
          hoursLabel: 'Hours',
          minutesLabel: 'Mins',
          secondsLabel: 'Secs',
          ctaButtonText: content.ctaButtonText || 'Apply Online Now',
          ctaButtonUrl: content.ctaButtonUrl || '/admissions',
        },
        styles: { backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '2xl', shadow: 'lg', paddingY: 'lg', marginY: 'md' },
      });
      break;
    }

    // ─── 10. GALLERY ──────────────────────────────────────────────────────
    case 'GALLERY': {
      const imgs: any[] = Array.isArray(content.images) ? content.images : [];
      const imgBlocks: CanvasBlock[] = [];
      imgs.forEach((img, idx) => {
        imgBlocks.push({
          id: `blk-gal-${Date.now()}-${idx}`,
          type: 'IMAGE',
          content: {
            imageUrl: img.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600',
            caption: img.title || `Campus Photo #${idx + 1}`,
          },
          styles: { aspectRatio: '4:3', borderRadius: 'xl', shadow: 'sm' },
        });
      });
      blocks.push(...wrapInColumnsIfNeeded(imgBlocks));
      break;
    }

    // ─── 11. TIMELINE & MILESTONES ────────────────────────────────────────
    case 'TIMELINE':
    case 'MILESTONES':
    case 'HISTORY': {
      const items: any[] = Array.isArray(content.items) ? content.items : [];
      blocks.push({
        id: `blk-timeline-${Date.now()}`,
        type: 'TIMELINE_ROADMAP',
        content: {
          items:
            items.length > 0
              ? items.map((it, idx) => ({
                  id: `time-${idx}`,
                  year: it.year || `${2010 + idx * 4}`,
                  title: it.title || `Milestone Phase ${idx + 1}`,
                  description: it.description || 'Institutional achievement and expansion milestone.',
                  badge: it.badge || it.year || `Phase ${idx + 1}`,
                }))
              : [
                  { id: 'time-1', year: '2010', title: 'Institution Established', description: 'Founded with 3 core engineering programs and 300 scholars.', badge: 'Foundation' },
                  { id: 'time-2', year: '2018', title: 'NAAC A++ Accreditation', description: 'Awarded highest institutional grade by the national council.', badge: 'Quality' },
                  { id: 'time-3', year: '2026', title: 'Autonomous Innovation Campus', description: 'Ranked top 10 nationally with research centers of excellence.', badge: 'Excellence' },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 12. TABS & SWITCHABLE CONTENT ─────────────────────────────────────
    case 'TABS':
    case 'CONTENT_TABS':
    case 'TABS_LAYOUT': {
      const tabs: any[] = Array.isArray(content.tabs) ? content.tabs : [];
      blocks.push({
        id: `blk-tabs-${Date.now()}`,
        type: 'TABS_SWITCHER',
        content: {
          activeTabIndex: 0,
          tabs:
            tabs.length > 0
              ? tabs.map((t, idx) => ({
                  id: `tab-${idx}`,
                  title: t.title || `Tab ${idx + 1}`,
                  badge: t.badge || `Section ${idx + 1}`,
                  content: t.content || 'Detailed overview and description for this topic.',
                }))
              : [
                  { id: 'tab-1', title: 'Curriculum & Syllabus', badge: 'Core', content: 'Comprehensive academic syllabus detailing foundational concepts, elective modules, and hands-on laboratory requirements.' },
                  { id: 'tab-2', title: 'Laboratories & Research', badge: 'Facilities', content: 'Advanced computing labs equipped with high-performance workstations, IoT testbeds, and dedicated robotics workstations.' },
                  { id: 'tab-3', title: 'Placements & Careers', badge: 'Recruiters', content: 'Robust placement training with over 150+ Tier-1 corporate partners and dedicated career mentorship cells.' },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 13. FACULTY & DIRECTORY ──────────────────────────────────────────
    case 'FACULTY':
    case 'FACULTY_DIRECTORY': {
      const members: any[] = Array.isArray(content.members) ? content.members : [];
      blocks.push({
        id: `blk-faculty-${Date.now()}`,
        type: 'FACULTY_GRID',
        content: {
          members:
            members.length > 0
              ? members
              : [
                  {
                    id: 'fac-1',
                    name: 'Dr. Sarah Jenkins, Ph.D.',
                    designation: 'Professor & Head of Department',
                    qualification: 'Ph.D. Computer Science (Stanford)',
                    specialization: 'Artificial Intelligence & Robotics',
                    email: 's.jenkins@college.edu',
                    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    id: 'fac-2',
                    name: 'Dr. Robert Chen, Ph.D.',
                    designation: 'Associate Professor',
                    qualification: 'Ph.D. Microelectronics (MIT)',
                    specialization: 'VLSI Design & Quantum Architecture',
                    email: 'r.chen@college.edu',
                    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    id: 'fac-3',
                    name: 'Dr. Emily Watson, Ph.D.',
                    designation: 'Assistant Professor',
                    qualification: 'Ph.D. Cybersecurity (Oxford)',
                    specialization: 'Network Security & Blockchain',
                    email: 'e.watson@college.edu',
                    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                  },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 14. NOTICES & CIRCULARS ──────────────────────────────────────────
    case 'NOTICES':
    case 'CIRCULARS':
    case 'ANNOUNCEMENTS': {
      const notices: any[] = Array.isArray(content.notices) ? content.notices : [];
      blocks.push({
        id: `blk-notices-${Date.now()}`,
        type: 'NOTICES_LIST',
        content: {
          notices:
            notices.length > 0
              ? notices
              : [
                  { id: 'not-1', date: 'SEP 28, 2026', title: 'End-Semester Examination Timetable & Hall Ticket Release', category: 'EXAMINATION', fileUrl: '#', isNew: true },
                  { id: 'not-2', date: 'SEP 22, 2026', title: 'National Innovation & Research Fellowship Grant Applications Open', category: 'RESEARCH', fileUrl: '#', isNew: false },
                  { id: 'not-3', date: 'SEP 15, 2026', title: 'Campus Placement Drive & Pre-Placement Talk by Global Tier-1 Recruiters', category: 'PLACEMENT', fileUrl: '#', isNew: false },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 15. LOGO MATRIX / PARTNERS / RECRUITERS ──────────────────────────
    case 'LOGO_GRID':
    case 'PARTNERS':
    case 'RECRUITERS': {
      const partners: any[] = Array.isArray(content.partners) ? content.partners : [];
      blocks.push({
        id: `blk-logos-${Date.now()}`,
        type: 'LOGO_MATRIX',
        content: {
          partners:
            partners.length > 0
              ? partners
              : [
                  { id: 'p-1', name: 'Google', category: 'Tech Partner' },
                  { id: 'p-2', name: 'Microsoft', category: 'Enterprise' },
                  { id: 'p-3', name: 'Amazon', category: 'Cloud & AI' },
                  { id: 'p-4', name: 'Deloitte', category: 'Consulting' },
                  { id: 'p-5', name: 'Intel', category: 'Semiconductors' },
                  { id: 'p-6', name: 'Cisco', category: 'Networking' },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 16. COURSES & DEPARTMENTS ────────────────────────────────────────
    case 'COURSES':
    case 'PROGRAMS':
    case 'DEPARTMENTS': {
      const courses: any[] = Array.isArray(content.courses) ? content.courses : [];
      blocks.push({
        id: `blk-courses-${Date.now()}`,
        type: 'COURSE_CARDS',
        content: {
          courses:
            courses.length > 0
              ? courses
              : [
                  {
                    id: 'c-1',
                    title: 'B.Tech in Artificial Intelligence & Data Science',
                    degree: 'Undergraduate',
                    duration: '4 Years (8 Semesters)',
                    intake: '120 Seats',
                    description: 'Comprehensive study of deep neural networks, machine learning algorithms, and high-performance computing.',
                    ctaText: 'Curriculum & Details',
                    ctaUrl: '#',
                  },
                  {
                    id: 'c-2',
                    title: 'B.Tech in Computer Science & Engineering',
                    degree: 'Undergraduate',
                    duration: '4 Years (8 Semesters)',
                    intake: '180 Seats',
                    description: 'Foundational computing, distributed architectures, cloud computing platforms, and full-stack software development.',
                    ctaText: 'Curriculum & Details',
                    ctaUrl: '#',
                  },
                  {
                    id: 'c-3',
                    title: 'M.Tech in Cybersecurity & Network Defense',
                    degree: 'Postgraduate',
                    duration: '2 Years (4 Semesters)',
                    intake: '60 Seats',
                    description: 'Applied cryptography, digital forensics, ethical hacking protocols, and corporate compliance frameworks.',
                    ctaText: 'Curriculum & Details',
                    ctaUrl: '#',
                  },
                ],
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 17. CAMPUS MAP & DIRECTIONS ──────────────────────────────────────
    case 'MAP':
    case 'DIRECTIONS': {
      blocks.push({
        id: `blk-map-${Date.now()}`,
        type: 'MAP_EMBED',
        content: {
          campusName: content.campusName || 'Main Institutional Campus',
          address: content.address || 'Knowledge Corridor, Innovation Highway, Campus City - 600001',
          phone: content.phone || '+91 44 2876 5432 / admissions@college.edu',
          officeHours: content.officeHours || 'Monday – Saturday: 8:30 AM – 5:30 PM',
          mapEmbedUrl: content.mapEmbedUrl || 'https://maps.google.com',
          ctaText: content.ctaText || 'Get Driving Directions',
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── 18. DATA TABLE & MATRIX ──────────────────────────────────────────
    case 'TABLE': {
      const initialTable = content.tableData || {
        rows: 3,
        cols: 3,
        data: [
          ['Program Track', 'Eligibility', 'Intake Capacity'],
          ['B.Tech Computer Science', '10+2 with 60% PCM', '180 Seats'],
          ['M.Tech Artificial Intelligence', 'B.Tech / B.E. (GATE)', '60 Seats'],
        ],
      };
      blocks.push({
        id: `blk-table-${Date.now()}`,
        type: 'TABLE',
        content: {},
        tableData: initialTable,
        styles: {
          width: '100%',
          cellPadding: '8px',
          cellBorderWidth: '1px',
          cellBorderStyle: 'solid',
          cellBorderColor: '#cbd5e1',
          borderCollapse: 'collapse',
          marginY: 'md',
        },
      });
      break;
    }

    // ─── 19. TESTIMONIALS ─────────────────────────────────────────────────
    case 'TESTIMONIALS':
    case 'TESTIMONIAL':
    case 'REVIEWS':
    case 'ALUMNI_STORIES': {
      const tests: any[] = Array.isArray(content.testimonials) ? content.testimonials : [];
      const testBlocks: CanvasBlock[] = [];
      tests.forEach((t, idx) => {
        testBlocks.push({
          id: `blk-test-${Date.now()}-${idx}`,
          type: 'ICON_BOX',
          content: {
            title: `"${t.quote || 'Inspiring experience at college'}"`,
            description: `${t.name || 'Alumnus'} • ${t.role || t.degree || ''} ${t.company ? `at ${t.company}` : ''}`,
            badge: `⭐ 5.0 Rating`,
          },
          styles: { backgroundColor: '#f8fafc', borderRadius: '2xl', shadow: 'sm', marginY: 'sm' },
        });
      });
      blocks.push(...wrapInColumnsIfNeeded(testBlocks));
      break;
    }

    // ─── 20. NEWS & EVENTS ────────────────────────────────────────────────
    case 'NEWS':
    case 'EVENTS': {
      const items: any[] = Array.isArray(content.items) ? content.items : [];
      const newsBlocks: CanvasBlock[] = [];
      if (items.length > 0) {
        items.forEach((item, idx) => {
          newsBlocks.push({
            id: `blk-news-${Date.now()}-${idx}`,
            type: 'ICON_BOX',
            content: {
              title: item.title || `Campus Headline ${idx + 1}`,
              description: item.description || item.excerpt || 'Latest research and student developments.',
              badge: item.date || item.category || 'Update',
            },
            styles: { backgroundColor: '#ffffff', borderRadius: '2xl', borderColor: '#e2e8f0', shadow: 'sm', paddingY: 'md', paddingX: 'md' },
          });
        });
      } else {
        for (let i = 1; i <= 3; i++) {
          newsBlocks.push({
            id: `blk-news-${Date.now()}-${i}`,
            type: 'ICON_BOX',
            content: {
              title: i === 1 ? 'International Robotics Summit 2026' : i === 2 ? 'National Research Grant Awarded' : 'Annual Cultural & Tech Symposium',
              description: 'Campus delegates and faculty present breakthrough research papers.',
              badge: `Oct ${10 + i * 5}, 2026`,
            },
            styles: { backgroundColor: '#ffffff', borderRadius: '2xl', borderColor: '#e2e8f0', shadow: 'sm', paddingY: 'md', paddingX: 'md' },
          });
        }
      }
      blocks.push(...wrapInColumnsIfNeeded(newsBlocks));
      break;
    }

    // ─── 21. CONTACT & INQUIRY ────────────────────────────────────────────
    case 'CONTACT': {
      blocks.push({
        id: `blk-contact-${Date.now()}`,
        type: 'MAP_EMBED',
        content: {
          campusName: content.heading || 'Admissions & Helpdesk Directorate',
          address: content.address || 'Knowledge Corridor, Innovation Highway, Campus City - 600001',
          phone: content.phone || '+91 44 2876 5432 / +91 98765 43210',
          email: content.email || 'admissions@college.edu / helpdesk@college.edu',
          officeHours: content.officeHours || 'Monday – Saturday: 8:30 AM – 5:30 PM',
          mapEmbedUrl: 'https://maps.google.com',
          ctaText: 'Reach Admissions Desk',
        },
        styles: { marginY: 'md' },
      });
      break;
    }

    // ─── DEFAULT FALLBACK ─────────────────────────────────────────────────
    default: {
      if (content.leadText) {
        blocks.push({
          id: `blk-lead-${Date.now()}`,
          type: 'PARAGRAPH',
          content: { text: content.leadText },
          styles: { fontSize: '18px', fontWeight: 'medium', color: '#334155', marginY: 'sm' },
        });
      }
      if (content.text || content.body || content.bodyHtml) {
        blocks.push({
          id: `blk-text-${Date.now()}`,
          type: 'PARAGRAPH',
          content: { text: content.text || content.body || content.bodyHtml },
          styles: {
            fontSize: '16px',
            color: '#475569',
            alignment: 'left',
            lineHeight: '1.7',
            marginY: 'sm',
          },
        });
      }
      break;
    }
  }

  return blocks;
}

/**
 * Traverses visual Canvas blocks and maps edits back to structured Step 3 section content
 */
export function syncBlocksToStructuredContent(
  sectionType: string,
  blocks: CanvasBlock[],
  existingContent: Record<string, any> = {}
): Record<string, any> {
  const norm = (sectionType || '').toUpperCase().trim();
  const updated: Record<string, any> = { ...existingContent, blocks };

  // Helper to collect all blocks including nested column blocks
  const allBlocks: CanvasBlock[] = [];
  const collect = (list: CanvasBlock[]) => {
    for (const b of list) {
      allBlocks.push(b);
      if (b.columns) {
        for (const col of b.columns) {
          if (col.blocks && col.blocks.length > 0) {
            collect(col.blocks);
          }
        }
      }
    }
  };
  collect(blocks);

  // 1. Headings & Badges
  const headingBlocks = allBlocks.filter((b) => b.type === 'HEADING');
  if (headingBlocks.length > 0) {
    const firstH = headingBlocks[0];
    if (firstH.content?.text) {
      if (norm === 'IMAGE_TEXT' || norm === 'CTA' || norm === 'CALL_TO_ACTION') {
        updated.heading = firstH.content.text;
      } else {
        updated.title = firstH.content.text;
      }
    }
    if (firstH.content?.badge !== undefined) {
      updated.badge = firstH.content.badge;
    }
  }

  // 2. Subtitles & Paragraphs
  const paragraphBlocks = allBlocks.filter((b) => b.type === 'PARAGRAPH');
  if (paragraphBlocks.length > 0) {
    if (norm === 'QUOTE') {
      const quoteBlock = paragraphBlocks.find(p => p.content?.text?.startsWith('"') || p.content?.text?.startsWith('“')) || paragraphBlocks[0];
      if (quoteBlock?.content?.text) {
        updated.quoteText = quoteBlock.content.text.replace(/^[“"']|[”"']$/g, '');
      }
      if (headingBlocks.length > 1 && headingBlocks[1].content?.text) {
        updated.authorName = headingBlocks[1].content.text;
        if (headingBlocks[1].content.badge) {
          updated.designation = headingBlocks[1].content.badge;
        }
      }
    } else if (norm === 'TEXT') {
      if (paragraphBlocks[0]?.content?.text) {
        updated.leadText = paragraphBlocks[0].content.text;
      }
      if (paragraphBlocks.length > 1) {
        updated.bodyHtml = paragraphBlocks.slice(1).map(p => p.content?.text || '').join('\n\n');
        updated.text = updated.bodyHtml;
      }
    } else if (norm === 'IMAGE_TEXT') {
      if (paragraphBlocks[0]?.content?.text) {
        updated.description = paragraphBlocks[0].content.text;
      }
      const pointParagraphs = paragraphBlocks.filter(p => p.content?.text?.startsWith('✓') || p.content?.text?.startsWith('•'));
      if (pointParagraphs.length > 0) {
        updated.points = pointParagraphs.map(p => p.content.text.replace(/^[✓•\s]+/, '').trim());
      }
    } else if (norm === 'HERO' || norm === 'HERO_BANNER') {
      if (paragraphBlocks[0]?.content?.text) {
        updated.description = paragraphBlocks[0].content.text;
        updated.subtitle = paragraphBlocks[0].content.text;
      }
    } else {
      if (paragraphBlocks[0]?.content?.text) {
        updated.subtitle = paragraphBlocks[0].content.text;
        updated.description = paragraphBlocks[0].content.text;
      }
    }
  }

  // 3. Action Buttons
  const buttonBlocks = allBlocks.filter((b) => b.type === 'BUTTON' || (b as any).type === 'ACTION_BUTTON');
  if (buttonBlocks.length > 0) {
    const btn1 = buttonBlocks[0];
    const btn1Label = btn1.content?.label || btn1.content?.text;
    const btn1Url = btn1.content?.url || btn1.content?.linkUrl;
    if (btn1Label) {
      updated.ctaText = btn1Label;
      updated.buttonText = btn1Label;
    }
    if (btn1Url) {
      updated.ctaLink = btn1Url;
      updated.buttonUrl = btn1Url;
    }

    if (buttonBlocks.length > 1) {
      const btn2 = buttonBlocks[1];
      const btn2Label = btn2.content?.label || btn2.content?.text;
      const btn2Url = btn2.content?.url || btn2.content?.linkUrl;
      if (btn2Label) {
        updated.secondaryCtaText = btn2Label;
        updated.secondaryButtonText = btn2Label;
      }
      if (btn2Url) {
        updated.secondaryCtaLink = btn2Url;
        updated.secondaryButtonUrl = btn2Url;
      }
    }
  }

  // 4. Images
  const imageBlocks = allBlocks.filter((b) => b.type === 'IMAGE');
  if (imageBlocks.length > 0) {
    const img1 = imageBlocks[0];
    if (img1.content?.imageUrl) {
      updated.imageUrl = img1.content.imageUrl;
    }
    if (img1.content?.caption) {
      updated.caption = img1.content.caption;
    }
    if (img1.content?.alt) {
      updated.alt = img1.content.alt;
    }

    if (norm === 'GALLERY') {
      updated.images = imageBlocks.map((img, idx) => ({
        imageUrl: img.content?.imageUrl || '',
        title: img.content?.caption || `Photo ${idx + 1}`,
        caption: img.content?.caption || '',
        alt: img.content?.alt || `Gallery image ${idx + 1}`,
      }));
    }
  }

  // 5. PDF Documents
  const docBlocks = allBlocks.filter((b) => b.type === 'DOCUMENT_PDF');
  if (docBlocks.length > 0) {
    updated.documents = docBlocks.map((d) => ({
      title: d.content?.title || 'Document.pdf',
      description: d.content?.description || '',
      fileUrl: d.content?.fileUrl || '#',
      fileType: d.content?.fileType || 'PDF',
      fileSize: d.content?.fileSize || '2.4 MB',
      publishDate: d.content?.publishDate || '',
    }));
  }

  // 6. Metric Counters / Stats
  const statBlocks = allBlocks.filter((b) => b.type === 'STAT_COUNTER' || (b as any).type === 'STAT_METRIC');
  if (statBlocks.length > 0) {
    updated.items = statBlocks.map((s) => ({
      label: s.content?.label || '',
      value: s.content?.value || '0',
      prefix: s.content?.prefix || '',
      suffix: s.content?.suffix || '',
      description: s.content?.description || '',
      iconName: s.content?.iconName || 'Award',
    }));
  }

  // 7. Icon Features, Cards & Timelines
  const iconBlocks = allBlocks.filter((b) => b.type === 'ICON_BOX');
  if (iconBlocks.length > 0) {
    if (norm === 'CARDS' || norm === 'ICON_CARDS') {
      updated.items = iconBlocks.map((c) => ({
        title: c.content?.title || '',
        description: c.content?.description || '',
        desc: c.content?.description || '',
        badge: c.content?.badge || '',
      }));
    } else if (norm === 'TIMELINE' || norm === 'MILESTONES' || norm === 'HISTORY') {
      updated.items = iconBlocks.map((c) => ({
        year: c.content?.badge || '',
        title: c.content?.title || '',
        description: c.content?.description || '',
      }));
    } else if (norm === 'FAQ') {
      updated.items = iconBlocks.map((c) => ({
        question: (c.content?.title || '').replace(/^Q:\s*/, ''),
        answer: c.content?.description || '',
      }));
    } else if (norm === 'TABS' || norm === 'CONTENT_TABS' || norm === 'TABS_LAYOUT') {
      updated.tabs = iconBlocks.map((c, idx) => ({
        title: c.content?.title || `Tab ${idx + 1}`,
        content: c.content?.description || '',
        badge: c.content?.badge || '',
      }));
    } else if (norm === 'HERO_SLIDER' || norm === 'BANNERS') {
      updated.slides = iconBlocks.map((c, idx) => ({
        headline: c.content?.title || `Slide ${idx + 1}`,
        caption: c.content?.description || '',
        badge: c.content?.badge || '',
      }));
    } else if (norm === 'TESTIMONIALS' || norm === 'TESTIMONIAL' || norm === 'REVIEWS' || norm === 'ALUMNI_STORIES') {
      updated.testimonials = iconBlocks.map((c) => ({
        quote: (c.content?.title || '').replace(/^[“"']|[”"']$/g, ''),
        name: (c.content?.description || '').split('•')[0]?.trim() || '',
        role: (c.content?.description || '').split('•')[1]?.trim() || '',
      }));
    }
  }

  // 8. Video Popups
  const videoBlocks = allBlocks.filter((b) => b.type === 'VIDEO_POPUP');
  if (videoBlocks.length > 0) {
    const v = videoBlocks[0];
    if (v.content?.videoUrl) updated.videoUrl = v.content.videoUrl;
    if (v.content?.coverImageUrl) updated.coverImageUrl = v.content.coverImageUrl;
    if (v.content?.title) updated.title = v.content.title;
    if (v.content?.duration) updated.duration = v.content.duration;
  }

  // 9. Countdown Timers
  const timerBlocks = allBlocks.filter((b) => b.type === 'COUNTDOWN_TIMER');
  if (timerBlocks.length > 0) {
    const t = timerBlocks[0];
    if (t.content?.targetDate) updated.targetDate = t.content.targetDate;
    if (t.content?.eventTitle) updated.eventTitle = t.content.eventTitle;
    if (t.content?.eventSubtitle) updated.eventSubtitle = t.content.eventSubtitle;
    if (t.content?.ctaButtonText) updated.ctaButtonText = t.content.ctaButtonText;
    if (t.content?.ctaButtonUrl) updated.ctaButtonUrl = t.content.ctaButtonUrl;
  }

  // 10. Accordion / FAQ Panels
  const accordionBlocks = allBlocks.filter((b) => b.type === 'ACCORDION');
  if (accordionBlocks.length > 0) {
    const acc = accordionBlocks[0];
    if (Array.isArray(acc.content?.items)) {
      if (norm === 'FAQ') {
        updated.items = acc.content.items.map((it: any) => ({
          question: it.title || '',
          answer: it.content || '',
        }));
      } else {
        updated.items = acc.content.items;
      }
    }
  }

  // 11. Tabs Switcher sync
  const tabsBlock = allBlocks.find((b) => b.type === 'TABS_SWITCHER');
  if (tabsBlock && Array.isArray(tabsBlock.content?.tabs)) {
    updated.tabs = tabsBlock.content.tabs;
  }

  // 12. Timeline Roadmap sync
  const timelineBlock = allBlocks.find((b) => b.type === 'TIMELINE_ROADMAP');
  if (timelineBlock && Array.isArray(timelineBlock.content?.items)) {
    updated.items = timelineBlock.content.items;
  }

  // 13. Faculty Grid sync
  const facultyBlock = allBlocks.find((b) => b.type === 'FACULTY_GRID');
  if (facultyBlock && Array.isArray(facultyBlock.content?.members)) {
    updated.members = facultyBlock.content.members;
  }

  // 14. Notices List sync
  const noticesBlock = allBlocks.find((b) => b.type === 'NOTICES_LIST');
  if (noticesBlock && Array.isArray(noticesBlock.content?.notices)) {
    updated.notices = noticesBlock.content.notices;
  }

  // 15. Logo Matrix sync
  const logoBlock = allBlocks.find((b) => b.type === 'LOGO_MATRIX');
  if (logoBlock && Array.isArray(logoBlock.content?.partners)) {
    updated.partners = logoBlock.content.partners;
  }

  // 16. Course Cards sync
  const courseBlock = allBlocks.find((b) => b.type === 'COURSE_CARDS');
  if (courseBlock && Array.isArray(courseBlock.content?.courses)) {
    updated.courses = courseBlock.content.courses;
  }

  // 17. Map Embed sync
  const mapBlock = allBlocks.find((b) => b.type === 'MAP_EMBED');
  if (mapBlock && mapBlock.content) {
    if (mapBlock.content.campusName) updated.campusName = mapBlock.content.campusName;
    if (mapBlock.content.address) updated.address = mapBlock.content.address;
    if (mapBlock.content.phone) updated.phone = mapBlock.content.phone;
    if (mapBlock.content.officeHours) updated.officeHours = mapBlock.content.officeHours;
    if (mapBlock.content.mapEmbedUrl) updated.mapEmbedUrl = mapBlock.content.mapEmbedUrl;
    if (mapBlock.content.ctaText) updated.ctaText = mapBlock.content.ctaText;
  }

  // 18. Table sync
  const tableBlock = allBlocks.find((b) => b.type === 'TABLE');
  if (tableBlock && tableBlock.tableData) {
    updated.tableData = tableBlock.tableData;
  }

  // 19. Quote & Leadership sync
  if (norm === 'QUOTE') {
    const authorImgBlock = allBlocks.find(
      (b) => b.type === 'IMAGE' && (b.id.includes('author') || b.styles?.aspectRatio === 'circle' || b.styles?.width === '100px')
    );
    if (authorImgBlock?.content?.imageUrl) {
      updated.authorImageUrl = authorImgBlock.content.imageUrl;
      updated.authorImage = authorImgBlock.content.imageUrl;
    }
    const quotePara = allBlocks.find((b) => b.type === 'PARAGRAPH' && b.id.includes('quote'));
    if (quotePara?.content?.text) {
      updated.quoteText = quotePara.content.text.replace(/^[“"']|[”"']$/g, '');
    }
    const authorHeading = allBlocks.find((b) => b.type === 'HEADING' && b.id.includes('author'));
    if (authorHeading?.content?.text) {
      updated.authorName = authorHeading.content.text;
    }
    if (authorHeading?.content?.badge) {
      updated.designation = authorHeading.content.badge;
    }
  }

  return updated;
}
